import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist } from 'zustand/middleware';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Trial, TrialStore } from '../types';
import { convertTrialsToYAML, convertYAMLToTrials, downloadYAMLFile, validateYAMLTestSuite } from '../common/utils/yamlConverter';

// Constants
const MAX_TEST_STEP_LIMIT = 10000; // Detect infinite loops after 10000 steps

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
  return `trial_${crypto.randomUUID()}`;
};

// Normalize tape output by removing leading/trailing blank symbols but preserving spaces between content
const normalizeTapeOutput = (output: string): string => {
  // First, replace blank symbols with spaces to normalize them
  let normalized = output
    .replace(/#/g, ' ') // Replace blank symbols with spaces
    .replace(/∅/g, ' ') // Replace blank symbols with spaces
    .replace(/\u2205/g, ' ') // Replace Unicode empty set symbol with spaces
    .replace(/_/g, ' '); // Replace underscores with spaces (sometimes used as blanks)
  
  // Remove leading and trailing whitespace (infinite tape blanks)
  normalized = normalized.trim();
  
  // Collapse multiple consecutive spaces into single spaces
  // but preserve single spaces between characters
  normalized = normalized.replace(/\s+/g, ' ');
  
  return normalized;
};

// Clean tape output for display by removing leading/trailing blanks
const cleanTapeOutput = (output: string): string => {
  return output
    .replace(/^#+/, '') // Remove leading blanks
    .replace(/#+$/, '') // Remove trailing blanks
    .replace(/^∅+/, '') // Remove leading blanks (legacy)
    .replace(/∅+$/, '') // Remove trailing blanks (legacy)
    .trim();
};

export interface TrialData {
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
  machineRuleCount?: number;
  machineUniqueStates?: number;
}

interface TrialResult {
  passed: boolean;
  output: string;
  steps: number;
  executionTime: number;
  finalState: string;
  error?: string;
  machineRuleCount?: number;
  machineUniqueStates?: number;
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
  persist(
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
      runTrial: async (trialId: string, restoreState: boolean = false): Promise<void> => {
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
          const result = await get().executeTrial(trialId, restoreState);

          set((state) => {
            state.runningTrials = state.runningTrials.filter(id => id !== trialId);
            (state as any)[trialId].status = result.passed ? TEST_STATUS.PASSED : TEST_STATUS.FAILED;
            (state as any)[trialId].result = result;
            (state as any)[trialId].actualOutput = result.output;
            (state as any)[trialId].steps = result.steps;
            (state as any)[trialId].executionTime = result.executionTime;
            // Copy error to trial level for easier access in UI
            (state as any)[trialId].error = result.error || null;
            // Copy machine metrics to trial level
            (state as any)[trialId].machineRuleCount = result.machineRuleCount;
            (state as any)[trialId].machineUniqueStates = result.machineUniqueStates;
          });
        } catch (error) {
          set((state) => {
            state.runningTrials = state.runningTrials.filter(id => id !== trialId);
            (state as any)[trialId].status = TEST_STATUS.ERROR;
            (state as any)[trialId].error = (error as Error).message;
            // Try to get current tape state even on error
            try {
              const { useTapeStore } = require('./index');
              const currentTapeStore = useTapeStore.getState();
              (state as any)[trialId].actualOutput = cleanTapeOutput(currentTapeStore.getTapeAsString());
            } catch {
              (state as any)[trialId].actualOutput = '(error reading tape)';
            }
          });
        }
      },

      runAllTrials: async (): Promise<void> => {
        set((state) => {
          state.isRunningTrial = true;
        });

        const trials = get().testsById;

        try {
          // Run trials sequentially to avoid interference, with state restoration between tests
          for (const trialId of trials) {
            await get().runTrial(trialId, true);
            // Small delay between trials to allow UI to update
            await new Promise(resolve => setTimeout(resolve, 50));
          }
        } finally {
          set((state) => {
            state.isRunningTrial = false;
          });
        }
      },

      // Real trial execution using machine stores
      executeTrial: async (trialId: string, restoreState: boolean = false): Promise<TrialResult> => {
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
            let tapeStore = useTapeStore.getState();

            // Calculate machine metrics
            const allRules = machineStore.getAllRules();
            const ruleCount = allRules.length;
            const uniqueStates = new Set<string>();
            allRules.forEach((rule: any) => {
              if (rule.in_state) uniqueStates.add(rule.in_state);
              if (rule.new_state) uniqueStates.add(rule.new_state);
            });
            const uniqueStateCount = uniqueStates.size;

            // Save current state
            const originalState = {
              tapeInternalState: tapeStore.tapeInternalState,
              tapeContent: tapeStore.getTapeAsString(),
              headPosition: tapeStore.getCurrentHeadPosition()
            };
            
            // Set up trial conditions
            tapeStore.setInternalState(trial.startState);
            tapeStore.fillTape(trial.startTape);

            // fillTape centers content and places head at start of content
            // Now adjust head position based on trial.startTapeHead (relative to content start)
            const targetOffset = trial.startTapeHead || 0;

            if (targetOffset > 0) {
              // Move right from content start
              for (let i = 0; i < targetOffset; i++) {
                tapeStore.moveHeadRight();
              }
            } else if (targetOffset < 0) {
              // Move left from content start
              for (let i = 0; i < Math.abs(targetOffset); i++) {
                tapeStore.moveHeadLeft();
              }
            }
            // If targetOffset is 0, head is already at content start (fillTape default)
            
            // Get fresh state after setup to ensure all changes are applied
            tapeStore = useTapeStore.getState();
            
            // Run the machine in turbo mode (no delays, direct execution)
            let steps = 0;
            const maxSteps = MAX_TEST_STEP_LIMIT;
            const startTime = Date.now();
            
            // Verify initial setup with fresh state
            const initialState = tapeStore.tapeInternalState;
            const initialSymbol = tapeStore.readCurrentCell();
            const initialTape = tapeStore.getTapeAsString();
            const headPosition = tapeStore.getCurrentHeadPosition();
            
            // Only error if trial start state is not halt but we're somehow still in halt
            if (initialState.toLowerCase() === 'halt' && trial.startState.toLowerCase() !== 'halt') {
              resolve({
                passed: false,
                output: initialTape,
                steps: 0,
                executionTime: Date.now() - startTime,
                finalState: initialState,
                error: `Machine failed to initialize from halt state to '${trial.startState}'`,
                machineRuleCount: ruleCount,
                machineUniqueStates: uniqueStateCount
              });
              return;
            }
            
            // Execute synchronously in a tight loop for maximum speed
            while (steps < maxSteps) {
              // Get fresh tape store state for each iteration
              tapeStore = useTapeStore.getState();
              
              // Get current state and symbol
              const currentState = tapeStore.tapeInternalState;
              const currentSymbol = tapeStore.readCurrentCell();
              
              // Check for halt
              if (currentState.toLowerCase() === 'halt') {
                const finalOutput = tapeStore.getTapeAsString();
                const cleanedFinalOutput = cleanTapeOutput(finalOutput);
                
                // Compare normalized outputs (ignoring blank spaces and case)
                const normalizedFinalOutput = normalizeTapeOutput(finalOutput).toLowerCase();
                const normalizedExpectedOutput = normalizeTapeOutput(trial.expectedTape).toLowerCase();
                const passed = normalizedFinalOutput === normalizedExpectedOutput;
                
                // Only restore state if requested (for batch runs)
                if (restoreState) {
                  tapeStore.setInternalState(originalState.tapeInternalState);
                  tapeStore.fillTape(originalState.tapeContent);
                }
                // For individual test runs, leave tape in final state so user can see result
                
                resolve({
                  passed,
                  output: cleanedFinalOutput, // Return cleaned output without leading/trailing blanks
                  steps,
                  executionTime: Date.now() - startTime,
                  finalState: 'halt',
                  machineRuleCount: ruleCount,
                  machineUniqueStates: uniqueStateCount
                });
                return;
              }
              
              // Find matching rule
              const rule = machineStore.matchRule(currentState, currentSymbol);
              
              if (!rule) {
                // Capture tape output at point of failure BEFORE restoring state
                const failureOutput = cleanTapeOutput(tapeStore.getTapeAsString());
                
                // Restore original state on error
                if (restoreState) {
                  tapeStore.setInternalState(originalState.tapeInternalState);
                  tapeStore.fillTape(originalState.tapeContent);
                }
                
                resolve({
                  passed: false,
                  output: failureOutput, // Use captured output from point of failure
                  steps, // Number of successful steps completed before failure
                  executionTime: Date.now() - startTime,
                  finalState: currentState,
                  error: `No rule matches: READ '${currentSymbol}' in STATE '${currentState}' (after ${steps} step(s))`,
                  machineRuleCount: ruleCount,
                  machineUniqueStates: uniqueStateCount
                });
                return;
              }
              
              // Execute the rule synchronously
              const beforeWrite = tapeStore.getTapeAsString();
              const beforeSymbol = tapeStore.readCurrentCell();
              const beforeState = tapeStore.tapeInternalState;
              
              // Execute rule operations synchronously
              // Handle WRITE * wildcard - write the currently read symbol
              const writeValue = (rule.write === '*' || rule.write === '∗') ? beforeSymbol : (rule.write || '#');
              
              // Apply all changes and get fresh state after each operation
              tapeStore.writeToCurrentCell(writeValue);
              tapeStore.setInternalState(rule.new_state);
              
              // Move head
              if (rule.direction === 'L' || (rule as any).isLeft) {
                tapeStore.moveHeadLeft();
              } else {
                tapeStore.moveHeadRight();
              }
              
              // Get completely fresh state after all operations
              tapeStore = useTapeStore.getState();
              const afterWrite = tapeStore.getTapeAsString();
              const afterSymbol = tapeStore.readCurrentCell();
              const afterState = tapeStore.tapeInternalState;
              
              // Increment step counter after successful rule execution
              steps++;
              
              // Debug: Log first few steps to see if changes are happening
              if (steps <= 3) {
                console.log(`Step ${steps}: ${beforeState}/${beforeSymbol} -> ${writeValue}/${rule.direction}/${rule.new_state} -> ${afterState}/${afterSymbol}`);
                console.log(`  Before: ${cleanTapeOutput(beforeWrite)}`);
                console.log(`  After:  ${cleanTapeOutput(afterWrite)}`);
                console.log(`  Rule matched: in_state=${rule.in_state}, read=${rule.read}, write=${rule.write}, direction=${rule.direction}, new_state=${rule.new_state}`);
              }
            }
            
            // If we reach here, execution exceeded maximum steps
            // Capture tape output at point of timeout BEFORE restoring state
            const timeoutOutput = cleanTapeOutput(tapeStore.getTapeAsString());
            const timeoutState = tapeStore.tapeInternalState;
            
            if (restoreState) {
              tapeStore.setInternalState(originalState.tapeInternalState);
              tapeStore.fillTape(originalState.tapeContent);
            }
            
            resolve({
              passed: false,
              output: timeoutOutput, // Use captured output from point of timeout
              steps,
              executionTime: Date.now() - startTime,
              finalState: timeoutState,
              error: `Test stopped after ${steps} steps (maximum limit: ${MAX_TEST_STEP_LIMIT}). Machine may be in an infinite loop.`,
              machineRuleCount: ruleCount,
              machineUniqueStates: uniqueStateCount
            });
            
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

      clearAllTrials: (): void => {
        set((state) => {
          // Remove all trial data
          state.testsById.forEach(trialId => {
            delete (state as any)[trialId];
          });
          state.testsById = [];
          
          // Clear any running state
          state.runningTrials = [];
          state.isRunningTrial = false;
          
          // Clear edit mode if active
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

      exportTrialsAsYAML: (): void => {
        const state = get() as any;
        const trials = state.testsById.map((trialId: string) => state[trialId]);
        const yamlContent = convertTrialsToYAML(trials);
        downloadYAMLFile(yamlContent);
      },

      importTrialsFromYAML: (yamlContent: string): { success: boolean; message: string; count?: number } => {
        try {
          console.log('importTrialsFromYAML called');
          const validation = validateYAMLTestSuite(yamlContent);
          if (!validation.valid) {
            console.log('YAML validation failed:', validation.errors);
            return {
              success: false,
              message: `Invalid YAML format: ${validation.errors.join(', ')}`
            };
          }

          const trials = convertYAMLToTrials(yamlContent);
          console.log('Converted YAML to trials:', trials);
          get().importTrials(trials);
          console.log('Called importTrials');

          return {
            success: true,
            message: `Successfully imported ${trials.length} test(s)`,
            count: trials.length
          };
        } catch (error) {
          console.error('Error importing YAML:', error);
          return {
            success: false,
            message: error instanceof Error ? error.message : 'Unknown error occurred'
          };
        }
      },

      loadTrialToTape: (trialId: string): boolean => {
        try {
          const trial = get().getTrial(trialId);
          if (!trial) return false;

          // Import the stores
          const { useMachineStore, useTapeStore } = require('./index');
          const machineStore = useMachineStore.getState();
          const tapeStore = useTapeStore.getState();
          
          // Clear rule highlighting when user loads trial to tape
          machineStore.setCurrentRule(null);
          
          // Load trial's initial state onto the main tape
          tapeStore.setInternalState(trial.startState);
          tapeStore.fillTape(trial.startTape);

          // fillTape centers content and places head at start of content
          // Now adjust head position based on trial.startTapeHead (relative to content start)
          const targetOffset = trial.startTapeHead || 0;

          if (targetOffset > 0) {
            // Move right from content start
            for (let i = 0; i < targetOffset; i++) {
              tapeStore.moveHeadRight();
            }
          } else if (targetOffset < 0) {
            // Move left from content start
            for (let i = 0; i < Math.abs(targetOffset); i++) {
              tapeStore.moveHeadLeft();
            }
          }
          // If targetOffset is 0, head is already at content start (fillTape default)
          
          return true;
        } catch (error) {
          console.error('Failed to load trial to tape:', error);
          return false;
        }
      },

      importTrials: (trialsData: Partial<TrialData>[]): void => {
        console.log('importTrials called with data:', trialsData);
        set((state) => {
          console.log('Inside set function, current testsById:', state.testsById);
          const newTestsById = [...state.testsById];
          trialsData.forEach(trialData => {
            const trialId = generateTrialId();
            newTestsById.push(trialId);
            (state as any)[trialId] = {
              ...trialData,
              id: trialId, // Override imported ID with generated UUID
              status: TEST_STATUS.PENDING,
              result: null,
              error: null,
              executionTime: 0,
              steps: 0,
              actualOutput: "",
              createdAt: new Date().toISOString(),
            } as TrialData;
            console.log('Imported trial:', trialId, (state as any)[trialId]);
          });
          state.testsById = newTestsById;
          console.log('After import, testsById:', state.testsById);
        });

        // Debug: Check state after set
        const afterState = get() as any;
        console.log('State after import:');
        console.log('  testsById:', afterState.testsById);
        afterState.testsById.forEach((id: string) => {
          console.log(`  Trial ${id}:`, afterState[id]);
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
    ),
    {
      name: 'turing-trial-store',
      version: 2, // Version 2 with UUID-based trial IDs
      partialize: (state) => ({
        // Persist trial definitions but not runtime/execution state
        testsById: state.testsById,
        // Persist all trial data (dynamic properties) but clean the runtime data
        ...state.testsById.reduce((trials, trialId) => {
          const trial = (state as any)[trialId];
          if (trial) {
            trials[trialId] = {
              id: trial.id,
              name: trial.name,
              startState: trial.startState,
              startTape: trial.startTape,
              expectedTape: trial.expectedTape,
              tapePointer: trial.tapePointer,
              expectedTapePointer: trial.expectedTapePointer,
              startTapeHead: trial.startTapeHead,
              expectedTapeHead: trial.expectedTapeHead,
              createdAt: trial.createdAt,
              // Reset runtime state
              status: TEST_STATUS.PENDING,
              result: null,
              error: null,
              executionTime: 0,
              steps: 0,
              actualOutput: "",
            };
          }
          return trials;
        }, {} as Record<string, any>),
      }),
    }
  )
);

export default useTrialStore;