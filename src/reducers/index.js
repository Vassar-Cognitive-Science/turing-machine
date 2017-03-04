import * as tape from './tape';
import * as reservedWords from '../constants/ReservedWords';
import * as actionTypes from '../constants/ActionTypes';
import * as table from './table';
import * as gui from './gui';
import { N_CELLS, INIT_HEAD_WIDTH, INIT_HEAD_HEIGHT, INIT_HEAD_LEFT_OFFSET, ANIMATION_SPEED, head_x } from '../constants/GUISettings';

export const initialState = {
	/* GUI settings */
	cellNum: N_CELLS, // number of presented cells
	anchorCell: 0, // serves to help mapping presented cells to virtual cells in tape

	headWidth: INIT_HEAD_WIDTH, // control Tape Head width
	headHeight: INIT_HEAD_HEIGHT, // control Tape Head height
	headLeftOffset: INIT_HEAD_LEFT_OFFSET, // control Tape Head input box position 
	headX: head_x(), // x coordinate of Tape Head

	isRunning: false, // is the machine running
	interval: null, // Animation interval function, returned by setInterval(callback, timeout)
	animationSpeedFactor: 1.0, // 100% of default speed
	animationSpeed: ANIMATION_SPEED, // calculated speed, not necessary but make things convenient 
	/* GUI settings */

	/* Tape and Head */
	tapeHead: 0, // Tape head, see linked list structure 
	tapeTail: 0, // Tape tail, see linked list structure
	tapePointer: 0, // Tells where is the Tape Head in Tape
	tapeCellsById: [], // array of virtual cells' ids
	tapeInternalState: "0", // Tape Head state
	/* Tape and Head */

	/*

	A cell is an plain object, similar to linked list Node structure
	{ 
	val: val, // value
	prev: prev, // id to prev cell 
	next: next, // id to next cell
	highlight: flag, // boolean indicates whether the cell is highlighted
	}

	*/

	/* Rules */
	rowsById: ["row-1"], // array of rules' id's
	/* Rules */

	/*
	A row is a plain object that holds information for inputed rule and how it is presented
	{
		in_state: in_state, // rule infomation 
		read: read, // rule infomation
		write: write, // rule infomation
		direction: ((isLeft) ? LEFT : RIGHT), // rule infomation
		new_state: new_state, // rule infomation

		isLeft: isLeft, // presentational information 
		in_state_error: in_state_error, // presentational information
		read_error: read_error, // presentational information
		write_error: write_error, // presentational information
		new_state_error: new_state_error, // presentational information
	}
	*/
};

const initializeMachine = (state, action) => {
	let new_state = initialState;
	return tape.initializeTape(new_state, action);
}

const step = (state, action) => {
	if (state.tapeInternalState === reservedWords.HALT)
		return state;
	
	/* Find rule by internal state, and val of tape cell*/
	let keyS = state.tapeInternalState, keyV = tape.read(state);
	let rule = null;
	for (var i = 0; i < state.rowsById.length; i++) {
		let row = state[state.rowsById[i]];
		if (row.in_state === keyS && row.read === keyV) {
			rule = row;
			break;
		}
	}

	let new_state = tape.writeIntoTape(state, {val: rule.write});
	new_state = tape.setInternalState(new_state, {state: rule.new_state});
	if (rule.isLeft){
		new_state = gui.moveHead(new_state, {moveLeft: true});
	} else {
		new_state = gui.moveHead(new_state, {moveLeft: false});
	}

	return new_state;
}

const recordInterval = (state, action) => {
	return Object.assign({}, state, {
		interval: action.interval
	});
}

/* SIDE EFFECT HERE!*/
const clear_Interval = (state, action) => { // special
	if (state.interval)
		clearInterval(state.interval);
	return state;
}

export default function(state=initialState, action) {
	switch (action.type) {

		/* Machine actions */
		case actionTypes.INITIALIZAE_MACHINE:
			return initializeMachine(state, action);
		case actionTypes.STEP_FORWARD:
			return step(state, action);
		case actionTypes.RECORD_INTERVAL:
			return recordInterval(state, action);
		case actionTypes.CLEAR_INTERVAL:
			return clear_Interval(state, action);
		/* Machine actions */

		/* GUI info */
		case actionTypes.ADJUST_HEAD_WIDTH:
			return gui.adjustHeadWidth(state, action);
		case actionTypes.SET_PLAY_STATE:
			return gui.setPlayState(state, action);
		case actionTypes.SET_ANIMATION_SPEED:
			return gui.setAnimationSpeed(state, action);
		case actionTypes.MOVE_HEAD:
			return gui.moveHead(state, action);
		/* GUI info */

		/* Tape actions */
		case actionTypes.SET_CORRES_CELL_HEIGHT:
			return tape.setCorrespondingCellHighlight(state, action); 
		case actionTypes.MOVE_TAPE_RIGHT:
			return tape.moveTapeRight(state, action);
		case actionTypes.MOVE_TAPE_LEFT:
			return tape.moveTapeLeft(state, action);
		case actionTypes.FILL_TAPE:
			return tape.fillTape(state, action);
		case actionTypes.INSERT_CELL_BEFORE_HEAD:
			return tape.insertCellBeforeHead(state, action);
		case actionTypes.APPEND_CELL_AFTER_TAIL:
			return tape.appendCellAfterTail(state, action);
		case actionTypes.WRITE_INTO_TAPE:
			return tape.writeIntoTape(state, action);
		case actionTypes.INITIALIZAE_TAPE:
			return tape.initializeTape(state, action);
		case actionTypes.SET_INTERNAL_STATE:
			return tape.setInternalState(state, action);
		case actionTypes.SHIFT_TAPE_POINTER_LEFT:
			return tape.moveLeft(state, action);
		case actionTypes.SHIFT_TAPE_POINTER_RIGHT:
			return tape.moveRight(state, action);
		/* Tape actions */

		/* Rule actions */
		case actionTypes.ADD_ROW:
			return table.addRow(state, action);
		case actionTypes.DELETE_ROW:
			return table.deleteRow(state, action);
		case actionTypes.SET_ROW:
			return table.setRow(state, action);
		case actionTypes.SWITCH_ROW_DIRECTION:
			return table.switchRowDirection(state, action);
		case actionTypes.SET_ROW_IN_STATE:
			return table.setRowInState(state, action);
		case actionTypes.SET_ROW_READ:
			return table.setRowRead(state, action);
		case actionTypes.SET_ROW_WRITE:
			return table.setRowWrite(state, action);
		case actionTypes.SET_ROW_NEW_STATE:
			return table.setRowNewState(state, action);
		/* Rule actions */


		default:
			return state;
	}
}