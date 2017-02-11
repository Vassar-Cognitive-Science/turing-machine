import * as actionTypes from '../constants/ActionTypes.js';

export function initMachineAction() {
	return {
		type: actionTypes.INITIALIZAE_MACHINE
	};
} 

export function stepAction() {
	return {
		type: actionTypes.STEP_FORWARD
	};
}

export function writeIntoTapeAction(val = null) {
	return {
		type: actionTypes.WRITE_INTO_TAPE,
		val: val
	}
}

export function insertCellBeforeHeadAction(val=null) {
	return {
		type: actionTypes.INSERT_CELL_BEFORE_HEAD,
		val: val
	};
}

export function appendCellAfterTailAction(val=null) {
	return {
		type: actionTypes.APPEND_CELL_AFTER_TAIL,
		val: val
	};
}

export function initializeTape(tapeSize) {
	return {
		type: actionTypes.INITIALIZAE_TAPE,
		tapeSize: tapeSize
	};
} 

export function setInternalStateAction(state) {
	return {
		type: actionTypes.SET_INTERNAL_STATE,
		state: state
	};
}

export function moveLeftAction(direction) {
	return {
		type: actionTypes.SHIFT_TAPE_POINTER_LEFT,
		direction: direction
	};
}

export function moveRightAction(direction) {
	return {
		type: actionTypes.SHIFT_TAPE_POINTER_RIGHT,
		direction: direction
	};
}

export function addRuleAction(in_state, read, write, direction, new_state) {
	return {
		type: actionTypes.ADD_RULE,
		in_state: in_state,
		read: read, 
		write: write,
		direction: direction,
		new_state: new_state
	};
}

export function setRuleAction(in_state, read, write, direction, new_state) {
	return {
		type: actionTypes.SET_RULE,
		in_state: in_state,
		read: read, 
		write: write,
		direction: direction,
		new_state: new_state
	};
}

export function deleteRuleAction(in_state, read) {
	return {
		type: actionTypes.DELETE_RULE,
		in_state: in_state,
		read: read, 
	};
}