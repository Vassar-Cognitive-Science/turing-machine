import * as actionTypes from '../constants/ActionTypes';
import * as tape from './tape';
import * as table from './table';
import * as gui from './gui';
import * as machine from './machine';
import { N_CELLS, INIT_HEAD_WIDTH, INIT_HEAD_HEIGHT, INIT_HEAD_LEFT_OFFSET, ANIMATION_SPEED, head_x } from '../constants/GUISettings';

export const initialState = {
	/* GUI settings */

	/* TAPE GUI settings */
	cellNum: N_CELLS, // number of presented cells
	anchorCell: 0, // serves to help mapping presented cells to virtual cells in tape
	/* TAPE GUI settings */

	/* HEAD GUI settings */
	headWidth: INIT_HEAD_WIDTH, // control Tape Head width
	headHeight: INIT_HEAD_HEIGHT, // control Tape Head height
	headLeftOffset: INIT_HEAD_LEFT_OFFSET, // control Tape Head input box position 
	headX: head_x(), // x coordinate of Tape Head
	/* HEAD GUI settings */

	/* MACHINE GUI settings */
	isRunning: false, // is the machine running
	interval: null, // Animation interval function, returned by setInterval(callback, timeout)
	animationSpeedFactor: 1.0, // 100% of default speed
	animationSpeed: ANIMATION_SPEED, // calculated speed, not necessary but make things convenient 
	machineReportError: "",
	showReportedError: false,

	runHistory: [0],
	runCount: 0,
	lastRun: null,
	/* MACHINE GUI settings */

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
	rowsById: [], // array of rules' id's
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

	/*For test
	rowsById: ["row-1", "row-2", "row-3"],
	"row-1": {
		in_state: "0",
		read: "1",
		write: "2",
		isLeft: false,
		new_state: "0"
	},
	"row-2": {
		in_state: "0",
		read: "2",
		write: "1",
		isLeft: true,
		new_state: "1"
	},
	"row-3": {
		in_state: "1",
		read: "1",
		write: "2",
		isLeft: true,
		new_state: "1"
	}
	*/
};

export default function(state=initialState, action) {
	let s1, s2, s3, s4;

	s1 = ruleReducer(state, action);
	s2 = tapeReducer(s1, action);
	s3 = guiReducer(s2, action);
	s4 = machineReducer(s3, action);

	return s4;
}

function clearReportedError(state, action) {
	return Object.assign({}, state, {
		machineReportError: "",
		showReportedError: false,
	})
}

function initializeMachine(state, action) {
	let new_state = initialState;
	return tape.initializeTape(new_state, action);
}

function machineReducer(state, action) {
	let new_state = state;
	switch (action.type) {
		case actionTypes.INITIALIZAE_MACHINE:
			new_state = initializeMachine(state, action);
			break;

			/* Machine actions */
		case actionTypes.STEP_FORWARD:
			new_state = machine.step(state, action);
			break;
		case actionTypes.RECORD_INTERVAL:
			new_state = machine.recordInterval(state, action);
			break;
		case actionTypes.CLEAR_INTERVAL:
			new_state = machine.clear_Interval(state, action);
			break;
		case actionTypes.STOP:
			new_state = machine.stop(state, action);
			break;
			/* Machine actions */

		case actionTypes.STEP_BACK:
			new_state = machine.stepBack(state, action);
			break;
		case actionTypes.RESTORE:
			new_state = machine.restore(state, action);
			break;
		default:
			break;
	}

	return new_state;
}

function guiReducer(state, action) {
	let new_state = state, changed = true;
	switch (action.type) {
		/* GUI info */
		case actionTypes.ADJUST_HEAD_WIDTH:
			new_state = gui.adjustHeadWidth(state, action);
			break;
		case actionTypes.SET_PLAY_STATE:
			new_state = gui.setPlayState(state, action);
			break;
		case actionTypes.SET_ANIMATION_SPEED:
			new_state = gui.setAnimationSpeed(state, action);
			break;
		case actionTypes.MOVE_HEAD:
			new_state = gui.moveHead(state, action);
			break;
		/* GUI info */
		default:
			changed = false;
	}

	return ((changed) ? clearReportedError(new_state) : state);
}

function tapeReducer(state, action) {
	let new_state = state, changed = true;
	switch (action.type) {
		/* Tape actions */
		case actionTypes.SET_CORRES_CELL_HEIGHT:
			new_state = tape.setCorrespondingCellHighlight(state, action); 
			break;
		case actionTypes.MOVE_TAPE_RIGHT:
			new_state = tape.moveTapeRight(state, action);
			break;
		case actionTypes.MOVE_TAPE_LEFT:
			new_state = tape.moveTapeLeft(state, action);
			break;
		case actionTypes.FILL_TAPE:
			new_state = tape.fillTape(state, action);
			break;
		case actionTypes.WRITE_INTO_TAPE:
			new_state = tape.writeIntoTape(state, action);
			break;
		case actionTypes.INITIALIZAE_TAPE:
			new_state = tape.initializeTape(state, action);
			break;
		case actionTypes.SET_INTERNAL_STATE:
			new_state = tape.setInternalState(state, action);
			break;
		case actionTypes.SHIFT_TAPE_POINTER_LEFT:
			new_state = tape.moveLeft(state, action);
			break;
		case actionTypes.SHIFT_TAPE_POINTER_RIGHT:
			new_state = tape.moveRight(state, action);
			break;
		/* Tape actions */
		default:
			changed = false;
	}

	return ((changed) ? clearReportedError(new_state) : state);
}

function ruleReducer(state, action) {
	let new_state = state, changed = true;
	switch (action.type) {
		/* Rule actions */
		case actionTypes.ADD_ROW:
			new_state = table.addRow(state, action);
			break;
		case actionTypes.DELETE_ROW:
			new_state = table.deleteRow(state, action);
			break;
		case actionTypes.SET_ROW:
			new_state = table.setRow(state, action);
			break;
		case actionTypes.SWITCH_ROW_DIRECTION:
			new_state = table.switchRowDirection(state, action);
			break;
		case actionTypes.SET_ROW_IN_STATE:
			new_state = table.setRowInState(state, action);
			break;
		case actionTypes.SET_ROW_READ:
			new_state = table.setRowRead(state, action);
			break;
		case actionTypes.SET_ROW_WRITE:
			new_state = table.setRowWrite(state, action);
			break;
		case actionTypes.SET_ROW_NEW_STATE:
			new_state = table.setRowNewState(state, action);
			break;
		/* Rule actions */
		default:
			changed = false;
	}

	return ((changed) ? clearReportedError(new_state) : state);
}
