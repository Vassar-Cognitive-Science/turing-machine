import * as types from '../constants/ActionTypes.js';
import {
	combineReducers
} from 'redux';
import {
	copyDoublyLinkedList
} from './TuringMachineModel.js';
import {
	DLNode,
	DoublyLinkedList
} from './lib/DoublyLinkedList.js';

const _INITIAL_TAPE_SIZE = 20;
const LEFT = "L";
const RIGHT = "R";
const HALT = "H";
const BLANK = "#";

function one_plus_cells(source, val=null) {
	var copyed = copyDoublyLinkedList(source);
	copyed.insertBeforeHead(val);
	return copyed;
}

function cells_plus_one(source, val=null) {
	var copyed = copyDoublyLinkedList(source);
	copyed.appendAfterTail(val);
	return copyed;
}

const initialState = {
	tapePointer: 0,
	tapeCells: new DoublyLinkedList(_INITIAL_TAPE_SIZE),
	tapeInternalState: null,

	read: null;

}

export const Tape = (state = initialState, action) => {
	switch (action.type) {
		case types.SHIFT_TAPE_POINTER_LEFT:
			if (state.tapePointer - 1 < 0) {
				return {
					...state,
					tapeCells: one_plus_cells(state.tapeCells),
					tapePointer: 0
						// read: state.cells.getNodeAt(state.tapePointer).val
				};
			} else {
				// var new_position = state.tapePointer - 1;
				return {
					...state,
					tapePointer: state.tapePointer - 1
						// read: state.cells.getNodeAt(new_position).val
				};
			}
		case types.SHIFT_TAPE_POINTER_RIGHT:
			if (state.tapePointer + 1 >= state.tapeCells.size()) {
				return {
					...state,
					tapeCells: cells_plus_one(state.tapeCells),
					tapePointer: state.tapePointer + 1
				};
			} else {
				return {
					...state,
					tapePointer: state.tapePointer + 1
				};
			}
		case types.SET_INTERNAL_STATE:
			return {
				...state,
				tapeInternalState: action.state
			};
		case types.INSERT_CELL_BEFORE_HEAD:
			return {
				...state,
				tapeCells: one_plus_cells(state.tapeCells),
				tapePointer: state.tapePointer + 1
			};
		case types.APPEND_CELL_AFTER_TAIL:
			return {
				...state,
				tapeCells: cells_plus_one(state.cells)
			};

	}
}

