import type { Rule, SharedMachineState } from '../../types';

interface TestCase {
  name: string;
  input: string;
  expected: string;
  startState?: string;
}

interface TestResult {
  passed: boolean;
  actualOutput: string;
  expectedOutput: string;
  steps: number;
  executionTime: number;
  error?: string;
}

// Constants
const MAX_TEST_STEP_LIMIT = 10000;

// Normalize tape output by removing leading/trailing blank symbols
const normalizeTapeOutput = (output: string): string => {
  let normalized = output
    .replace(/#/g, ' ')
    .replace(/∅/g, ' ')
    .replace(/\u2205/g, ' ')
    .replace(/_/g, ' ');
  
  normalized = normalized.trim();
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
};

// Simple tape implementation for headless execution
class HeadlessTape {
  private cells: Map<number, string> = new Map();
  private headPosition: number = 0;
  private currentState: string = '0';

  constructor(initialContent: string = '', startState: string = '0') {
    this.currentState = startState;
    this.loadContent(initialContent);
  }

  private loadContent(content: string): void {
    this.cells.clear();
    this.headPosition = 0;
    
    // Load content starting from position 0
    for (let i = 0; i < content.length; i++) {
      this.cells.set(i, content[i]);
    }
  }

  readCurrentCell(): string {
    const value = this.cells.get(this.headPosition);
    // Handle both undefined/null and explicit blank symbols
    if (value === undefined || value === null || value === '') {
      return '#';
    }
    return value;
  }

  writeCurrentCell(symbol: string): void {
    if (symbol === '#' || symbol === '∅' || symbol === '') {
      this.cells.delete(this.headPosition);
    } else {
      this.cells.set(this.headPosition, symbol);
    }
  }

  moveLeft(): void {
    this.headPosition--;
  }

  moveRight(): void {
    this.headPosition++;
  }

  setState(state: string): void {
    this.currentState = state;
  }

  getState(): string {
    return this.currentState;
  }

  getContent(): string {
    if (this.cells.size === 0) return '';
    
    const minPos = Math.min(...this.cells.keys());
    const maxPos = Math.max(...this.cells.keys());
    
    let result = '';
    for (let i = minPos; i <= maxPos; i++) {
      result += this.cells.get(i) || '#';
    }
    
    // Remove leading and trailing blanks
    return result.replace(/^#+/, '').replace(/#+$/, '');
  }
}

// Find matching rule from rules array
function findMatchingRule(rules: Rule[], currentState: string, currentSymbol: string): Rule | null {
  // Normalize blank symbols for comparison
  const normalizeBlank = (symbol: string): string => {
    if (symbol === '#' || symbol === '∅' || symbol === '' || symbol === '_') {
      return '#';
    }
    return symbol;
  };
  
  const normalizedCurrentSymbol = normalizeBlank(currentSymbol);
  
  return rules.find(rule => {
    const normalizedRuleRead = normalizeBlank(rule.read);
    return rule.in_state === currentState && normalizedRuleRead === normalizedCurrentSymbol;
  }) || null;
}

// Execute a single test case against a machine
export async function executeTest(
  machineState: SharedMachineState, 
  testCase: TestCase
): Promise<TestResult> {
  const startTime = Date.now();
  
  console.log(`\n=== Executing test: ${testCase.name} ===`);
  console.log(`Input: "${testCase.input}"`);
  console.log(`Expected: "${testCase.expected}"`);
  
  try {
    // Check if machine state has the expected structure
    if (!machineState.machine?.rules || !Array.isArray(machineState.machine.rules)) {
      console.error('Invalid machine state:', machineState);
      throw new Error('Invalid machine state: missing rules');
    }

    const rules = machineState.machine.rules;
    console.log(`Rules available: ${rules.length}`);
    console.log('Rules:', rules.map((r: Rule) => `${r.in_state}/${r.read} → ${r.write}/${r.direction}/${r.new_state}`));
    
    const startState = testCase.startState || '0';
    const tape = new HeadlessTape(testCase.input, startState);
    console.log(`Initial state: ${tape.getState()}, Initial symbol: ${tape.readCurrentCell()}`);
    
    let steps = 0;
    
    // Execute machine
    while (steps < MAX_TEST_STEP_LIMIT) {
      const currentState = tape.getState();
      const currentSymbol = tape.readCurrentCell();
      
      if (steps < 5) {
        console.log(`Step ${steps}: State=${currentState}, Symbol='${currentSymbol}', Tape='${tape.getContent()}'`);
      }
      
      // Check for halt state
      if (currentState.toLowerCase() === 'halt') {
        const finalOutput = tape.getContent();
        const normalizedActual = normalizeTapeOutput(finalOutput);
        const normalizedExpected = normalizeTapeOutput(testCase.expected);
        
        console.log(`HALTED after ${steps} steps`);
        console.log(`Final output: "${finalOutput}"`);
        console.log(`Normalized actual: "${normalizedActual}"`);
        console.log(`Normalized expected: "${normalizedExpected}"`);
        console.log(`Test passed: ${normalizedActual === normalizedExpected}`);
        
        return {
          passed: normalizedActual === normalizedExpected,
          actualOutput: finalOutput,
          expectedOutput: testCase.expected,
          steps,
          executionTime: Date.now() - startTime,
        };
      }
      
      // Find matching rule
      const rule = findMatchingRule(rules, currentState, currentSymbol);
      
      if (!rule) {
        console.log(`NO RULE FOUND for state='${currentState}', symbol='${currentSymbol}'`);
        return {
          passed: false,
          actualOutput: tape.getContent(),
          expectedOutput: testCase.expected,
          steps,
          executionTime: Date.now() - startTime,
          error: `No rule matches: READ '${currentSymbol}' in STATE '${currentState}' (after ${steps} step(s))`,
        };
      }
      
      if (steps < 5) {
        console.log(`  Applying rule: ${rule.in_state}/${rule.read} → ${rule.write}/${rule.direction}/${rule.new_state}`);
      }
      
      // Execute rule
      const normalizeBlankForWrite = (symbol: string): string => {
        if (symbol === '∅' || symbol === '' || symbol === '_') {
          return '#';
        }
        return symbol;
      };
      
      const writeValue = normalizeBlankForWrite(rule.write || '#');
      tape.writeCurrentCell(writeValue);
      tape.setState(rule.new_state);
      
      // Move head
      if (rule.direction === 'L') {
        tape.moveLeft();
      } else {
        tape.moveRight();
      }
      
      steps++;
    }
    
    // Timeout - infinite loop detected
    return {
      passed: false,
      actualOutput: tape.getContent(),
      expectedOutput: testCase.expected,
      steps,
      executionTime: Date.now() - startTime,
      error: `Test stopped after ${steps} steps (maximum limit: ${MAX_TEST_STEP_LIMIT}). Machine may be in an infinite loop.`,
    };
    
  } catch (error) {
    return {
      passed: false,
      actualOutput: '',
      expectedOutput: testCase.expected,
      steps: 0,
      executionTime: Date.now() - startTime,
      error: (error as Error).message,
    };
  }
}

// Execute all test cases against a machine
export async function executeAllTests(
  machineState: SharedMachineState,
  testCases: TestCase[]
): Promise<TestResult[]> {
  const results: TestResult[] = [];
  
  for (const testCase of testCases) {
    const result = await executeTest(machineState, testCase);
    results.push(result);
  }
  
  return results;
}