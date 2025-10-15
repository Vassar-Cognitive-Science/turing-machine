import type { Rule, SharedMachineState } from '../../types';
import { useMachineStore, useTapeStore, useTrialStore } from '../../stores';

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

// The grading system now uses the same execution engine as the main app
// This ensures consistent results between manual testing and automated grading

// Execute a single test case against a machine using the same engine as the main app
export async function executeTest(
  machineState: SharedMachineState,
  testCase: TestCase
): Promise<TestResult> {
  console.log(`\n=== Executing test: ${testCase.name} ===`);
  console.log(`Input: "${testCase.input}"`);
  console.log(`Expected: "${testCase.expected}"`);

  try {
    // Check if machine state has the expected structure
    if (!machineState.machine?.rules || !Array.isArray(machineState.machine.rules)) {
      console.error('Invalid machine state:', machineState);
      throw new Error('Invalid machine state: missing rules');
    }

    // Load the machine state into the stores
    const machineStore = useMachineStore.getState();
    const tapeStore = useTapeStore.getState();
    const trialStore = useTrialStore.getState();

    // Save current state to restore later
    const originalRules = machineStore.getAllRules();
    const originalTape = tapeStore.getTapeAsString();
    const originalState = tapeStore.tapeInternalState;

    try {
      // Load the machine rules
      machineStore.clearAllRules();
      machineStore.loadRules(machineState.machine.rules);

      // Create a temporary trial for this test
      const startState = testCase.startState || '0';

      // Add trial
      (trialStore as any).addTrial(
        testCase.name,
        startState,
        testCase.input,
        testCase.expected,
        0, // tapePointer
        0, // expectedTapePointer
        0, // startTapeHead
        0  // expectedTapeHead
      );

      // Get the trial ID (it's the last one added)
      const trialId = (trialStore as any).testsById[(trialStore as any).testsById.length - 1];

      // Execute the trial using the same engine as the main app
      const result = await (trialStore as any).executeTrial(trialId, false);

      // Clean up the trial
      (trialStore as any).deleteTrial(trialId);

      console.log(`Test result: ${result.passed ? 'PASSED' : 'FAILED'}`);
      console.log(`Steps: ${result.steps}`);
      console.log(`Actual output: "${result.output}"`);

      return {
        passed: result.passed,
        actualOutput: result.output,
        expectedOutput: testCase.expected,
        steps: result.steps,
        executionTime: result.executionTime,
        error: result.error,
        machineRuleCount: result.machineRuleCount,
        machineUniqueStates: result.machineUniqueStates,
      };

    } finally {
      // Restore original state
      machineStore.clearAllRules();
      if (originalRules.length > 0) {
        machineStore.loadRules(originalRules);
      }
      tapeStore.setInternalState(originalState);
      tapeStore.fillTape(originalTape);
    }

  } catch (error) {
    return {
      passed: false,
      actualOutput: '',
      expectedOutput: testCase.expected,
      steps: 0,
      executionTime: 0,
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