import * as actionTypes from '../constants/ActionTypes';

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

export function switchRowDirectionAction(id) {
	return {
		type: actionTypes.SWITCH_ROW_DIRECTION,
		id: id
	};
}

export function setRowInStateAction(id, in_state) {
	return {
		type: actionTypes.SET_ROW_IN_STATE,
		id: id,
		in_state: in_state
	}
}

export function setRowReadAction(id, read) {
	return {
		type: actionTypes.SET_ROW_READ,
		id: id,
		read: read
	}
}

export function setRowWriteAction(id, write) {
	return {
		type: actionTypes.SET_ROW_WRITE,
		id: id,
		write: write
	}
}

export function setRowNewStateAction(id, new_state) {
	return {
		type: actionTypes.SET_ROW_NEW_STATE,
		id: id,
		new_state: new_state
	}
}
