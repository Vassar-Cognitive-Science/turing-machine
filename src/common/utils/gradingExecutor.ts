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
  machineRuleCount?: number;
  machineUniqueStates?: number;
}

// Constants
const MAX_TEST_STEP_LIMIT = 2000;

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

// Clean tape output for display
const cleanTapeOutput = (output: string): string => {
  return output
    .replace(/^#+/, '')
    .replace(/#+$/, '')
    .replace(/^∅+/, '')
    .replace(/∅+$/, '')
    .trim();
};

// Capitalize alphabet characters (mimic main app behavior)
const capitalizeAlphabet = (value: string): string => {
  if (!value) return value;
  return value.trim().replace(/[a-z]/g, (char) => char.toUpperCase());
};

// Simple tape implementation for isolated execution
class IsolatedTape {
  private cells: Map<number, string> = new Map();
  private headPosition: number = 0;
  private currentState: string = '0';

  constructor(initialContent: string = '', startState: string = '0') {
    this.currentState = capitalizeAlphabet(startState);
    this.loadContent(initialContent);
  }

  private loadContent(content: string): void {
    this.cells.clear();
    this.headPosition = 0;

    for (let i = 0; i < content.length; i++) {
      const char = content[i];
      const processedChar = (char === ' ' || char === '#' || char === '∅') ? '#' : capitalizeAlphabet(char);
      if (processedChar !== '#') {
        this.cells.set(i, processedChar);
      }
    }
  }

  readCurrentCell(): string {
    const value = this.cells.get(this.headPosition);
    return value || '#';
  }

  writeCurrentCell(symbol: string): void {
    const processed = capitalizeAlphabet(symbol || '#');
    if (processed === '#' || processed === '∅' || processed === '') {
      this.cells.delete(this.headPosition);
    } else {
      this.cells.set(this.headPosition, processed);
    }
  }

  moveLeft(): void {
    this.headPosition--;
  }

  moveRight(): void {
    this.headPosition++;
  }

  setState(state: string): void {
    this.currentState = capitalizeAlphabet(state);
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

    return cleanTapeOutput(result);
  }
}

// Find matching rule using the same logic as main app
function matchRule(rules: Rule[], currentState: string, readSymbol: string): Rule | null {
  const normalizedCurrentState = capitalizeAlphabet(currentState || '');
  const normalizedReadSymbol = capitalizeAlphabet(readSymbol || '');

  if (!normalizedCurrentState) return null;

  let exactMatch: Rule | null = null;
  let wildcardMatch: Rule | null = null;

  for (const rule of rules) {
    if (!rule || !rule.in_state || rule.in_state.trim() === '') {
      continue;
    }

    const normalizedRuleState = capitalizeAlphabet(rule.in_state || '');
    const normalizedRuleRead = capitalizeAlphabet(rule.read || '');

    if (normalizedRuleState === normalizedCurrentState) {
      if (normalizedRuleRead === normalizedReadSymbol ||
          (rule.read === '' && readSymbol === '#') ||
          (rule.read === '#' && readSymbol === '#')) {
        exactMatch = rule;
        break;
      } else if (rule.read === "*" || rule.read === "∗") {
        wildcardMatch = rule;
      }
    }
  }

  return exactMatch || wildcardMatch;
}

// Execute a single test case - mirrors the trial execution logic
export async function executeTest(
  machineState: SharedMachineState,
  testCase: TestCase
): Promise<TestResult> {
  console.log(`\n=== Executing test: ${testCase.name} ===`);
  const startTime = Date.now();

  try {
    if (!machineState.machine?.rules || !Array.isArray(machineState.machine.rules)) {
      throw new Error('Invalid machine state: missing rules');
    }

    const rules = machineState.machine.rules;

    // Calculate machine metrics
    const ruleCount = rules.length;
    const uniqueStates = new Set<string>();
    rules.forEach((rule: Rule) => {
      if (rule.in_state) uniqueStates.add(capitalizeAlphabet(rule.in_state));
      if (rule.new_state) uniqueStates.add(capitalizeAlphabet(rule.new_state));
    });
    const uniqueStateCount = uniqueStates.size;

    const startState = testCase.startState || '0';
    const tape = new IsolatedTape(testCase.input, startState);

    let steps = 0;

    // Execute machine
    while (steps < MAX_TEST_STEP_LIMIT) {
      // Yield to event loop every 100 steps to prevent browser freeze
      if (steps % 100 === 0 && steps > 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }

      const currentState = tape.getState();
      const currentSymbol = tape.readCurrentCell();

      // Check for halt
      if (currentState.toLowerCase() === 'halt') {
        const finalOutput = tape.getContent();
        const normalizedFinal = normalizeTapeOutput(finalOutput).toLowerCase();
        const normalizedExpected = normalizeTapeOutput(testCase.expected).toLowerCase();
        const passed = normalizedFinal === normalizedExpected;

        return {
          passed,
          actualOutput: finalOutput,
          expectedOutput: testCase.expected,
          steps,
          executionTime: Date.now() - startTime,
          machineRuleCount: ruleCount,
          machineUniqueStates: uniqueStateCount
        };
      }

      // Find matching rule
      const rule = matchRule(rules, currentState, currentSymbol);

      if (!rule) {
        return {
          passed: false,
          actualOutput: tape.getContent(),
          expectedOutput: testCase.expected,
          steps,
          executionTime: Date.now() - startTime,
          error: `No rule matches: READ '${currentSymbol}' in STATE '${currentState}' (after ${steps} step(s))`,
          machineRuleCount: ruleCount,
          machineUniqueStates: uniqueStateCount
        };
      }

      // Execute rule
      const writeValue = (rule.write === '*' || rule.write === '∗') ? currentSymbol : (rule.write || '#');
      tape.writeCurrentCell(writeValue);
      tape.setState(rule.new_state);

      if (rule.direction === 'L') {
        tape.moveLeft();
      } else {
        tape.moveRight();
      }

      steps++;
    }

    // Timeout
    return {
      passed: false,
      actualOutput: tape.getContent(),
      expectedOutput: testCase.expected,
      steps,
      executionTime: Date.now() - startTime,
      error: `Test stopped after ${steps} steps (maximum limit: ${MAX_TEST_STEP_LIMIT}). Machine may be in an infinite loop.`,
      machineRuleCount: ruleCount,
      machineUniqueStates: uniqueStateCount
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