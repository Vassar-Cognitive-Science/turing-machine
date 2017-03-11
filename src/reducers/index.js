import * as actionTypes from '../constants/ActionTypes';
import * as tape from './tape';
import * as table from './table';
import * as gui from './gui';
import * as machine from './machine';
import * as trial from './trial';
import { INIT_HEAD_WIDTH, INIT_HEAD_LEFT_OFFSET, ANIMATION_SPEED } from '../constants/GUISettings';

export const initialState = {
/* GUI settings */

	/*Trial Drawer GUI settings*/

	/*Trial Drawer GUI settings*/

	/*** The following five are initialized by gui.resizeScreenAndTape  ***/
	screenSize: (window) ? window.innerWidth : 1396,
	cellNum: 0, // number of presented cells
	rightBoundary: 0, 
	headX: 0, // x coordinate of Tape Head
	// tapePointer
	/*** The above five are initialized by gui.resizeScreenAndTape  ***/

	/* HEAD Width settings */
	headWidth: INIT_HEAD_WIDTH, // control Tape Head width
	headLeftOffset: INIT_HEAD_LEFT_OFFSET, // control Tape Head input box position 
	/* HEAD Width settings */

	/* MACHINE GUI settings */
	isRunning: false, // is the machine running
	interval: null, // Animation interval function, returned by setInterval(callback, timeout)
	animationSpeedFactor: 1.0, // 100% of default speed
	animationSpeed: ANIMATION_SPEED, // calculated speed, not necessary but make things convenient 
	animationOn: true,
	machineReportError: "",
	showReportedError: false,

	stepCount: 0,
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
	tapeInternalState: "0", // Tape Head state, default is "0"
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

/* Trials */
	// testsById: [],
	runningTrial: null,
/* Trials */

	
	testsById: ["Test 0"],
	"Test 0": {
		startState: "0",
		expectedFinalState: "0",
		startTape: [1,1,1,1,1,1,2],
		expectedFinalTape: [2,2,2,2,2,2,2],

		tapePointer: 0,
		sourceFile: null
	},

	//For test
	rowsById: ["row-1", "row-2", "row-3"],
	"row-1": {
		in_state: "0",
		read: "#",
		write: "2",
		isLeft: false,
		new_state: "0"
	},
	"row-2": {
		in_state: "0",
		read: "2",
		write: "2",
		isLeft: true,
		new_state: "0"
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

/*
Root reducer
Logic:
	first, call createEditHistoryCache, record relevant data if user edits something
	second, call reducers for machine, gui, tape, rule, order does not matter
	finally, add in undo/redo reducers
*/
function rootReducer (state=initialState, action, clearRedo) {
	let s1, s2, s3, s4, s5;
	let cache = createEditHistoryCache(state, action);
	let new_state = state;
	if (cache) {
		new_state = Object.assign({}, state, {
			undoEditHistory: state.undoEditHistory.slice(),
		});
		new_state.undoEditHistory.push(cache);
	}

	s1 = ruleReducer(new_state, action, clearRedo);
	s2 = tapeReducer(s1, action, clearRedo);
	s3 = guiReducer(s2, action);
	s4 = machineReducer(s3, action);
	s5 = trialReducer(s4, action);

	switch(action.type) {
		case actionTypes.INITIALIZAE_MACHINE:
			return initializeMachine(state, action);
		case actionTypes.UNDO:
			return cleanSideEffects(undo(s5, action), false);
		case actionTypes.REDO:
			return cleanSideEffects(redo(s5, action), false);
		default:
			return s5;
	}
}


/*
Initialize the machine
*/
function initializeMachine(state, action) {
	let new_state = gui.resizeScreenAndTape(initialState, {screenWidth: window.innerWidth});
	return tape.initializeTape(new_state, { controlled: true });
}

/*
Clear error message, and other side effects once some change is made in the app

clearRedo: decide if redoEditHistory shall be cleared
*/
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

	return rootReducer(new_state, redoAction, false);
}

/*
Undo Reducer:
Also see the createEditHistoryCache function down below
UndoAction: take from cache.undo (returned by createEditHistoryCache), it represents the old state before action dispatched
logic:
	Fill tape:
		write into a tape cell the old value it had
	Initialize tape:
		update anchorCell, tapeHead, tapeTail, tapePointer, tapeCellsById with old values (recorded in undoAction)
		delete existing tape cells, 
		add in back old tape cells
	Set internal State:
		first set internal state with old value (recorded in undoAction), then adjust Head width
	Add row:
		Delete added row
	Delete row:
	 	Add deleted row
	Set row:
		set row with old value (recorded in undoAction)
		Here uses ruleReducer to reduce code length, 
		
MUST ADD "clearRedo = false" as a parameter to ruleReducer so that
changes here in UNDO logic will and should not affect the redoEditHistory Array  
*/
function undo(state, action) {
	if (state.undoEditHistory.length === 0)
		return state;

	let cache = state.undoEditHistory[state.undoEditHistory.length-1];
	let undoAction = cache.undo;
	let new_state;

	switch (undoAction.type) {
		case actionTypes.ADD_ROW:
			new_state = table.deleteRow(state, undoAction);
			break;
		case actionTypes.DELETE_ROW:
			new_state = Object.assign({}, state, {
				rowsById: undoAction.rowsById.slice(),
			})
			new_state[undoAction.rowId] = table.cloneRow(undoAction.row);
			break;
		case actionTypes.SWITCH_ROW_DIRECTION:
		case actionTypes.SET_ROW_IN_STATE:
		case actionTypes.SET_ROW_READ:
		case actionTypes.SET_ROW_WRITE:
		case actionTypes.SET_ROW_NEW_STATE:
			new_state = ruleReducer(state, undoAction, false);
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

/*Grouped Reducers for Machine*/
function machineReducer(state, action) {
	let new_state = state;
	switch (action.type) {

			/* Machine actions */
		case actionTypes.PRE_STEP_FORWARD:
			new_state = machine.preStep(state, action);
			break;
		case actionTypes.STEP_FORWARD:
			new_state = machine.step(state, action);
			break;
		case actionTypes.RECORD_INTERVAL:
			new_state = machine.recordInterval(state, action);
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

/*
Grouped Reducers for GUI, 

the clearSideEffect() will be called if there is action dispatched to change gui
*/
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
		case actionTypes.RESIZE_SCREEN_AND_TAPE:
			changed = false;
			new_state = gui.resizeScreenAndTape(state, action);
			break;
		case actionTypes.ANIMATION_ON:
			changed = false;
			new_state = gui.toggleAnimation(state, action);
			break;
		/* GUI info */
		default:
			changed = false;
	}

	return ((changed) ? cleanSideEffects(new_state) : new_state);
}


/*
Grouped Reducers for Tape, 

the clearSideEffect() will be called if there is action dispatched to change tape

Extra Argument explanation:
clearRedo: boolean, if true, it means that we want to clear the redo history, the change is made by user
					if false, it the change is made by undo/redo mechanism 
*/
function tapeReducer(state, action, clearRedo) {
	// let new_state = state, changed = true; //Undo reacts on tape version

	let new_state = state, changed = false;
	switch (action.type) {
		/* Tape actions */
		case actionTypes.SET_CORRES_CELL_HEIGHT:
			new_state = tape.highlightCorrespondingCell(state, action); 
			break;
		case actionTypes.MOVE_TAPE_RIGHT:
			clearRedo = false;
			new_state = tape.moveTapeRight(state, action);
			break;
		case actionTypes.MOVE_TAPE_LEFT:
			clearRedo = false;
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
			clearRedo = false;
			new_state = tape.moveLeft(state, action);
			break;
		case actionTypes.SHIFT_TAPE_POINTER_RIGHT:
			clearRedo = false;
			new_state = tape.moveRight(state, action);
			break;
		/* Tape actions */

		// case actionTypes.LOAD_TRIAL:
		// 	new_state = trial.loadTrial(state, action);
		// 	break;
		default:
			changed = false;
	}

	return ((changed) ? cleanSideEffects(new_state, clearRedo) : new_state);
}

/*
Grouped Reducers for Rule, 

the clearSideEffect() will be called if there is action dispatched to change tape

Extra Argument explanation:
clearRedo: boolean, if true, it means that we want to clear the redo history, the change is made by user
					if false, it the change is made by undo/redo mechanism 
*/
function ruleReducer(state, action, clearRedo) {
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

	return ((changed) ? cleanSideEffects(new_state, clearRedo) : new_state);
}


function trialReducer(state, action) {
	switch(action.type) {
		case actionTypes.DELETE_TRIAL:
			return trial.deleteTrial(state, action);
		case actionTypes.ADD_TRIAL:
			return trial.addTrial(state, action);
		case actionTypes.RUN_TRIAL:
			return trial.runTrial(state, action);
		case actionTypes.LOAD_TRIAL:
			return trial.loadTrial(state, action);
		case actionTypes.PRE_RUN_TRIAL:
			return trial.preRunTrial(state, action);
		default:
			return state; 
	}
}


/*
Create object that holds necessary information for furture undo and redo actions.
Redo logic:
	Simply record the passed in action, which will be later dispatched.

Undo logic:
	Fill tape:
		record old value, and changed cell Id
	Initialize tape:
		record old [anchorCell, tapeHead, tapeTail, tapePointer, tapeCellsById] values 
		record all tape cells
	Set internal State:
		record old internal state,
		In fact, it is the result setTapeInternalStateAction(oldStateValue)
	Add row:
		Record added row id, 
		In fact, it is the result deleteRowAction(id)
	Delete row:
	 	Record deleted row id, and its data
	Set row:
		record relevant data
*/
function createEditHistoryCache(state, action) {
	let cache = {
		undo: null,
		redo: Object.assign({}, action),
	}

	switch (action.type) {
		
		case actionTypes.ADD_ROW:
			cache.undo = { id: action.id };
			break;
		case actionTypes.DELETE_ROW:
			cache.undo = { rowsById: state.rowsById.slice(), row: state[action.id], rowId: action.id };
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










/* Undo reacts to tape version

function undo(state, action) {
	if (state.undoEditHistory.length === 0)
		return state;

	let cache = state.undoEditHistory[state.undoEditHistory.length-1];
	let undoAction = cache.undo;
	let new_state;

	switch (undoAction.type) {
		case actionTypes.LOAD_TRIAL:
			new_state = Object.assign({}, state, {
				anchorCell: undoAction.anchorCell,
				tapeHead: undoAction.tapeHead, 
				tapeTail: undoAction.tapeTail, 
				tapePointer: undoAction.tapePointer, 
				tapeCellsById: undoAction.tapeCellsById,
				headX: undoAction.headX,
				headLeftOffset: undoAction.headLeftOffset,
				headWidth: undoAction.headWidth,
				tapeInternalState: undoAction.tapeInternalState,
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
		case actionTypes.FILL_TAPE:
			new_state = Object.assign({}, state);
			new_state[undoAction.actualId] = tape.cloneCell(state[undoAction.actualId]);
			new_state[undoAction.actualId].val = undoAction.val;
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

function createEditHistoryCache(state, action) {
	let cache = {
		undo: null,
		redo: Object.assign({}, action),
	}

	switch (action.type) {
		case actionTypes.LOAD_TRIAL:
			cache.undo = {
				headX: state.headX,
				anchorCell: state.anchorCell,
				tapeHead: state.tapeHead, 
				tapeTail: state.tapeTail, 
				tapePointer: state.tapePointer, 
				tapeCellsById: state.tapeCellsById.slice(),
				headLeftOffset: state.headLeftOffset,
				headWidth: state.headWidth,
				tapeInternalState: state.tapeInternalState,
			};
			for (var i = 0; i < cache.undo.tapeCellsById.length; i++) {
				let id = cache.undo.tapeCellsById[i];
				cache.undo[id] = tape.cloneCell(state[id]);
			}
			break;
		case actionTypes.FILL_TAPE:
			let id;
			if (cache.redo.id) 
				id = cache.redo.id;
			else
				id = tape.standardizeCellId(action.position + state.anchorCell);
			
			cache.undo = {
				val: state[id].val,
				actualId: id,
			};
			cache.redo.id = id;
			break;
		case actionTypes.INITIALIZAE_TAPE:
			cache.undo = {
				anchorCell: state.anchorCell,
				tapeHead: state.tapeHead, 
				tapeTail: state.tapeTail, 
				tapePointer: state.tapePointer, 
				tapeCellsById: state.tapeCellsById.slice(),
			};
			for (var i = 0; i < cache.undo.tapeCellsById.length; i++) {
				let id = cache.undo.tapeCellsById[i];
				cache.undo[id] = tape.cloneCell(state[id]);
			}
			break;
		case actionTypes.SET_INTERNAL_STATE:
			cache.undo = { state: state.tapeInternalState };
			break;
		default:
			return null;
	}

	cache.undo.type = action.type;
	return cache;
}





*/