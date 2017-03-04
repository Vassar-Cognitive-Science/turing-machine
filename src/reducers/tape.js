import { LEFT, BLANK } from '../constants/ReservedWords';
import { initialState } from './index';

/**** Constants ****/

/*
const initialStateForTape = {
	tapeHead: 0, // Tape head, see linked list structure 
	tapeTail: 0, // Tape tail, see linked list structure
	tapePointer: 0, // Tells where is the Tape Head in Tape
	tapeCellsById: [], // array of virtual cells' ids
	tapeInternalState: "0", // Tape Head state

	
	A cell is an plain object, similar to linked list Node structure
	{ 
		val: val, // value
		prev: prev, // id to prev cell 
		next: next, // id to next cell
		highlight: flag, // boolean indicates whether the cell is highlighted
	}
	
}
*/

const CELL_ID_PREFIX = "TAPE-CELL ";
/**** Constants ****/

/**** Exported Helper functions ****/

export const standardizeCellId = (id) => {
	if (id == null) return null;
	if ((id.toString()).startsWith(CELL_ID_PREFIX)) return id;
	return CELL_ID_PREFIX + id;
}

export function tapeSize(state) {
	return state.tapeCellsById.length;
}

export function isTapeEmpty(state) {
	return tapeSize(state) === 0;
}

export function findCell(state, id) {
	var cell = state[standardizeCellId(id)];
	if (cell !== undefined)
		return cell;
	return null;
}


export function read(state) {
	var cur = findCell(state, state.tapePointer);
	if (cur == null)
		return null;
	return cur.val;
}

/**** Exported Helper functions ****/


/**** Helper functions ****/

function createCell(cur, prev = null, next = null, val = null, highlight=false) {
	return {
		cur: cur,
		val: val,
		prev: standardizeCellId(prev),
		next: standardizeCellId(next),
		highlight: highlight
	};
}

function appendAfterTailHelper(state, val = null) {
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

function insertBeforeHeadHelper(state, val = null) {
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

function expandBeforeHeadHelper(state, n = 1) {
	while (n--)
		insertBeforeHeadHelper(state);
}

/**** Helper functions ****/


/**** Reducer functions ****/

export function setAnchorCell(state, action) {
	return Object.assign({}, state, {
		anchorCell: (action.direction === LEFT) ? state.anchorCell - 1 : state.anchorCell + 1,
		tapePointer: (action.direction === LEFT) ? state.tapePointer + 1 : state.tapePointer - 1
	})
}

export function appendAfterTail(state, action) {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	appendAfterTailHelper(new_state, action.val);
	return new_state;
}

export function insertBeforeHead(state, action) {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	insertBeforeHeadHelper(new_state, action.val);
	return new_state;
}

export function expandAfterTailHelper(state, n = 1) {
	while (n--) {
		appendAfterTailHelper(state);
	}
}

export function expandAfterTail(state, action) {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	expandAfterTailHelper(new_state, action.n);
	return new_state;
}

export function expandBeforeHead(state, action) {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	expandBeforeHeadHelper(new_state);
	return new_state;
}

export function initializeTape(state, action) {
	var new_state = Object.assign({}, state, {
		tapeHead: 0,
		tapeTail: 0,
		tapeCellsById: [],

		tapePointer: Math.floor(action.tapeSize / 2),
		headWidth: initialState.headWidth, 
		headHeight: initialState.headHeight, 
		headLeftOffset: initialState.headLeftOffset, 
		headX: initialState.headX, 
		
	});
	for (let i = 0; i < state.tapeCellsById.length; i++) {
		delete new_state[state.tapeCellsById[i]];
	}
	expandAfterTailHelper(new_state, action.tapeSize);
	return new_state;
}

export function writeIntoTape(state, action) {
	let new_state = Object.assign({}, state);
	let target = findCell(new_state, new_state.tapePointer);
	let val = action.val;
	if (val === BLANK)
		val = "";
	new_state[standardizeCellId(state.tapePointer)] = createCell(target.cur, target.prev, target.next, val);

	return new_state;
}

export function fillTape(state, action) {
	let new_state = Object.assign({}, state);
	let position = action.position + state.anchorCell;
	let target = findCell(state, position);
	let val = action.val;
	if (val === BLANK)
		val = "";

	new_state[standardizeCellId(position)] = createCell(target.cur, target.prev, target.next, val);
	return new_state;
}

export function moveTapeRight(state, action) {
	let new_state = Object.assign({}, state, {
		anchorCell: state.anchorCell + 1,
		tapePointer: state.tapePointer + 1
	})
	let position = action.position + new_state.anchorCell;
	if (position + 1 >= state.tapeTail) {
		appendAfterTailHelper(new_state, null);
	}

	return setCorrespondingCellHighlight(new_state, {flag: false});
}

export function moveTapeLeft(state, action) {
	let new_state = Object.assign({}, state, {
		anchorCell: state.anchorCell - 1,
		tapePointer: state.tapePointer - 1
	})
	let position = action.position + new_state.anchorCell;
	if (position -1 <= state.tapeHead) {
		insertBeforeHeadHelper(new_state, null);
	}

	return setCorrespondingCellHighlight(new_state, {flag: false});
}

export function moveLeft(state, action) {
	let new_state = Object.assign({}, state, {
		tapePointer: state.tapePointer - 1
	});
	if (new_state.tapePointer < new_state.anchorCell) {
		new_state.anchorCell--;
		if (new_state.anchorCell - 1 <= state.tapeHead)
			insertBeforeHeadHelper(new_state, null)
	}

	let target = findCell(new_state, new_state.tapePointer) // current
	new_state[standardizeCellId(new_state.tapePointer)] = createCell(target.cur, target.prev, target.next, target.val, true);
	target = findCell(new_state, new_state.tapePointer+1) // last
	new_state[standardizeCellId(new_state.tapePointer+1)] = createCell(target.cur, target.prev, target.next, target.val, false);
	
	return new_state;
}

export function moveRight(state, action) {
	var new_state = Object.assign({}, state, {
		tapePointer: state.tapePointer + 1
	});

	if (new_state.tapePointer > new_state.anchorCell + new_state.cellNum - 1) {
		new_state.anchorCell++;
		if (new_state.anchorCell + new_state.cellNum >= state.tapeTail) {
			appendAfterTailHelper(new_state, null)
		}
	} 

	let target = findCell(new_state, new_state.tapePointer) // current
	new_state[standardizeCellId(new_state.tapePointer)] = createCell(target.cur, target.prev, target.next, target.val, true);
	target = findCell(new_state, new_state.tapePointer-1) // last
	new_state[standardizeCellId(new_state.tapePointer-1)] = createCell(target.cur, target.prev, target.next, target.val, false);

	return new_state;
}

export function setCorrespondingCellHighlight(state, action) {
	var new_state = Object.assign({}, state);

	let target = findCell(new_state, new_state.tapePointer) // current
	new_state[standardizeCellId(new_state.tapePointer)] = createCell(target.cur, target.prev, target.next, target.val, action.flag);
	
	return new_state;
}

export function setInternalState(state, action) {
	return Object.assign({}, state, {
		tapeInternalState: action.state
	});
}

/**** Reducer functions ****/

