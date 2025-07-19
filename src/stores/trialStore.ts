import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Trial, TrialStore } from '../types';

// Constants
const MAX_TEST_STEP_LIMIT = 100000;

// Trial test result statuses
const TEST_STATUS = {
  PENDING: 'pending' as const,
  RUNNING: 'running' as const,
  PASSED: 'passed' as const,
  FAILED: 'failed' as const,
  ERROR: 'error' as const,
  TIMEOUT: 'timeout' as const,
};

type TestStatus = typeof TEST_STATUS[keyof typeof TEST_STATUS];

// Generate unique trial ID
const generateTrialId = (): string => {
  return `trial_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

interface TrialData {
  id: string;
  name: string;
  startState: string;
  startTape: string;
  expectedTape: string;
  tapePointer: number;
  expectedTapePointer: number;
  startTapeHead: number;
  expectedTapeHead: number;
  status: TestStatus;
  result: TrialResult | null;
  error: string | null;
  executionTime: number;
  steps: number;
  actualOutput: string;
  createdAt: string;
}

interface TrialResult {
  passed: boolean;
  output: string;
  steps: number;
  executionTime: number;
  finalState: string;
  error?: string;
}

interface TrialStats {
  total: number;
  passed: number;
  failed: number;
  errors: number;
  pending: number;
  running: number;
}

interface TrialUpdates {
  name?: string;
  startState?: string;
  startTape?: string;
  expectedTape?: string;
  tapePointer?: number;
  expectedTapePointer?: number;
  startTapeHead?: number;
  expectedTapeHead?: number;
  status?: TestStatus;
  result?: TrialResult | null;
  error?: string | null;
  executionTime?: number;
  steps?: number;
  actualOutput?: string;
}

// Extended state for internal store management
interface InternalTrialState {
  // Trial management
  testsById: string[]; // Array of trial IDs
  isRunningTrial: boolean;
  runningTrials: string[]; // Array of currently running trial IDs
  
  // Edit mode
  isEdittingTrial: boolean;
  isEdittingExpectedTape: boolean;
  edittingTrialId: string | null;
  edittingTrialName: string | null;
  anyChangeInTrial: boolean;
  
  // Editing state backup
  originalTape: string | null;
  edittingStartTape: string | null;
  edittingExpectedTape: string | null;
  
  // Trial data stored as dynamic properties
  [key: string]: any; // For trial data
}

// Initial trial state
const initialTrialState: InternalTrialState = {
  // Trial management
  testsById: [], // Array of trial IDs
  isRunningTrial: false,
  runningTrials: [], // Array of currently running trial IDs
  
  // Edit mode
  isEdittingTrial: false,
  isEdittingExpectedTape: false,
  edittingTrialId: null,
  edittingTrialName: null,
  anyChangeInTrial: false,
  
  // Editing state backup
  originalTape: null,
  edittingStartTape: null,
  edittingExpectedTape: null,
};

export const useTrialStore = create<TrialStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialTrialState,

      // Trial CRUD operations
      addTrial: (
        name: string, 
        startState: string = "0", 
        startTape: string = "", 
        expectedTape: string = "", 
        tapePointer: number = 0, 
        expectedTapePointer: number = 0, 
        startTapeHead: number = 0, 
        expectedTapeHead: number = 0
      ): void => {
        set((state) => {
          const trialId = generateTrialId();
          
          state.testsById.push(trialId);
          (state as any)[trialId] = {
            id: trialId,
            name: name || `Test Case #${state.testsById.length}`,
            startState: startState,
            startTape: startTape,
            expectedTape: expectedTape,
            tapePointer: tapePointer,
            expectedTapePointer: expectedTapePointer,
            startTapeHead: startTapeHead,
            expectedTapeHead: expectedTapeHead,
            status: TEST_STATUS.PENDING,
            result: null,
            error: null,
            executionTime: 0,
            steps: 0,
            actualOutput: "",
            createdAt: new Date().toISOString(),
          } as TrialData;
        });
      },

      deleteTrial: (trialId: string): void => {
        set((state) => {
          state.testsById = state.testsById.filter(id => id !== trialId);
          delete (state as any)[trialId];
          
          // Remove from running trials if present
          state.runningTrials = state.runningTrials.filter(id => id !== trialId);
          
          // Clear edit mode if this trial was being edited
          if (state.edittingTrialId === trialId) {
            state.isEdittingTrial = false;
            state.edittingTrialId = null;
            state.edittingTrialName = null;
            state.anyChangeInTrial = false;
          }
        });
      },

      updateTrial: (trialId: string, updates: TrialUpdates): void => {
        set((state) => {
          if ((state as any)[trialId]) {
            Object.assign((state as any)[trialId], updates);
            if (state.edittingTrialId === trialId) {
              state.anyChangeInTrial = true;
            }
          }
        });
      },

      // Trial execution
      runTrial: async (trialId: string): Promise<void> => {
        const trial = (get() as any)[trialId];
        if (!trial) return;

        set((state) => {
          state.runningTrials.push(trialId);
          (state as any)[trialId].status = TEST_STATUS.RUNNING;
          (state as any)[trialId].result = null;
          (state as any)[trialId].error = null;
        });

        try {
          // This would integrate with the machine store to actually run the trial
          // For now, we'll simulate the execution
          const result = await get().executeTrial(trialId);
          
          set((state) => {
            state.runningTrials = state.runningTrials.filter(id => id !== trialId);
            (state as any)[trialId].status = result.passed ? TEST_STATUS.PASSED : TEST_STATUS.FAILED;
            (state as any)[trialId].result = result;
            (state as any)[trialId].actualOutput = result.output;
            (state as any)[trialId].steps = result.steps;
            (state as any)[trialId].executionTime = result.executionTime;
          });
        } catch (error) {
          set((state) => {
            state.runningTrials = state.runningTrials.filter(id => id !== trialId);
            (state as any)[trialId].status = TEST_STATUS.ERROR;
            (state as any)[trialId].error = (error as Error).message;
          });
        }
      },

      runAllTrials: async (): Promise<void> => {
        set((state) => {
          state.isRunningTrial = true;
        });

        const trials = get().testsById;
        const promises = trials.map(trialId => get().runTrial(trialId));
        
        try {
          await Promise.all(promises);
        } finally {
          set((state) => {
            state.isRunningTrial = false;
          });
        }
      },

      // Real trial execution using machine stores
      executeTrial: async (trialId: string): Promise<TrialResult> => {
        return new Promise((resolve, reject) => {
          const trial = (get() as any)[trialId];
          if (!trial) {
            reject(new Error('Trial not found'));
            return;
          }

          try {
            // Import the machine stores
            const { useMachineStore, useTapeStore } = require('./index');
            const machineStore = useMachineStore.getState();
            const tapeStore = useTapeStore.getState();
            
            // Save current state
            const originalState = {
              tapeInternalState: tapeStore.tapeInternalState,
              tapeContent: tapeStore.getTapeAsString(),
              headPosition: tapeStore.getCurrentHeadPosition()
            };
            
            // Set up trial conditions
            tapeStore.setInternalState(trial.startState);
            tapeStore.fillTape(trial.startTape);
            
            // Run the machine
            let steps = 0;
            const maxSteps = 1000;
            const startTime = Date.now();
            
            const executeStep = (): void => {
              steps++;
              
              if (steps > maxSteps) {
                // Restore original state
                tapeStore.setInternalState(originalState.tapeInternalState);
                tapeStore.fillTape(originalState.tapeContent);
                
                resolve({
                  passed: false,
                  output: tapeStore.getTapeAsString(),
                  steps,
                  executionTime: Date.now() - startTime,
                  finalState: tapeStore.tapeInternalState,
                  error: 'Execution exceeded maximum steps'
                });
                return;
              }
              
              // Get current state and symbol
              const currentState = tapeStore.tapeInternalState;
              const currentSymbol = tapeStore.readCurrentCell();
              
              // Check for halt
              if (currentState.toLowerCase() === 'halt') {
                const finalOutput = tapeStore.getTapeAsString();
                const passed = finalOutput === trial.expectedTape;
                
                // Restore original state
                tapeStore.setInternalState(originalState.tapeInternalState);
                tapeStore.fillTape(originalState.tapeContent);
                
                resolve({
                  passed,
                  output: finalOutput,
                  steps,
                  executionTime: Date.now() - startTime,
                  finalState: 'halt'
                });
                return;
              }
              
              // Find matching rule
              const rule = machineStore.matchRule(currentState, currentSymbol);
              
              if (!rule) {
                // Restore original state
                tapeStore.setInternalState(originalState.tapeInternalState);
                tapeStore.fillTape(originalState.tapeContent);
                
                resolve({
                  passed: false,
                  output: tapeStore.getTapeAsString(),
                  steps,
                  executionTime: Date.now() - startTime,
                  finalState: currentState,
                  error: `No rule found for state '${currentState}' and symbol '${currentSymbol}'`
                });
                return;
              }
              
              // Execute the rule
              tapeStore.writeToCurrentCell(rule.write || '∅');
              tapeStore.setInternalState(rule.new_state);
              
              // Move head
              if (rule.direction === 'L' || (rule as any).isLeft) {
                tapeStore.moveHeadLeft();
              } else {
                tapeStore.moveHeadRight();
              }
              
              // Continue execution
              setTimeout(executeStep, 1);
            };
            
            executeStep();
            
          } catch (error) {
            reject(error);
          }
        });
      },

      // Edit mode management
      enterEditMode: (trialId: string, targetType: 'start' | 'expected' = 'start'): void => {
        set((state) => {
          const trial = (state as any)[trialId];
          if (trial) {
            state.isEdittingTrial = true;
            state.edittingTrialId = trialId;
            state.edittingTrialName = trial.name;
            state.isEdittingExpectedTape = targetType === 'expected';
            state.anyChangeInTrial = false;
            
            // Backup current state
            state.originalTape = trial.startTape;
            state.edittingStartTape = trial.startTape;
            state.edittingExpectedTape = trial.expectedTape;
          }
        });
      },

      exitEditMode: (save: boolean = false): void => {
        set((state) => {
          if (save && state.edittingTrialId) {
            // Save changes to the trial
            const trial = (state as any)[state.edittingTrialId];
            if (trial) {
              trial.startTape = state.edittingStartTape;
              trial.expectedTape = state.edittingExpectedTape;
              trial.name = state.edittingTrialName;
            }
          }
          
          // Reset edit mode
          state.isEdittingTrial = false;
          state.isEdittingExpectedTape = false;
          state.edittingTrialId = null;
          state.edittingTrialName = null;
          state.anyChangeInTrial = false;
          state.originalTape = null;
          state.edittingStartTape = null;
          state.edittingExpectedTape = null;
        });
      },

      changeEditingTarget: (targetType: 'start' | 'expected'): void => {
        set((state) => {
          state.isEdittingExpectedTape = targetType === 'expected';
        });
      },

      setTrialName: (name: string): void => {
        set((state) => {
          state.edittingTrialName = name;
          state.anyChangeInTrial = true;
        });
      },

      // Trial results management
      clearTestResults: (): void => {
        set((state) => {
          state.testsById.forEach(trialId => {
            const trial = (state as any)[trialId];
            if (trial) {
              trial.status = TEST_STATUS.PENDING;
              trial.result = null;
              trial.error = null;
              trial.actualOutput = "";
              trial.steps = 0;
              trial.executionTime = 0;
            }
          });
        });
      },

      // File operations
      exportTrials: (): void => {
        const state = get() as any;
        const trials = state.testsById.map((trialId: string) => {
          const trial = state[trialId];
          return {
            name: trial.name,
            startState: trial.startState,
            startTape: trial.startTape,
            expectedTape: trial.expectedTape,
            tapePointer: trial.tapePointer,
            expectedTapePointer: trial.expectedTapePointer,
            startTapeHead: trial.startTapeHead,
            expectedTapeHead: trial.expectedTapeHead,
          };
        });

        const dataStr = JSON.stringify(trials, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = `turing-machine-tests-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
      },

      importTrials: (trialsData: Partial<TrialData>[]): void => {
        set((state) => {
          trialsData.forEach(trialData => {
            const trialId = generateTrialId();
            state.testsById.push(trialId);
            (state as any)[trialId] = {
              id: trialId,
              ...trialData,
              status: TEST_STATUS.PENDING,
              result: null,
              error: null,
              executionTime: 0,
              steps: 0,
              actualOutput: "",
              createdAt: new Date().toISOString(),
            } as TrialData;
          });
        });
      },

      // Utility functions
      getTrial: (trialId: string): TrialData | null => {
        const state = get() as any;
        return state[trialId] || null;
      },

      getAllTrials: (): TrialData[] => {
        const state = get() as any;
        return state.testsById.map((trialId: string) => state[trialId]);
      },

      getTrialStats: (): TrialStats => {
        const state = get() as any;
        const trials = state.testsById.map((trialId: string) => state[trialId]);
        
        return {
          total: trials.length,
          passed: trials.filter((t: TrialData) => t.status === TEST_STATUS.PASSED).length,
          failed: trials.filter((t: TrialData) => t.status === TEST_STATUS.FAILED).length,
          errors: trials.filter((t: TrialData) => t.status === TEST_STATUS.ERROR).length,
          pending: trials.filter((t: TrialData) => t.status === TEST_STATUS.PENDING).length,
          running: trials.filter((t: TrialData) => t.status === TEST_STATUS.RUNNING).length,
        };
      },

      isTrialRunning: (trialId: string): boolean => {
        const state = get();
        return state.runningTrials.includes(trialId);
      },
    }))
  )
);

export default useTrialStore;