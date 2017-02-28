import { LEFT, RIGHT, BLANK } from '../constants/ReservedWords';


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


/* Helper functions */

export const standardizeCellId = (id) => {
	if (id == null) return null;
	if ((id.toString()).startsWith(CELL_ID_PREFIX)) return id;
	return CELL_ID_PREFIX + id;
}


/**** Exported Helper functions ****/

export const tapeSize = (state) => {
	return state.tapeCellsById.length;
}

export const isTapeEmpty = (state) => {
	return tapeSize(state) === 0;
}

export const findCell = (state, id) => {
	var cell = state[standardizeCellId(id)];
	if (cell !== undefined)
		return cell;
	return null;
}

/**** Exported Helper functions ****/

const createCell = (cur, prev = null, next = null, val = null) => {
	return {
		cur: cur,
		val: val,
		prev: standardizeCellId(prev),
		next: standardizeCellId(next)
	};
}

const appendAfterTailHelper = (state, val = null) => {
	if (isTapeEmpty(state)) {
		state.tapeHead--;
	}
	var prev = findCell(state, state.tapeTail - 1);
	if (prev != null)
		prev.next = standardizeCellId(state.tapeTail);
	var new_cell_id = standardizeCellId(state.tapeTail);
	state.tapeCellsById.push(new_cell_id);
	state[new_cell_id] = createCell(new_cell_id, state.tapeTail - 1, null, val);
	state.tapeTail++;
}

const insertBeforeHeadHelper = (state, val = null) => {
	if (isTapeEmpty(state)) {
		state.tapeTail++;
	}
	var next = findCell(state, state.tapeHead + 1);
	if (next != null)
		next.prev = standardizeCellId(state.tapeHead);
	var new_cell_id = standardizeCellId(state.tapeHead);
	state.tapeCellsById.push(new_cell_id);
	state[new_cell_id] = createCell(new_cell_id, state.tapeHead + 1, null, val);
	state.tapeHead--;
}

const expandBeforeHeadHelper = (state, n = 1) => {
	while (n--)
		insertBeforeHeadHelper(state);
}

const writeHelper = (state, val = null) => {
	var target = findCell(state, state.tapePointer);
	if (val === BLANK)
		val = "";
	return createCell(target.cur, target.prev, target.next, val);
}

const fillHelper = (state, position, val = null) => {
	var target = findCell(state, position);
	if (val === BLANK)
		val = "";
	return createCell(target.cur, target.prev, target.next, val);
}

const moveLeftHelper = (state) => {
	state.tapePointer--;
}

const moveRightHelper = (state) => {
	state.tapePointer++;
}

const writeAndMoveHelper = (state, direction, val) => {
	findCell(state, state.tapePointer).val = val;
	if (direction === LEFT) {
		moveLeftHelper(state);
	} else if (direction === RIGHT) {
		moveRightHelper(state);
	}
}

/* Helper functions */


/* Reducer functions */

export const setAnchorCell = (state, action) => {
	return Object.assign({}, state, {
		anchorCell: (action.direction === LEFT) ? state.anchorCell - 1 : state.anchorCell + 1
	})
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

export const expandAfterTailHelper = (state, n = 1) => {
	while (n--) {
		appendAfterTailHelper(state);
	}
}

export const expandAfterTail = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	expandAfterTailHelper(new_state, action.n);
	return new_state;
}

export const expandBeforeHead = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	expandBeforeHeadHelper(new_state);
	return new_state;
}

export const initializeTape = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeHead: 0,
		tapeTail: 0,
		tapePointer: Math.floor(action.tapeSize / 2),
		tapeCellsById: [],
		tapeInternalState: null
	});
	for (let i = 0; i < state.tapeCellsById.length; i++) {
		delete new_state[state.tapeCellsById[i]];
	}
	expandAfterTailHelper(new_state, action.tapeSize);
	return new_state;
}

export const writeIntoTape = (state, action) => {
	var new_state = Object.assign({}, state);
	new_state[standardizeCellId(state.tapePointer)] = writeHelper(state, action.val);

	return new_state;
}

export const fillTape = (state, action) => {
	var new_state = Object.assign({}, state);
	var position = action.position + state.anchorCell;
	new_state[standardizeCellId(position)] = fillHelper(state, position, action.val);
	return new_state;
}

export const moveTapeRight = (state, action) => {
	var new_state;
	var position = action.position + state.anchorCell;
	if (position + 1 >= state.tapeTail) {
		new_state = appendAfterTail(state, {val: null});
	}
	else 
		new_state = Object.assign({}, state);

	return new_state;
}

export const moveTapeLeft = (state, action) => {
	var new_state;
	var position = action.position + state.anchorCell;
	if (position -1 <= state.tapeHead) {
		new_state = insertBeforeHead(state, {val: null});
	}
	else 
		new_state = Object.assign({}, state);
	
	return new_state
}

export const moveLeft = (state, action) => {
	return Object.assign({}, state, {
		tapePointer: state.tapePointer - 1
	});
}

export const moveRight = (state, action) => {
	return Object.assign({}, state, {
		tapePointer: state.tapePointer + 1
	});
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


