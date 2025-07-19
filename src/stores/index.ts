// Central store management for the Turing Machine Simulator
import { useMachineStore } from './machineStore';
import { useTapeStore } from './tapeStore';
import { useGuiStore } from './guiStore';
import { useTrialStore } from './trialStore';
import { useGraphLayoutStore } from './graphLayoutStore';
import type { 
  MachineStore, 
  TapeStore, 
  GuiStore, 
  TrialStore,
  Rule,
  Trial,
  TrialStats,
  MachineExecution,
  TapeOperations,
  TrialOperations,
  UndoRedoState
} from '../types';

// Export individual stores
export { useMachineStore, useTapeStore, useGuiStore, useTrialStore, useGraphLayoutStore };

// Combined hook for accessing all stores
export const useStores = () => ({
  machine: useMachineStore(),
  tape: useTapeStore(),
  gui: useGuiStore(),
  trial: useTrialStore(),
  graphLayout: useGraphLayoutStore(),
});

interface HistoryEntry {
  beforeState: {
    state: string;
    symbol: string;
    headPosition: number;
    tapeContent: string;
  };
  afterState?: {
    state: string;
    symbol: string;
    headPosition: number;
    tapeContent: string;
  };
  rule: Rule;
  timestamp: number;
}

// Specific hooks for common operations
export const useMachineExecution = (): MachineExecution => {
  const {
    isRunning,
    animationOn,
    animationSpeed,
    stepCount,
    startMachine,
    stopMachine,
    stepForward,
    setHighlightedRule,
    matchRule,
    getAllRules
  } = useMachineStore();
  
  const {
    tapeInternalState,
    readCurrentCell,
    writeToCurrentCell,
    setInternalState,
    moveHeadLeft,
    moveHeadRight
  } = useTapeStore();
  
  const step = (): boolean => {
    // Get current state and symbol - always get fresh state
    const currentState = useTapeStore.getState().tapeInternalState;
    const currentSymbol = readCurrentCell();
    
    console.log(`Step: State=${currentState}, Symbol=${currentSymbol}`);
    
    // Check for halt state
    if (currentState.toLowerCase() === 'halt') {
      stopMachine("Machine is in halt state", false);
      return false;
    }
    
    // Find matching rule
    const rule = matchRule(currentState, currentSymbol);
    
    if (!rule) {
      stopMachine(`No matching rule found for state '${currentState}' and symbol '${currentSymbol}'`, true);
      return false;
    }
    
    console.log(`Applying rule: ${currentState},${currentSymbol} → ${rule.write},${rule.direction},${rule.new_state}`);
    
    // Record current state for history
    const historyEntry: HistoryEntry = {
      beforeState: {
        state: currentState,
        symbol: currentSymbol,
        headPosition: useTapeStore.getState().getCurrentHeadPosition(),
        tapeContent: useTapeStore.getState().getTapeAsString()
      },
      rule: rule,
      timestamp: Date.now()
    };
    
    // Execute the rule
    writeToCurrentCell(rule.write || '#');
    setInternalState(rule.new_state);
    
    // Move head
    if (rule.direction === 'L' || (rule as any).isLeft) {
      moveHeadLeft();
    } else {
      moveHeadRight();
    }
    
    // Record after state
    historyEntry.afterState = {
      state: rule.new_state,
      symbol: rule.write || '#',
      headPosition: useTapeStore.getState().getCurrentHeadPosition(),
      tapeContent: useTapeStore.getState().getTapeAsString()
    };
    
    // Update machine state
    stepForward();
    setHighlightedRule(rule.id);
    (useMachineStore.getState() as any).recordHistory(historyEntry);
    
    return true;
  };
  
  const run = async (): Promise<void> => {
    // Check if machine can run
    const { canRun, issues } = (useMachineStore.getState() as any).canRun();
    if (!canRun) {
      stopMachine(`Cannot run machine: ${issues.join(', ')}`, true);
      return;
    }
    
    startMachine();
    
    // Capture initial state before any steps execute
    const initialState = useTapeStore.getState().tapeInternalState;
    const initialSymbol = readCurrentCell();
    const initialHistoryEntry: HistoryEntry = {
      beforeState: {
        state: initialState,
        symbol: initialSymbol,
        headPosition: useTapeStore.getState().getCurrentHeadPosition(),
        tapeContent: useTapeStore.getState().getTapeAsString()
      },
      afterState: {
        state: initialState,
        symbol: initialSymbol,
        headPosition: useTapeStore.getState().getCurrentHeadPosition(),
        tapeContent: useTapeStore.getState().getTapeAsString()
      },
      rule: null as any, // No rule applied for initial state
      timestamp: Date.now()
    };
    (useMachineStore.getState() as any).recordHistory(initialHistoryEntry);
    let stepCount = 0;
    const maxSteps = 10000; // Prevent infinite loops
    
    const execute = (): void => {
      if (!useMachineStore.getState().isRunning) return;
      
      stepCount++;
      
      // Safety check for infinite loops
      if (stepCount > maxSteps) {
        stopMachine(`Stopped after ${maxSteps} steps to prevent infinite loop`, true);
        return;
      }
      
      const success = step();
      if (!success) {
        // Error already handled in step()
        return;
      }
      
      // Check for halt state after step
      const currentState = useTapeStore.getState().tapeInternalState;
      if (currentState.toLowerCase() === 'halt') {
        stopMachine(`Machine halted successfully after ${stepCount} steps`);
        return;
      }
      
      // Schedule next step
      if (animationOn) {
        setTimeout(execute, animationSpeed);
      } else {
        // Fast execution with small delay to prevent browser freeze
        setTimeout(execute, 1);
      }
    };
    
    execute();
  };

  const runTurbo = async (): Promise<void> => {
    // Check if machine can run
    const { canRun, issues } = (useMachineStore.getState() as any).canRun();
    if (!canRun) {
      stopMachine(`Cannot run machine: ${issues.join(', ')}`, true);
      return;
    }
    
    startMachine();
    
    // Capture initial state before any steps execute
    const initialState = useTapeStore.getState().tapeInternalState;
    const initialSymbol = readCurrentCell();
    const initialHistoryEntry: HistoryEntry = {
      beforeState: {
        state: initialState,
        symbol: initialSymbol,
        headPosition: useTapeStore.getState().getCurrentHeadPosition(),
        tapeContent: useTapeStore.getState().getTapeAsString()
      },
      afterState: {
        state: initialState,
        symbol: initialSymbol,
        headPosition: useTapeStore.getState().getCurrentHeadPosition(),
        tapeContent: useTapeStore.getState().getTapeAsString()
      },
      rule: null as any, // No rule applied for initial state
      timestamp: Date.now()
    };
    (useMachineStore.getState() as any).recordHistory(initialHistoryEntry);
    let stepCount = 0;
    const maxSteps = 10000; // Prevent infinite loops
    
    // Run synchronously without delays for maximum speed
    while (useMachineStore.getState().isRunning && stepCount < maxSteps) {
      stepCount++;
      
      const success = step();
      if (!success) {
        // Error already handled in step()
        return;
      }
      
      // Check for halt state after step
      const currentState = useTapeStore.getState().tapeInternalState;
      if (currentState.toLowerCase() === 'halt') {
        stopMachine(`Machine halted successfully after ${stepCount} steps`);
        return;
      }
      
      // Allow UI to update occasionally to prevent complete freeze
      if (stepCount % 100 === 0) {
        await new Promise(resolve => setTimeout(resolve, 0));
      }
    }
    
    // Safety check for infinite loops
    if (stepCount >= maxSteps) {
      stopMachine(`Stopped after ${maxSteps} steps to prevent infinite loop`, true);
    }
  };
  
  const stop = (): void => {
    stopMachine();
  };

  const reset = (): void => {
    stop();
    
    // Get the first history entry (initial state) before clearing
    const history = useMachineStore.getState().runHistory;
    if (history.length > 0) {
      const initialState = history[0];
      
      // Restore the initial tape state
      if (initialState.beforeState) {
        console.log('Resetting to initial state:', initialState.beforeState);
        
        // Set the machine state
        setInternalState(initialState.beforeState.state);
        
        // Better approach: extract only the meaningful content and calculate relative position
        const tapeState = useTapeStore.getState();
        const originalTapeContent = initialState.beforeState.tapeContent;
        const originalHeadPosition = initialState.beforeState.headPosition;
        
        console.log('Original tape content:', originalTapeContent);
        console.log('Original head position:', originalHeadPosition);
        
        // Find the actual content (trim leading and trailing blanks)
        let contentStart = 0;
        let contentEnd = originalTapeContent.length - 1;
        
        // Find first non-blank
        for (let i = 0; i < originalTapeContent.length; i++) {
          if (originalTapeContent[i] !== '∅' && originalTapeContent[i] !== '#') {
            contentStart = i;
            break;
          }
        }
        
        // Find last non-blank
        for (let i = originalTapeContent.length - 1; i >= 0; i--) {
          if (originalTapeContent[i] !== '∅' && originalTapeContent[i] !== '#') {
            contentEnd = i;
            break;
          }
        }
        
        // Extract just the meaningful content
        const actualContent = originalTapeContent.slice(contentStart, contentEnd + 1);
        const headOffsetFromContentStart = originalHeadPosition - contentStart;
        
        console.log('Content starts at index:', contentStart, 'ends at:', contentEnd);
        console.log('Actual content:', actualContent);
        console.log('Head offset from content start:', headOffsetFromContentStart);
        
        // Restore only the meaningful content
        (tapeState as any).fillTape(actualContent);
        
        // After fillTape, the content starts at position 5 (fillTape's padding)
        // Position the head at the same offset from the content start
        const restoredContentStartPos = 5; // fillTape padding
        const targetHeadPosition = restoredContentStartPos + headOffsetFromContentStart;
        
        console.log('Restored content starts at position:', restoredContentStartPos);
        console.log('Target head position:', targetHeadPosition);
        
        // Move head to the target position
        const currentPos = (tapeState as any).getCurrentHeadPosition();
        const movesNeeded = targetHeadPosition - currentPos;
        
        console.log('Current position after fillTape:', currentPos);
        console.log('Moves needed:', movesNeeded);
        
        for (let i = 0; i < Math.abs(movesNeeded); i++) {
          if (movesNeeded > 0) {
            moveHeadRight();
          } else {
            moveHeadLeft();
          }
        }
        
        const finalSymbol = readCurrentCell();
        const finalPosition = (tapeState as any).getCurrentHeadPosition();
        console.log('Reset complete. Head at position:', finalPosition, 'on symbol:', finalSymbol);
      }
    } else {
      console.log('No history available for reset, initializing tape');
      // If no history, just initialize a fresh tape
      const tapeState = useTapeStore.getState();
      (tapeState as any).initializeTape();
      setInternalState('START');
    }
    
    // Clear history after restoring state
    (useMachineStore.getState() as any).clearHistory();
  };
  
  return {
    step: () => Promise.resolve(step()),
    run,
    runTurbo,
    stop,
    reset,
    isRunning,
    isHalted: useTapeStore.getState().tapeInternalState.toLowerCase() === 'halt',
    currentState: useTapeStore.getState().tapeInternalState,
    stepCount,
  };
};

// Hook for tape operations
export const useTapeOperations = (): TapeOperations => {
  const {
    moveHeadLeft,
    moveHeadRight,
    readCurrentCell,
    writeToCurrentCell,
    tapeInternalState,
    getCurrentHeadPosition,
    getVisibleCells,
    getTapeAsString,
    fillTape
  } = useTapeStore();
  
  const {
    moveHead,
    adjustHeadWidth,
    cellNum
  } = useGuiStore();
  
  const moveLeft = (): void => {
    moveHeadLeft();
    moveHead('left');
  };
  
  const moveRight = (): void => {
    moveHeadRight();
    moveHead('right');
  };
  
  const writeSymbol = (symbol: string): void => {
    writeToCurrentCell(symbol);
    adjustHeadWidth(symbol);
  };

  const setTapeContent = (content: string): void => {
    fillTape(content);
  };
  
  return {
    moveLeft,
    moveRight,
    writeSymbol,
    setTapeContent,
    currentSymbol: readCurrentCell(),
    currentState: useTapeStore.getState().tapeInternalState,
    visibleCells: getVisibleCells(cellNum),
    tapeContent: getTapeAsString(),
  };
};

// Hook for trial operations
export const useTrialOperations = (): TrialOperations => {
  const {
    addTrial,
    runTrial,
    getAllTrials,
    getTrialStats,
    isRunningTrial,
    getTrial,
    clearTestResults
  } = useTrialStore();
  
  const { getAllRules } = useMachineStore();
  
  const {
    tapeInternalState,
    setInternalState,
    fillTape,
    getTapeAsString
  } = useTapeStore();
  
  const createTrial = (name: string, startTape: string = '', expectedTape: string = ''): void => {
    addTrial(name, useTapeStore.getState().tapeInternalState, startTape, expectedTape);
  };
  
  const runTrialWithState = async (trialId?: string): Promise<void> => {
    if (trialId) {
      const trialData = getTrial(trialId);
      if (!trialData) return;
      
      // Save current machine state
      const originalState = {
        rules: getAllRules(),
        tapeState: useTapeStore.getState().tapeInternalState,
        tapeContent: getTapeAsString(),
      };
      
      try {
        // Set up trial state
        setInternalState(trialData.startState);
        fillTape(trialData.startTape);
        
        // Run the trial
        await runTrial(trialId);
      } finally {
        // Restore original state
        setInternalState(originalState.tapeState);
        fillTape(originalState.tapeContent);
      }
    } else {
      // Run all trials
      await (useTrialStore.getState() as any).runAllTrials();
    }
  };

  const clearAllTrials = (): void => {
    clearTestResults();
  };
  
  return {
    createTrial,
    runTrial: runTrialWithState,
    clearAllTrials,
    trials: getAllTrials(),
    stats: getTrialStats(),
    isRunning: isRunningTrial,
    currentTrial: null, // Could be enhanced to track current trial
  };
};

// Hook for undo/redo operations
export const useUndoRedo = (): UndoRedoState => {
  const { stepBack, runHistory, stepForward } = useMachineStore() as any;
  
  // Simple implementation - can be enhanced with the middleware
  const undo = (): void => {
    // For now, just step back in machine history
    stepBack();
  };
  
  const redo = (): void => {
    // For now, just step forward
    stepForward();
  };
  
  return {
    undo,
    redo,
    canUndo: runHistory.length > 0,
    canRedo: false, // Will be implemented with proper redo history
  };
};

// Initialize all stores
export const initializeStores = (): void => {
  const gui = useGuiStore.getState();
  const machine = useMachineStore.getState();
  const tape = useTapeStore.getState();
  
  // Initialize GUI with current screen size
  (gui as any).initialize();
  
  // Initialize machine
  (machine as any).initializeMachine();
  
  // Initialize tape
  (tape as any).initializeTape();
};

// Reset all stores to initial state
export const resetAllStores = (): void => {
  const gui = useGuiStore.getState();
  const machine = useMachineStore.getState();
  const tape = useTapeStore.getState();
  const trial = useTrialStore.getState();
  
  (gui as any).reset();
  (machine as any).initializeMachine();
  (tape as any).initializeTape();
  // Note: We don't reset trials by default to preserve test cases
};

// Export store utilities
export default {
  useMachineStore,
  useTapeStore,
  useGuiStore,
  useTrialStore,
  useStores,
  useMachineExecution,
  useTapeOperations,
  useTrialOperations,
  useUndoRedo,
  initializeStores,
  resetAllStores,
};