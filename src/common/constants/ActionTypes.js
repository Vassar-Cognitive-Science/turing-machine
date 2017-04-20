/* General */
export const RESIZE_SCREEN_AND_TAPE = 'RESIZE_SCREEN_AND_TAPE';
export const UNDO = "UNDO";
export const REDO = "REDO";
/* General */

/* Actions for Turing Machine */
export const INITIALIZAE_MACHINE = 'INITIALIZAE_MACHINE';
export const LOAD_MACHINE = 'LOAD_MACHINE';
export const PRE_STEP_FORWARD = "PRE_STEP_FORWARD";
export const STEP_FORWARD = 'STEP_FORWARD';
export const RECORD_INTERVAL = "RECORD_INTERVAL";
export const STOP = "STOP";
export const CLEAR_REPORTED_ERROR = "CLEAR_REPORTED_ERROR";
export const STEP_BACK = "STEP_BACK";
export const RESTORE = "RESTORE";
export const SILENT_RUN = "SILENT_RUN";
export const GOOD_SAVE = "GOOD_SAVE";
/* Actions for Turing Machine */

/* GUI info */
export const FOCUS_ON_CELL = 'FOCUS_ON_CELL'; // side effect
export const ADJUST_HEAD_WIDTH = 'ADJUST_HEAD_WIDTH';
export const SET_PLAY_STATE = "SET_PLAY_STATE";
export const SET_ANIMATION_SPEED = 'SET_ANIMATION_SPEED';
export const MOVE_HEAD = 'MOVE_HEAD';
export const ANIMATION_ON = 'ANIMATION_ON';
/* GUI info */

/* Actions for Head */
export const SWITCH_HEAD_MODE = 'SWITCH_HEAD_MODE';
export const WRITE_AND_MOVE = 'WRITE_AND_MOVE';
export const SHIFT_TAPE_POINTER_LEFT = 'SHIFT_TAPE_POINTER_LEFT';
export const SHIFT_TAPE_POINTER_RIGHT = 'SHIFT_TAPE_POINTER_RIGHT';
export const SET_INTERNAL_STATE = 'SET_STATE';
export const SET_CORRES_CELL_HEIGHT = 'SET_CORRES_CELL_HEIGHT';
/* Actions for Head */

/* Actions for Tape */
export const SET_ANCHOR_CELL = 'SET_ANCHOR_CELL';
export const MOVE_TAPE_LEFT = 'MOVE_TAPE_LEFT';
export const MOVE_TAPE_RIGHT = 'MOVE_TAPE_RIGHT';
export const FILL_TAPE = 'FILL_TAPE';
export const WRITE_INTO_TAPE = 'WRITE_INTO_TAPE';
export const INITIALIZAE_TAPE = 'INITIALIZAE_TAPE'; 
export const INSERT_CELL_BEFORE_HEAD = 'INSERT_CELL_BEFORE_HEAD';
export const APPEND_CELL_AFTER_TAIL = 'APPEND_CELL_AFTER_TAIL';
export const EXPAND_CELLS_BEFORE_HEAD = 'EXPAND_CELLS_BEFORE_HEAD';
export const EXPAND_CELLS_AFTER_TAIL = 'EXPAND_CELLS_AFTER_TAIL';
export const HIGHLIGHT_CELL_AT = "HIGHLIGHT_CELL_AT";
/* Actions for Tape */

/* Actions for Transition Table */
export const ADD_ROW = 'ADD_ROW';
export const DELETE_ROW = 'DELETE_ROW';
export const SET_ROW_IN_STATE = 'SET_ROW_IN_STATE';
export const SET_ROW_NEW_STATE = 'SET_ROW_NEW_STATE';
export const SET_ROW_READ = 'SET_ROW_READ';
export const SET_ROW_WRITE = 'SET_ROW_WRITE';
export const SWITCH_ROW_DIRECTION = 'SWITCH_ROW_DIRECTION';
/* Actions for Transition Graph */


/* Actions for Trials*/
export const DELETE_TRIAL = 'DELETE_TRIAL';
export const ADD_TRIAL = 'ADD_TRIAL';
export const PRE_RUN_TRIAL = 'PRE_RUN_TRIAL';
export const RUN_TRIAL = 'RUN_TRIAL';
export const LOAD_TRIAL = 'LOAD_TRIAL';
export const TOGGLE_IS_RUNNING_TRIAL = 'TOGGLE_IS_RUNNING_TRIAL';
export const CLEAR_TEST_RESULTS = 'CLEAR_TEST_RESULTS';
export const TOGGLE_EDIT_MODE = 'TOGGLE_EDIT_MODE';
export const CHANGE_EDITTING_TARGET = 'CHANGE_EDITTING_TARGET';
export const SAVE_TRIAL = 'SAVE_TRIAL';
export const CHANGE_TRIAL_NAME = 'CHANGE_TRIAL_NAME';
/* Actions for Trials*/
