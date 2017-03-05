import * as actionTypes from '../constants/ActionTypes.js';

export function writeIntoTapeAction(val = null) {
	return {
		type: actionTypes.WRITE_INTO_TAPE,
		val: val
	}
}

export function initializeTapeAction(tapeSize) {
	return {
		type: actionTypes.INITIALIZAE_TAPE,
		tapeSize: tapeSize
	};
} 

export function fillTapeAction(position, val=null) {
	return {
		type: actionTypes.FILL_TAPE,
		position: position,
		val: val
	}
} 

export function moveTapeRightAction(position) {
	return {
		type: actionTypes.MOVE_TAPE_RIGHT,
		position: position
	}
}

export function moveTapeLeftAction(position) {
	return {
		type: actionTypes.MOVE_TAPE_LEFT,
		position: position
	}
}

export function setInternalStateAction(state) {
	return {
		type: actionTypes.SET_INTERNAL_STATE,
		state: state
	};
}

export function switchHeadModeAction(tapeHeadEditable) {
	return {
		type: actionTypes.SWITCH_HEAD_MODE,
		tapeHeadEditable: tapeHeadEditable
	}
}

export function moveLeftAction() {
	return {
		type: actionTypes.SHIFT_TAPE_POINTER_LEFT
	};
}

export function moveRightAction() {
	return {
		type: actionTypes.SHIFT_TAPE_POINTER_RIGHT
	};
}

export function highlightCorrespondingCellAction(flag) {
	return {
		type: actionTypes.SET_CORRES_CELL_HEIGHT,
		flag: flag
	}
}
