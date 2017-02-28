import * as tape from './tape';
import * as reservedWords from '../constants/ReservedWords';
import * as actionTypes from '../constants/ActionTypes';
import * as table from './table';
import * as gui from './gui';
import { INIT_HEAD_WIDTH, INIT_HEAD_HEIGHT, INIT_HEAD_LEFT_OFFSET, ANIMATION_SPEED, HEAD_X } from '../constants/GUISettings';

export const initialState = {
	/* GUI settings */
	headWidth: INIT_HEAD_WIDTH,
	headHeight: INIT_HEAD_HEIGHT,
	headLeftOffset : INIT_HEAD_LEFT_OFFSET,
	headX: HEAD_X,

	isPaused: false,
	animationSpeedFactor: 1, // 100% of default speed
	animationSpeed: ANIMATION_SPEED,
	/* GUI settings */

	/* Tape and Head */
	anchorCell: 0,
	tapeHead: 0,
	tapeTail: 0,
	tapePointer: 0,
	tapeCellsById: [],
	tapeInternalState: "",
	/* Tape and Head */

	/* Rules */
	rowsById: [],
	/* Rules */
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
		new_state = tape.moveLeft(new_state);
		new_state = gui.moveHead(new_state, {moveLeft: true});
	} else {
		new_state = tape.moveRight(new_state);
		new_state = gui.moveHead(new_state, {moveLeft: false});
	}

	return new_state;
}

export default function(state=initialState, action) {
	switch (action.type) {

		/* Machine actions */
		case actionTypes.INITIALIZAE_MACHINE:
			return initializeMachine(state, action);
		case actionTypes.STEP_FORWARD:
			return step(state, action);
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
		case actionTypes.SET_ANCHOR_CELL:
			return tape.setAnchorCell(state, action);
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