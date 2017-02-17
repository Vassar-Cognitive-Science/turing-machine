import {
	LEFT,
	RIGHT,
	BLANK
} from '../constants/ReservedWords.js';


/*
A cell is an plain object
{
	val: val,
	prev: prev,
	next: next
}
*/


/* Constants */

const CELL_ID_PREFIX = "TAPE-CELL ";

/* Constants */

/* Useful functions */

export const tapeSize = (state) => {
	return state.tapeCellsById.length;
}

export const isTapeEmpty = (state) => {
	return tapeSize(state) == 0;
}

export const findCell = (state, id) => {
	var cell = state[standardizeCellId(id)];
	if (cell != undefined)
		return cell;
	return null;
}

/* Useful functions */


/* Reducer functions */

export const initializeTape = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeHead: 0,
		tapeTail: 0,
		tapePointer: 0,
		tapeCellsById: [],
		tapeInternalState: null
	});
	for (let i = 0; i < state.tapeCellsById.length; i++) {
		delete new_state[state.tapeCellsById[i]];
	}
	expandAfterTailHelper(new_state, action.tapeSize);
	return new_state;
}

export const appendAfterTail = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	appendAfterTailHelper(new_state, action.val);
	return new_state;
}

export const insertBeforeHead = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	insertBeforeHeadHelper(new_state, action.val);
	return new_state;
}

export const expandAfterTail = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	expandAfterTailHelper(new_state, action.n);
	return new_state;
}

export const expandAfterTailHelper = (state, n = 1) => {
	while (n--) {
		appendAfterTailHelper(state);
	}
}

export const expandBeforeHead = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	expandBeforeHeadHelper(new_state);
	return new_state;
}

export const writeIntoTape = (state, action) => {
	new_state = Object.assign({}, state);
	new_state[standardizeCellId(state.tapePointer)] = writeHelper(state, action.val);
	return new_state;
}

export const moveLeft = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	moveLeftHelper(new_state);
	return new_state;
}

export const moveRight = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	moveRightHelper(new_state);
	return new_state;
}

export const writeAndMove = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice(),
		tapeInternalState: action.new_state
	});
	writeAndMoveHelper(new_state, action.direction, action.val);
	return new_state;
}

export const read = (state) => {
	var cur = findCell(state, state.tapePointer);
	if (cur == null)
		return null;
	return cur.val;
}

export const setInternalState = (state, action) => {
	return Object.assign({}, state, {
		tapeInternalState: action.state
	});
}

/* Reducer functions */


/* Helper functions */

const createCell = (prev = null, next = null, val = null) => {
	return {
		val: val,
		prev: standardizeCellId(prev),
		next: standardizeCellId(next)
	};
}

const standardizeCellId = (id) => {
	if (id == null) return null;
	return CELL_ID_PREFIX + id;
}

const appendAfterTailHelper = (state, val = null) => {
	if (isTapeEmpty(state)) {
		state.tapeHead--;
	}
	var prev = findCell(state, state.tapeTail - 1);
	if (prev != null)
		prev.next = standardizeCellId(state.tapeTail);
	state.tapeCellsById.push(standardizeCellId(state.tapeTail));
	state[standardizeCellId(state.tapeTail++)] = createCell(state.tapeTail - 2, null, val);
}

const insertBeforeHeadHelper = (state, val = null) => {
	if (isTapeEmpty(state)) {
		state.tapeTail++;
	}
	var next = findCell(state, state.tapeHead + 1);
	if (next != null)
		next.prev = standardizeCellId(state.tapeHead);
	state.tapeCellsById.push(standardizeCellId(state.tapeHead));
	state[standardizeCellId(state.tapeHead--)] = createCell(state.tapeHead + 2, null, val);
}

const expandBeforeHeadHelper = (state, n = 1) => {
	while (n--)
		insertBeforeHeadHelper(state);
}

const writeHelper = (state, val = null) => {
	var target = findCell(state, state.tapePointer);
	if (val == BLANK)
		val = "";
	return createCell(target.prev, target.next, val);
}

const moveLeftHelper = (state) => {
	var prev = findCell(state, state.tapePointer - 1);
	if (prev == null)
		insertBeforeHeadHelper(state);
	state.tapePointer--;
}

const moveRightHelper = (state) => {
	var next = findCell(state, state.tapePointer + 1);
	if (next == null)
		appendAfterTailHelper(state);
	state.tapePointer++;
}

const writeAndMoveHelper = (state, direction, val) => {
	findCell(state, state.tapePointer).val = val;
	if (direction == LEFT) {
		moveLeftHelper(state);
	} else if (direction == RIGHT) {
		moveRightHelper(state);
	}
}

/* Helper functions */