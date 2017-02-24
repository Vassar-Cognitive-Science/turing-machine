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

export function setAnchorCellAction(direction) {
	return {
		type: actionTypes.SET_ANCHOR_CELL,
		direction: direction
	}
}

export function initializeTape(tapeSize) {
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

export function addRowAction(id) {
	return {
		type: actionTypes.ADD_ROW,
		id: id
	};
}

export function deleteRowAction(id) {
	return {
		type: actionTypes.DELETE_ROW,
		id: id
	};
}

export function switchRowModeAction(id) {
	return {
		type: actionTypes.SWITCH_ROW_MODE,
		id: id,
	};
}

export function switchRowDirectionAction(id) {
	return {
		type: actionTypes.SWITCH_ROW_DIRECTION,
		id: id
	};
}

export function setRowAction(id, in_state, read, write, isLeft, new_state) {
	return {
		type: actionTypes.SET_ROW,
		id: id,
		in_state: in_state,
		read: read, 
		write: write,
		isLeft: isLeft,
		new_state: new_state
	};
}



// export function addRuleAction(in_state, read, write, direction, new_state) {
// 	return {
// 		type: actionTypes.ADD_RULE,
// 		in_state: in_state,
// 		read: read, 
// 		write: write,
// 		direction: direction,
// 		new_state: new_state
// 	};
// }

// export function setRuleAction(in_state, read, write, direction, new_state) {
// 	return {
// 		type: actionTypes.SET_RULE,
// 		in_state: in_state,
// 		read: read, 
// 		write: write,
// 		direction: direction,
// 		new_state: new_state
// 	};
// }

// export function deleteRuleAction(in_state, read) {
// 	return {
// 		type: actionTypes.DELETE_RULE,
// 		in_state: in_state,
// 		read: read, 
// 	};
// }