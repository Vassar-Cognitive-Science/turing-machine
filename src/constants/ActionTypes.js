export const FIRE = "FIRE";

/* Actions for Head */
export const WRITE_AND_MOVE = 'WRITE_AND_MOVE';
export const SHIFT_TAPE_POINTER_LEFT = 'SHIFT_TAPE_POINTER_LEFT';
export const SHIFT_TAPE_POINTER_RIGHT = 'SHIFT_TAPE_POINTER_RIGHT';
export const SET_INTERNAL_STATE = 'SET_STATE';
/* Actions for Head */

/* Actions for Tape */
export const MOVE_TAPE_LEFT = 'MOVE_TAPE_LEFT';
export const MOVE_TAPE_RIGHT = 'MOVE_TAPE_RIGHT';
export const FILL_TAPE = 'FILL_TAPE';
export const WRITE_INTO_TAPE = 'WRITE_INTO_TAPE';
export const INITIALIZAE_TAPE = 'INITIALIZAE_TAPE'; 
export const INSERT_CELL_BEFORE_HEAD = 'INSERT_CELL_BEFORE_HEAD';
export const APPEND_CELL_AFTER_TAIL = 'APPEND_CELL_AFTER_TAIL';
export const EXPAND_CELLS_BEFORE_HEAD = 'EXPAND_CELLS_BEFORE_HEAD';
export const EXPAND_CELLS_AFTER_TAIL = 'EXPAND_CELLS_AFTER_TAIL';
/* Actions for Tape */

/* Actions for Transition Table */
// export const ADD_RULE = 'ADD_RULE';
// export const SET_RULE = 'SET_RULE';
// export const DELETE_RULE = 'DELETE_RULE';

export const ADD_ROW = 'ADD_ROW';
export const DELETE_ROW = 'DELETE_ROW';
export const SET_ROW = 'SET_ROW';
// export const SWITCH_ROW_MODE = 'SWITCH_ROW_MODE';
export const SWITCH_ROW_DIRECTION = 'SWITCH_ROW_DIRECTION';
/* Actions for Transition Graph */

/* Actions for Turing Machine */
export const INITIALIZAE_MACHINE = 'INITIALIZAE_MACHINE';
export const STEP_FORWARD = 'STEP_FORWARD';
/* Actions for Turing Machine */
