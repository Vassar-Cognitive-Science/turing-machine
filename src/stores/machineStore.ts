import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { subscribeWithSelector } from 'zustand/middleware';
import type { Rule, MachineStore } from '../types';

// Constants from the original codebase
const MAX_STEP_LIMIT = 10000;
const ANIMATION_SPEED = 600.0;

// Utility function to capitalize alphabet characters and trim whitespace
const capitalizeAlphabet = (value: string): string => {
  if (!value) return value;
  return value.trim().replace(/[a-z]/g, (char) => char.toUpperCase());
};

interface RuleData {
  in_state: string;
  read: string;
  write: string;
  direction: 'L' | 'R';
  new_state: string;
  isLeft: boolean;
  in_state_error: boolean;
  read_error: boolean;
  write_error: boolean;
  new_state_error: boolean;
}

interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

interface CanRunResult {
  canRun: boolean;
  issues: string[];
}

interface HistoryEntry {
  stepCount: number;
  state: any; // This would be more specific based on what we're tracking
}

// Extended state for internal store management
interface InternalMachineState {
  // Machine execution state
  isRunning: boolean;
  interval: NodeJS.Timeout | null;
  animationSpeedFactor: number;
  animationSpeed: number;
  animationOn: boolean;
  
  // Error and reporting
  machineReportError: string;
  showReportedError: boolean;
  
  // History and changes
  anyChangeInNormal: boolean;
  stepCount: number;
  runHistory: HistoryEntry[];
  
  // Rules/transition table
  rowsById: string[];
  highlightedRow: string | null;
  
  // Rule data stored as dynamic properties
  [key: string]: any; // For rule data
}

// Initial state based on the original Redux state
const initialMachineState: InternalMachineState = {
  // Machine execution state
  isRunning: false,
  interval: null,
  animationSpeedFactor: 1.0,
  animationSpeed: ANIMATION_SPEED,
  animationOn: true,
  
  // Error and reporting
  machineReportError: "",
  showReportedError: false,
  
  // History and changes
  anyChangeInNormal: false,
  stepCount: 0,
  runHistory: [],
  
  // Rules/transition table
  rowsById: [], // Array of rule IDs
  highlightedRow: null,
};

export const useMachineStore = create<MachineStore>()(
  subscribeWithSelector(
    immer((set, get) => ({
      ...initialMachineState,

      // Machine execution actions
      startMachine: (): void => {
        set((state) => {
          state.isRunning = true;
        });
      },

      stopMachine: (message: string = "", showError: boolean = false): void => {
        set((state) => {
          state.isRunning = false;
          if (state.interval) {
            clearInterval(state.interval);
            state.interval = null;
          }
          state.machineReportError = message;
          state.showReportedError = showError;
        });
      },

      setAnimationSpeed: (speedFactor: number): void => {
        set((state) => {
          state.animationSpeedFactor = speedFactor;
          state.animationSpeed = ANIMATION_SPEED / speedFactor;
        });
      },

      toggleAnimation: (flag?: boolean): void => {
        set((state) => {
          state.animationOn = flag !== undefined ? flag : !state.animationOn;
        });
      },

      clearError: (): void => {
        set((state) => {
          state.machineReportError = "";
          state.showReportedError = false;
        });
      },

      // Step execution
      stepForward: (): void => {
        set((state) => {
          // This will be implemented with the actual Turing machine logic
          state.stepCount += 1;
          state.anyChangeInNormal = true;
          // TODO: Implement actual stepping logic
        });
      },

      stepBack: (): void => {
        set((state) => {
          if (state.runHistory.length > 0) {
            state.stepCount = Math.max(0, state.stepCount - 1);
            // TODO: Restore previous state from history
          }
        });
      },

      // Rule management
      addRule: (): void => {
        set((state) => {
          const newRuleId = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
          state.rowsById.push(newRuleId);
          (state as any)[newRuleId] = {
            in_state: "",
            read: "",
            write: "",
            direction: "R", // R for right, L for left
            new_state: "",
            isLeft: false,
            in_state_error: false,
            read_error: false,
            write_error: false,
            new_state_error: false,
          } as RuleData;
          state.anyChangeInNormal = true;
        });
      },

      deleteRule: (ruleId: string): void => {
        set((state) => {
          state.rowsById = state.rowsById.filter(id => id !== ruleId);
          delete (state as any)[ruleId];
          state.anyChangeInNormal = true;
        });
      },

      updateRule: (ruleId: string, field: keyof Omit<Rule, 'id'>, value: string): void => {
        set((state) => {
          if ((state as any)[ruleId]) {
            // Capitalize and trim alphabet characters for state fields and tape symbols
            if (field === 'in_state' || field === 'new_state' || field === 'read' || field === 'write') {
              (state as any)[ruleId][field] = capitalizeAlphabet(value);
            } else {
              (state as any)[ruleId][field] = value;
            }
            state.anyChangeInNormal = true;
          }
        });
      },

      setHighlightedRule: (ruleId: string | null): void => {
        set((state) => {
          state.highlightedRow = ruleId;
        });
      },

      reorderRules: (activeId: string, overId: string): void => {
        set((state) => {
          const activeIndex = state.rowsById.indexOf(activeId);
          const overIndex = state.rowsById.indexOf(overId);
          
          if (activeIndex !== -1 && overIndex !== -1) {
            // Remove the active item and insert it at the new position
            const [movedItem] = state.rowsById.splice(activeIndex, 1);
            state.rowsById.splice(overIndex, 0, movedItem);
            state.anyChangeInNormal = true;
          }
        });
      },

      // Machine initialization
      initializeMachine: (): void => {
        set((state) => {
          // Reset to initial state
          Object.assign(state, initialMachineState);
        });
      },

      loadMachine: (preloadedState: any): void => {
        set((state) => {
          // Load machine state from saved data
          if (preloadedState && typeof preloadedState === 'object') {
            Object.assign(state, preloadedState);
          }
        });
      },

      // History management
      recordHistory: (historyEntry: HistoryEntry): void => {
        set((state) => {
          state.runHistory.push(historyEntry);
        });
      },

      clearHistory: (): void => {
        set((state) => {
          state.runHistory = [];
          state.stepCount = 0;
        });
      },

      // Utility functions
      getRule: (ruleId: string): RuleData | null => {
        const state = get() as any;
        return state[ruleId] || null;
      },

      getAllRules: (): Rule[] => {
        const state = get() as any;
        return state.rowsById.map((id: string) => ({ id, ...state[id] }));
      },

      // Rule matching for Turing machine execution
      matchRule: (currentState: string, readSymbol: string): Rule | null => {
        const state = get() as any;
        
        // Capitalize and trim inputs for consistent matching
        const normalizedCurrentState = capitalizeAlphabet(currentState || '');
        const normalizedReadSymbol = capitalizeAlphabet(readSymbol || '');
        
        // Validate inputs
        if (!normalizedCurrentState) {
          console.warn('Invalid current state for rule matching');
          return null;
        }
        
        // Find matching rule based on current state and read symbol
        // Priority: exact match first, then wildcard (*)
        let exactMatch: Rule | null = null;
        let wildcardMatch: Rule | null = null;

        for (const ruleId of state.rowsById) {
          const rule = state[ruleId];
          
          // Skip invalid rules
          if (!rule || !rule.in_state || rule.in_state.trim() === '') {
            continue;
          }
          
          // Normalize rule state for comparison
          const normalizedRuleState = capitalizeAlphabet(rule.in_state || '');
          const normalizedRuleRead = capitalizeAlphabet(rule.read || '');
          
          if (normalizedRuleState === normalizedCurrentState) {
            if (normalizedRuleRead === normalizedReadSymbol || 
                (rule.read === '' && readSymbol === '#') ||
                (rule.read === '#' && readSymbol === '#')) {
              exactMatch = { id: ruleId, ...rule };
              break; // Exact match takes priority
            } else if (rule.read === "*" || rule.read === "∗") {
              wildcardMatch = { id: ruleId, ...rule };
            }
          }
        }

        return exactMatch || wildcardMatch;
      },

      // Validate a rule
      validateRule: (rule: Partial<Rule>): ValidationResult => {
        const errors: Record<string, string> = {};
        
        // Normalize input values for validation
        const normalizedInState = capitalizeAlphabet(rule.in_state || '');
        const normalizedNewState = capitalizeAlphabet(rule.new_state || '');
        
        if (!normalizedInState) {
          errors.in_state = 'Input state is required';
        }
        
        if (!normalizedNewState) {
          errors.new_state = 'New state is required';
        }
        
        if (!rule.direction || (rule.direction !== 'L' && rule.direction !== 'R')) {
          errors.direction = 'Direction must be L or R';
        }
        
        // Read symbol can be empty (blank), but we'll mark it for clarity
        if (rule.read === undefined || rule.read === null) {
          errors.read = 'Read symbol should be specified (use # for blank)';
        }
        
        // Write symbol can be empty (blank), but we'll mark it for clarity  
        if (rule.write === undefined || rule.write === null) {
          errors.write = 'Write symbol should be specified (use # for blank)';
        }
        
        return {
          isValid: Object.keys(errors).length === 0,
          errors
        };
      },

      // Get all valid rules
      getValidRules: (): Rule[] => {
        const state = get() as any;
        return state.rowsById
          .map((id: string) => ({ id, ...state[id] }))
          .filter((rule: Rule) => get().validateRule(rule).isValid);
      },

      // Check if machine is in a valid state to run
      canRun: (): CanRunResult => {
        const validRules = get().getValidRules();
        
        return {
          canRun: validRules.length > 0,
          issues: validRules.length === 0 ? ['No valid rules defined'] : []
        };
      },

      // Seed functions for testing
      clearAllRules: (): void => {
        set((state) => {
          // Clear existing rules
          state.rowsById.forEach(id => {
            delete (state as any)[id];
          });
          state.rowsById = [];
          state.anyChangeInNormal = true;
        });
      },

      addSeedRules: (): void => {
        set((state) => {
          // Clear existing rules first
          state.rowsById.forEach(id => {
            delete (state as any)[id];
          });
          state.rowsById = [];

          // Add seed rules based on the provided table
          const seedRules = [
            { in_state: 'START', read: 'X', write: '#', direction: 'R' as const, new_state: 'ODD' },
            { in_state: 'ODD', read: 'X', write: '#', direction: 'R' as const, new_state: 'EVEN' },
            { in_state: 'EVEN', read: 'X', write: '#', direction: 'R' as const, new_state: 'ODD' },
            { in_state: 'ODD', read: '#', write: 'Y', direction: 'R' as const, new_state: 'HALT' },
            { in_state: 'EVEN', read: '#', write: 'N', direction: 'R' as const, new_state: 'HALT' },
          ];

          seedRules.forEach(rule => {
            const ruleId = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
            state.rowsById.push(ruleId);
            (state as any)[ruleId] = {
              in_state: rule.in_state,
              read: rule.read,
              write: rule.write,
              direction: rule.direction,
              new_state: rule.new_state,
              isLeft: (rule.direction as string) === 'L',
              in_state_error: false,
              read_error: false,
              write_error: false,
              new_state_error: false,
            };
          });
          state.anyChangeInNormal = true;
        });
      },

      // Interactive graph editing methods
      addRuleFromConnection: (sourceStateId: string, targetStateId: string, ruleData?: { read?: string; write?: string; direction?: 'L' | 'R' }): string => {
        const newRuleId = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        
        set((state) => {
          state.rowsById.push(newRuleId);
          (state as any)[newRuleId] = {
            in_state: capitalizeAlphabet(sourceStateId),
            read: capitalizeAlphabet(ruleData?.read || ''),
            write: capitalizeAlphabet(ruleData?.write || ''),
            direction: ruleData?.direction || 'R',
            new_state: capitalizeAlphabet(targetStateId),
            isLeft: (ruleData?.direction || 'R') === 'L',
            in_state_error: false,
            read_error: false,
            write_error: false,
            new_state_error: false,
          } as RuleData;
          state.anyChangeInNormal = true;
        });
        
        return newRuleId;
      },

      addState: (stateName: string, position?: { x: number; y: number }): void => {
        set((state) => {
          // State names are managed by the graph component
          // This method is mainly for validation and store state updates
          state.anyChangeInNormal = true;
        });
      },

      renameState: (oldStateName: string, newStateName: string): void => {
        set((state) => {
          const normalizedOldName = capitalizeAlphabet(oldStateName);
          const normalizedNewName = capitalizeAlphabet(newStateName);
          
          if (normalizedOldName === normalizedNewName) return;
          
          // Update all rules that reference the old state name
          state.rowsById.forEach(ruleId => {
            const rule = (state as any)[ruleId];
            if (rule.in_state === normalizedOldName) {
              rule.in_state = normalizedNewName;
            }
            if (rule.new_state === normalizedOldName) {
              rule.new_state = normalizedNewName;
            }
          });
          
          state.anyChangeInNormal = true;
        });
      },

      deleteState: (stateName: string): void => {
        set((state) => {
          const normalizedStateName = capitalizeAlphabet(stateName);
          
          // Remove all rules that reference this state
          const rulesToRemove = state.rowsById.filter(ruleId => {
            const rule = (state as any)[ruleId];
            return rule.in_state === normalizedStateName || rule.new_state === normalizedStateName;
          });
          
          rulesToRemove.forEach(ruleId => {
            state.rowsById = state.rowsById.filter(id => id !== ruleId);
            delete (state as any)[ruleId];
          });
          
          state.anyChangeInNormal = true;
        });
      },

      // Enhanced rule management
      getRulesByState: (stateName: string): Rule[] => {
        const state = get() as any;
        const normalizedStateName = capitalizeAlphabet(stateName);
        
        return state.rowsById
          .map((id: string) => ({ id, ...state[id] }))
          .filter((rule: Rule) => rule.in_state === normalizedStateName || rule.new_state === normalizedStateName);
      },

      getStateNames: (): string[] => {
        const state = get() as any;
        const stateSet = new Set<string>();
        
        state.rowsById.forEach((ruleId: string) => {
          const rule = state[ruleId];
          if (rule.in_state && rule.in_state.trim()) {
            stateSet.add(rule.in_state.trim());
          }
          if (rule.new_state && rule.new_state.trim()) {
            stateSet.add(rule.new_state.trim());
          }
        });
        
        return Array.from(stateSet).sort();
      },
    }))
  )
);

export default useMachineStore;