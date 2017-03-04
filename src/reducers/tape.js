import { LEFT, BLANK } from '../constants/ReservedWords';


/*
A cell is an plain object, similar to linked list Node structure
{ 
	val: val, // value
	prev: prev, // id to prev cell 
	next: next, // id to next cell
	highlight: flag, // boolean indicates whether the cell is highlighted
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

const createCell = (cur, prev = null, next = null, val = null, highlight=false) => {
	return {
		cur: cur,
		val: val,
		prev: standardizeCellId(prev),
		next: standardizeCellId(next),
		highlight: highlight
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


/* Helper functions */


/* Reducer functions */

export const setAnchorCell = (state, action) => {
	return Object.assign({}, state, {
		anchorCell: (action.direction === LEFT) ? state.anchorCell - 1 : state.anchorCell + 1,
		tapePointer: (action.direction === LEFT) ? state.tapePointer + 1 : state.tapePointer - 1
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
		tapeInternalState: "0"
	});
	for (let i = 0; i < state.tapeCellsById.length; i++) {
		delete new_state[state.tapeCellsById[i]];
	}
	expandAfterTailHelper(new_state, action.tapeSize);
	return new_state;
}

export const writeIntoTape = (state, action) => {
	let new_state = Object.assign({}, state);
	let target = findCell(new_state, new_state.tapePointer);
	let val = action.val;
	if (val === BLANK)
		val = "";
	new_state[standardizeCellId(state.tapePointer)] = createCell(target.cur, target.prev, target.next, val);

	return new_state;
}

export const fillTape = (state, action) => {
	let new_state = Object.assign({}, state);
	let position = action.position + state.anchorCell;
	let target = findCell(state, position);
	let val = action.val;
	if (val === BLANK)
		val = "";

	new_state[standardizeCellId(position)] = createCell(target.cur, target.prev, target.next, val);
	return new_state;
}

export const moveTapeRight = (state, action) => {
	let new_state = Object.assign({}, state, {
		anchorCell: state.anchorCell + 1,
		tapePointer: state.tapePointer + 1
	})
	let position = action.position + new_state.anchorCell;
	if (position + 1 >= state.tapeTail) {
		appendAfterTailHelper(new_state, null);
	}

	return new_state;
}

export const moveTapeLeft = (state, action) => {
	let new_state = Object.assign({}, state, {
		anchorCell: state.anchorCell - 1,
		tapePointer: state.tapePointer - 1
	})
	let position = action.position + new_state.anchorCell;
	if (position -1 <= state.tapeHead) {
		insertBeforeHeadHelper(new_state, null);
	}

	return new_state;
}

export const moveLeft = (state, action) => {
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

export const moveRight = (state, action) => {
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

export const setCorrespondingCellHighlight = (state, action) => {
	var new_state = Object.assign({}, state);

	let target = findCell(new_state, new_state.tapePointer) // current
	new_state[standardizeCellId(new_state.tapePointer)] = createCell(target.cur, target.prev, target.next, target.val, action.flag);
	
	return new_state;
}

export const switchHeadMode = (state, action) => {
	return Object.assign({}, state, {
		tapeHeadEditable: action.tapeHeadEditable
	})
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


