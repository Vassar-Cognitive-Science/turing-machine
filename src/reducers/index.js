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

	runHistory: [],
	undoEditHistory: [],
	redoEditHistory: [],
	/* MACHINE GUI settings */

	/* GUI settings */

	/* Tape and Head */
	anchorCell: 0, // serves to help mapping presented cells to virtual cells in tape
	tapeHead: 0, // Tape head, see linked list structure 
	tapeTail: 0, // Tape tail, see linked list structure
	tapePointer: 0, // Tells where is the Tape Head in Tape
	tapeCellsById: [], // array of virtual cells' ids
	tapeInternalState: "0", // Tape Head state
	highlightedCellOrder: -1,
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
	// rowsById: [], // array of rules' id's
	highlightedRow: null,
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

	
	//For test
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
	
};

export default rootReducer;

function rootReducer (state=initialState, action) {
	let s1, s2, s3, s4;
	let cache = createEditHistoryCache(state, action);
	let new_state = state;
	if (cache) {
		new_state = Object.assign({}, state, {
			undoEditHistory: state.undoEditHistory.slice(),
		});
		new_state.undoEditHistory.push(cache);
	}

	s1 = ruleReducer(new_state, action);
	s2 = tapeReducer(s1, action);
	s3 = guiReducer(s2, action);
	s4 = machineReducer(s3, action);

	switch(action.type) {
		case actionTypes.UNDO:
			return cleanSideEffects(undo(s4, action), false);
		case actionTypes.REDO:
			return cleanSideEffects(redo(s4, action), false);
		default:
			return s4;
	}
}

function initializeMachine(state, action) {
	let new_state = initialState;
	return tape.initializeTape(new_state, action);
}

function cleanSideEffects(state, clearRedo=true) {
	return Object.assign({}, state, {
		machineReportError: "",
		showReportedError: false,
		highlightedRow: null,
		redoEditHistory: (clearRedo) ? [] : state.redoEditHistory
	})
}


function redo(state, action) {
	if (state.redoEditHistory.length === 0)
		return state;
	
	let redoAction = state.redoEditHistory[state.redoEditHistory.length-1];
	let new_state = Object.assign({}, state, {
		redoEditHistory: state.redoEditHistory.slice(0, state.redoEditHistory.length-1)
	});

	return rootReducer(new_state, redoAction);
}

function undo(state, action) {
	if (state.undoEditHistory.length === 0)
		return state;

	let cache = state.undoEditHistory[state.undoEditHistory.length-1];
	let undoAction = cache.undo;
	let new_state;

	switch (undoAction.type) {
		case actionTypes.INITIALIZAE_MACHINE:
			new_state = Object.assign({}, undoAction.lastState);
			break;
		case actionTypes.FILL_TAPE:
			new_state = tape.fillTape(state, undoAction);
			break;
		case actionTypes.INITIALIZAE_TAPE:
			new_state = Object.assign({}, state, {
				anchorCell: undoAction.anchorCell,
				tapeHead: undoAction.tapeHead, 
				tapeTail: undoAction.tapeTail, 
				tapePointer: undoAction.tapePointer, 
				tapeCellsById: undoAction.tapeCellsById,
			});

			for (let i = 0; i < state.tapeCellsById.length; i++) {
				let id = state.tapeCellsById[i];
				delete new_state[id];
			}

			for (let i = 0; i < undoAction.tapeCellsById.length; i++) {
				let id = undoAction.tapeCellsById[i];
				new_state[id] = tape.cloneCell(undoAction[id]);
			}
			break;
		case actionTypes.SET_INTERNAL_STATE:
			new_state = gui.adjustHeadWidth(tape.setInternalState(state, undoAction), { text: undoAction.state });
			break;
		case actionTypes.ADD_ROW:
			new_state = table.deleteRow(state, undoAction);
			break;
		case actionTypes.DELETE_ROW:
			new_state = Object.assign({}, state, {
				rowsById: undoAction.rowsById,
			})
			new_state[undoAction.rowId] = table.cloneRow(undoAction.row);
			break;
		case actionTypes.SWITCH_ROW_DIRECTION:
		case actionTypes.SET_ROW_IN_STATE:
		case actionTypes.SET_ROW_READ:
		case actionTypes.SET_ROW_WRITE:
		case actionTypes.SET_ROW_NEW_STATE:
			new_state = ruleReducer(state, undoAction);
			break;
		default:
			return state;
	}

	let newRedoHistory = new_state.redoEditHistory.slice();
	newRedoHistory.push(cache.redo);

	return Object.assign({}, new_state, {
		undoEditHistory: new_state.undoEditHistory.slice(0, new_state.undoEditHistory.length-1),
		redoEditHistory: newRedoHistory
	});
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

	return ((changed) ? cleanSideEffects(new_state) : state);
}

function tapeReducer(state, action) {
	let new_state = state, changed = true;
	switch (action.type) {
		/* Tape actions */
		case actionTypes.SET_CORRES_CELL_HEIGHT:
			new_state = tape.highlightCorrespondingCell(state, action); 
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

	return ((changed) ? cleanSideEffects(new_state) : state);
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

	return ((changed) ? cleanSideEffects(new_state) : state);
}

function createEditHistoryCache(state, action) {
	let cache = {
		undo: null,
		redo: action,
	}
	switch (action.type) {
		case actionTypes.FILL_TAPE:
			let id = tape.standardizeCellId(action.position + state.anchorCell);
			cache.undo = {
				val: state[id].val,
				position: action.position
			};
			break;
		case actionTypes.INITIALIZAE_TAPE:
			cache.undo = {
				anchorCell: state.anchorCell,
				tapeHead: state.tapeHead, 
				tapeTail: state.tapeTail, 
				tapePointer: state.tapePointer, 
				tapeCellsById: state.tapeCellsById,
			};
			for (var i = 0; i < cache.undo.tapeCellsById.length; i++) {
				let id = cache.undo.tapeCellsById[i];
				cache.undo[id] = tape.cloneCell(state[id]);
			}
			break;
		case actionTypes.SET_INTERNAL_STATE:
			cache.undo = { state: state.tapeInternalState };
			break;
		case actionTypes.ADD_ROW:
			cache.undo = { rowsById: state.rowsById, row: action.id };
			break;
		case actionTypes.DELETE_ROW:
			cache.undo = { rowsById: state.rowsById, row: state[action.id], rowId: action.id };
			break;
		case actionTypes.SWITCH_ROW_DIRECTION:
			cache.undo = { id: action.id };
			break;
		case actionTypes.SET_ROW_IN_STATE:
			cache.undo = { in_state: state[action.id].in_state, id: action.id };
			break;
		case actionTypes.SET_ROW_READ:
			cache.undo = { read: state[action.id].read, id: action.id };
			break;
		case actionTypes.SET_ROW_WRITE:
			cache.undo = { write: state[action.id].write, id: action.id };
			break;
		case actionTypes.SET_ROW_NEW_STATE:
			cache.undo = { new_state: state[action.id].new_state, id: action.id };
			break;
		case actionTypes.INITIALIZAE_MACHINE:
			cache.undo = { lastState: state };
			break;
		default:
			return null;
	}

	cache.undo.type = action.type;
	return cache;
}

