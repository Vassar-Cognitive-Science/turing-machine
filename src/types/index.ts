// Core Turing Machine Types

export interface Rule {
  id: string;
  in_state: string;
  read: string;
  write: string;
  direction: 'L' | 'R';
  new_state: string;
}

export interface TapeCell {
  id: string;
  val: string;
  prev: string | null;
  next: string | null;
  highlight: boolean;
  isHead?: boolean;
}

export interface VisibleCell {
  id: string;
  val: string;
  isHead: boolean;
}

export interface Trial {
  id: string;
  name: string;
  startTape: string;
  expectedTape: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  result?: string;
  message?: string;
}

export interface TrialStats {
  total: number;
  passed: number;
  failed: number;
  pending: number;
}

// Store State Types

export interface MachineState {
  rowsById: string[];
  isRunning: boolean;
  interval: NodeJS.Timeout | null;
  animationSpeedFactor: number;
  animationSpeed: number;
  animationOn: boolean;
  machineReportError: string;
  showReportedError: boolean;
  anyChangeInNormal: boolean;
  stepCount: number;
  runHistory: any[];
  highlightedRow: string | null;
  currentRule: string | null;
}

export interface TapeState {
  anchorCell: number;
  tapeHead: string | null;
  tapeTail: string | null;
  tapePointer: string | null;
  tapeCellsById: string[];
  tapeInternalState: string;
  highlightedCellOrder: number;
}

export interface GuiState {
  screenSize: number;
  cellNum: number;
  rightBoundary: number;
  headX: number;
  headWidth: number;
  headLeftOffset: number;
  saveMachineResponseOpen: boolean;
  anythingNewWithMachine: boolean;
  dialogOpen: boolean;
  errorMessage: string;
  trialDrawerOpen: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export interface TrialState {
  testsById: string[];
  isRunningTrial: boolean;
  runningTrials: string[];
  isEdittingTrial: boolean;
  isEdittingExpectedTape: boolean;
  edittingTrialId: string | null;
  edittingTrialName: string | null;
  anyChangeInTrial: boolean;
  originalTape: string | null;
  edittingStartTape: string | null;
  edittingExpectedTape: string | null;
}

// Store Actions Types

export interface MachineActions {
  startMachine: () => void;
  stopMachine: (message?: string, showError?: boolean) => void;
  setAnimationSpeed: (speedFactor: number) => void;
  toggleAnimation: (flag?: boolean) => void;
  clearError: () => void;
  stepForward: () => void;
  stepBack: () => void;
  addRule: () => void;
  deleteRule: (ruleId: string) => void;
  updateRule: (ruleId: string, field: keyof Omit<Rule, 'id'>, value: string) => void;
  setHighlightedRule: (ruleId: string | null) => void;
  setCurrentRule: (ruleId: string | null) => void;
  reorderRules: (activeId: string, overId: string) => void;
  initializeMachine: () => void;
  loadMachine: (preloadedState: any) => void;
  recordHistory: (historyEntry: any) => void;
  clearHistory: () => void;
  getRule: (ruleId: string) => any;
  getAllRules: () => Rule[];
  matchRule: (currentState: string, readSymbol: string) => Rule | null;
  validateRule: (rule: Partial<Rule>) => any;
  getValidRules: () => Rule[];
  canRun: () => any;
  clearAllRules: () => void;
  addSeedRules: () => void;
  // Interactive graph editing methods
  addRuleFromConnection: (sourceStateId: string, targetStateId: string, ruleData?: { read?: string; write?: string; direction?: 'L' | 'R' }) => string;
  addState: (stateName: string, position?: { x: number; y: number }) => void;
  renameState: (oldStateName: string, newStateName: string) => void;
  deleteState: (stateName: string) => void;
  getRulesByState: (stateName: string) => Rule[];
  getStateNames: () => string[];
  updateRuleConnection: (ruleId: string, newSourceState: string, newTargetState: string) => void;
}

export interface TapeActions {
  initializeTape: (controlled?: boolean) => void;
  moveHeadLeft: () => void;
  moveHeadRight: () => void;
  expandTapeLeft: () => void;
  expandTapeRight: () => void;
  readCurrentCell: () => string;
  writeToCurrentCell: (value: string) => void;
  writeToCell: (cellId: string, value: string) => void;
  setInternalState: (newState: string) => void;
  setManualState: (newState: string) => void;
  highlightCell: (cellId: string) => void;
  clearHighlights: () => void;
  moveTapeLeft: () => void;
  moveTapeRight: () => void;
  getCell: (cellId: string) => TapeCell | null;
  getCurrentCell: () => TapeCell | null;
  getTapeAsString: () => string;
  getVisibleCells: (count?: number) => VisibleCell[];
  getCurrentHeadPosition: () => number;
  fillTape: (content: string) => void;
  setHeadPosition: (cellId: string) => void;
  isTapeEmpty: () => boolean;
}

export interface GuiActions {
  resizeScreenAndTape: (screenWidth: number) => void;
  adjustHeadWidth: (text: string) => void;
  moveHead: (direction: 'left' | 'right') => void;
  openSaveMachineDialog: (isSuccessful?: boolean) => void;
  closeSaveMachineDialog: () => void;
  openErrorDialog: (message: string) => void;
  closeErrorDialog: () => void;
  openTrialDrawer: () => void;
  closeTrialDrawer: () => void;
  toggleTrialDrawer: () => void;
  getCellWidth: () => number;
  getHeadPosition: () => any;
  getResponsiveInfo: () => any;
  initialize: () => void;
  reset: () => void;
}

export interface TrialActions {
  addTrial: (name: string, startState?: string, startTape?: string, expectedTape?: string, tapePointer?: number, expectedTapePointer?: number, startTapeHead?: number, expectedTapeHead?: number) => void;
  deleteTrial: (trialId: string) => void;
  updateTrial: (trialId: string, updates: any) => void;
  runTrial: (trialId: string, restoreState?: boolean) => Promise<void>;
  runAllTrials: () => Promise<void>;
  executeTrial: (trialId: string, restoreState?: boolean) => Promise<any>;
  enterEditMode: (trialId: string, targetType?: 'start' | 'expected') => void;
  exitEditMode: (save?: boolean) => void;
  changeEditingTarget: (targetType: 'start' | 'expected') => void;
  setTrialName: (name: string) => void;
  clearTestResults: () => void;
  exportTrials: () => void;
  importTrials: (trialsData: any[]) => void;
  getTrial: (trialId: string) => any;
  getAllTrials: () => any[];
  getTrialStats: () => any;
  isTrialRunning: (trialId: string) => boolean;
}

// Combined Store Types

export interface MachineStore extends MachineState, MachineActions {
  [key: string]: any; // Allow dynamic rule properties
}

export interface TapeStore extends TapeState, TapeActions {
  [key: string]: any; // Allow dynamic cell properties
}

export interface GuiStore extends GuiState, GuiActions {}

export interface TrialStore extends TrialState, TrialActions {
  [key: string]: any; // Allow dynamic trial properties
}

// Hook Return Types

export interface MachineExecution {
  isRunning: boolean;
  isHalted: boolean;
  currentState: string;
  stepCount: number;
  run: () => Promise<void>;
  runTurbo: () => Promise<void>;
  step: () => Promise<boolean>;
  stop: () => void;
  reset: () => void;
}

export interface TapeOperations {
  currentState: string;
  currentSymbol: string;
  tapeContent: string;
  visibleCells: VisibleCell[];
  moveLeft: () => void;
  moveRight: () => void;
  writeSymbol: (symbol: string) => void;
  setTapeContent: (content: string) => void;
}

export interface TrialOperations {
  trials: Trial[];
  stats: TrialStats;
  isRunning: boolean;
  currentTrial: Trial | null;
  createTrial: (name: string, startTape: string, expectedTape: string) => void;
  runTrial: (trialId?: string) => Promise<void>;
  clearAllTrials: () => void;
}

export interface UndoRedoState {
  canUndo: boolean;
  canRedo: boolean;
  undo: () => void;
  redo: () => void;
}

// Server Types

export interface SharedMachineState {
  rowsById: string[];
  tapeInternalState: string;
  stepCount: number;
  anyChangeInNormal: boolean;
  tapeCellsById: string[];
  tapeHead: string | null;
  tapeTail: string | null;
  tapePointer: string | null;
  anchorCell: number;
  [key: string]: any; // For rule data and tape cell data
}

export interface ShareResponse {
  id: string;
}

// Component Props Types

export interface NotificationState {
  open: boolean;
  message: string;
  severity: 'success' | 'error' | 'warning' | 'info';
}

export interface DialogState {
  open: boolean;
  message: string;
}

export interface TrialDialogData {
  name: string;
  startTape: string;
  expectedTape: string;
}