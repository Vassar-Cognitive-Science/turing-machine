import { LEFT, BLANK, STAR } from '../constants/index';
import { HEAD_MOVE_INTERVAL, HEAD_LEFT_BOUNDARY } from '../constants/GUISettings';
import { adjustHeadWidth } from './gui';

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

export const CELL_ID_PREFIX = "TAPE-CELL ";
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
	if (cur === null)
		return undefined;
	// if (typeof cur.val === 'string')
	// 	cur.val = cur.val.trim()
	return (cur.val === null || cur.val === "") ? BLANK : cur.val.toString();
}

export function cloneCellById(state, id) {
	let tar = findCell(state, id);
	if (tar === null) return null;
	return createCell(tar.cur, tar.prev, tar.next, tar.val);
}

export function cloneCell(tar) {
	return createCell(tar.cur, tar.prev, tar.next, tar.val);
}


/**** Exported Helper functions ****/


/**** Helper functions ****/

function createCell(cur, prev = null, next = null, val = null) {
	return {
		cur: cur,
		val: val,
		prev: standardizeCellId(prev),
		next: standardizeCellId(next)
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
	expandBeforeHeadHelper(new_state, action.n);
	return new_state;
}

export function initializeTape(state, action) {
	var new_state = Object.assign({}, state, {
		stepCount: 0,
		anchorCell: 0,
		tapeHead: 0,
		tapeTail: 0,
		tapeCellsById: [],

		tapePointer: (action.controlled) ? state.tapePointer : Math.floor(state.cellNum / 2),
		headX: (action.controlled) ? state.headX : HEAD_LEFT_BOUNDARY + HEAD_MOVE_INTERVAL * Math.floor(state.cellNum / 2),
	});
	for (let i = 0; i < state.tapeCellsById.length; i++) {
		delete new_state[state.tapeCellsById[i]];
	}
	expandAfterTailHelper(new_state, state.cellNum);
	return new_state;
}

export function writeIntoTape(state, action) {
	let new_state = Object.assign({}, state);
	let target = findCell(new_state, new_state.tapePointer);
	let val = action.val;
	if (val === BLANK)
		val = ""; // "#"?
	if (val === STAR)
		val = target.val;
	
	new_state[standardizeCellId(state.tapePointer)] = createCell(target.cur, target.prev, target.next, val);

	return new_state;
}

export function fillTape(state, action) {
	let new_state = Object.assign({}, state);
	let val = action.val;

	let target;
	if (action.id) {
		target = state[action.id];
		new_state[action.id] = createCell(target.cur, target.prev, target.next, val);
	} else {
		let position = action.position + state.anchorCell;
		target = findCell(state, position);
		new_state[standardizeCellId(position)] = createCell(target.cur, target.prev, target.next, val);
	}

	return new_state;
}

export function moveTapeRight(state, action) {
	let new_state = Object.assign({}, state, {
		anchorCell: state.anchorCell + 1,
		tapePointer: state.tapePointer + 1
	})
	let position = state.cellNum + new_state.anchorCell;
	if (position + 1 >= state.tapeTail) {
		appendAfterTailHelper(new_state, null);
	}
	// document.getElementById(standardizeCellId(state.cellNum - 1)).focus()
	// return highlightCellAt(new_state, { order: new_state.cellNum - 1 });
	return new_state;
}

export function moveTapeLeft(state, action) {
	let new_state = Object.assign({}, state, {
		anchorCell: state.anchorCell - 1,
		tapePointer: state.tapePointer - 1
	})
	let position = action.position + new_state.anchorCell;
	if (position - 1 <= state.tapeHead) {
		insertBeforeHeadHelper(new_state, null);
	}
	// document.getElementById(standardizeCellId(0)).focus()
	// return highlightCellAt(new_state, { order: 0 });
	return new_state;
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

	if (read(new_state) === undefined) {
		insertBeforeHeadHelper(new_state, null)
	}

	return highlightCorrespondingCell(new_state, {
		target: new_state.tapePointer,
		flag: true
	});
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

	if (read(new_state) === undefined) {
		appendAfterTailHelper(new_state, null)
	}

	return highlightCorrespondingCell(new_state, {
		target: new_state.tapePointer,
		flag: true
	});
}

export function highlightCorrespondingCell(state, action) {
	var new_state = Object.assign({}, state, {
		highlightedCellOrder: (action.flag) ? state.tapePointer - state.anchorCell : -1
	});

	return new_state;
}

export function highlightCellAt(state, action) {
	return Object.assign({}, state, {
		highlightedCellOrder: action.order
	});
}

export function setInternalState(state, action) {
	return adjustHeadWidth(Object.assign({}, state, {
		tapeInternalState: action.state
	}), action.state);
}


/**** Reducer functions ****/