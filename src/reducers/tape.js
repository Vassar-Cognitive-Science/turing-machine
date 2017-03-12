import { BLANK, STAR } from '../constants/index';
import { HEAD_MOVE_INTERVAL, HEAD_LEFT_BOUNDARY } from '../constants/GUISettings';
import { adjustHeadWidth } from './gui';

/**** Constants ****/

/*
const initialStateForTape = {
	anchorCell: 0, // information for mapping virtual tape cells to presentational cell

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


/*
The tape uses a doubly linked list strcuture

The following functions serve to implement it so
that we can insert new values before the head of the tape or
after the tail of the tape.

*** NOTE ***
tapeHead and tapeTail serve as sentinel, and there is never a corresponding cell
with id = tapeTail or tapeHead in the state

For a tape of length 0, tapeHead = tapeTail = 0
For a tape of length 1, tapeHead = -1, tapeTail = 1, the only cell is with id 0
For a tape of length k > 1, tapeHead and tapeTail depend on to which direction we expand
*/

/*
Create a cell, that holds its:
current id
previous cell id,
next cell id,
value
*/
function createCell(cur, prev = null, next = null, val = null) {
	return {
		cur: cur,
		val: val,
		prev: standardizeCellId(prev),
		next: standardizeCellId(next)
	};
}


/*
Claim: P(n) == this function appends a cell after tail for a tape of length n, for all n >= 0
Proof:
	Base: the tape length is 0 and we expand it by 1.
		  We want (a) a tape cell (0,  -1,   null,    val), and (b) tapeHead = -1, tapeTail = 1
							   cur prev  next  value

		  The function satisfies above by following operations
		  
		  // 0. decrease tapeHead by 1 = -1, as a senitinel for later calling of insertBeforeHead // (gives (b))

		  1. Find previous cell, in this case it will sure be null
		  2. Take the current tapeTail value to create the cell, which
		     makes the new tail
		     Since initial tapeTail = 0, we have cell (0, 0-1=-1, null,  val) // (gives (a))

		  // 3. Finally, increase the tapeTail by 1, as a sentinel // (gives (b))

	I.H.: Assume P(k), for all k >= 1, i.e., tapeTail >= 1
		  Show P(k+1)

		  For the result of appending a cell after tail of a tape of length k to get to length of k+1,
		  we will want the cell x to satisfy the following:
		  	1. It is the new tail, and so x.next = null
		  	2. It is the next of previous tail, say, oldTail, so  
		  		x.prev = oldTail and oldTail.next = x
		  
		  The function does the following to satisfy above:

		  	a. To satisfy (1) and (2), we first try to find a previous cell,
		  	   In this case, because we assume k > 0, so there is a previous cell.
		  	   We set its next to be state.tapeTail.
		  	   Then we create a cell with current id = state.tapeTail
		  	   							  prev = state.tapeTail - 1
										  next = null
										  val = val
			b. increase the tapeTail by 1, as a sentinel
*/
function appendAfterTailHelper(state, val = null) {
	// it is to satisfy tapeHead = -1
	// after the first addition of cell
	if (isTapeEmpty(state)) {
		state.tapeHead--;
	}

	// find the oldTail
	let prev = findCell(state, state.tapeTail - 1);
	if (prev !== null)
		prev.next = standardizeCellId(state.tapeTail); // oldTail.next = new tail

	// create new tail
	let new_cell_id = standardizeCellId(state.tapeTail);
	state.tapeCellsById.push(new_cell_id);
	// new tail.prev = oldTail, new tail.next = null
	state[new_cell_id] = createCell(new_cell_id, state.tapeTail - 1, null, val);

	// increase sentinel tapeTail by 1
	state.tapeTail++;
}


/*
Correctness proof similar to the above
*/
function insertBeforeHeadHelper(state, val = null) {
	// satisfy tapeTail = 1, for the first cell inserted
	if (isTapeEmpty(state)) {
		state.tapeTail++;
	}

	// find oldHead
	let next = findCell(state, state.tapeHead + 1);
	if (next !== null)
		next.prev = standardizeCellId(state.tapeHead); // oldHead.prev = new Head

	// create new Head
	let new_cell_id = standardizeCellId(state.tapeHead);

	// populate tapeCellsById, insert he new cell into the beginning of array
	state.tapeCellsById.unshift(new_cell_id);

	// new head.prev = null, new head.next = oldHead
	state[new_cell_id] = createCell(new_cell_id, null, state.tapeHead + 1, val);

	// decrease sentinel tapeHead id by 1
	state.tapeHead--;
}

function expandBeforeHeadHelper(state, n = 1) {
	while (n--)
		insertBeforeHeadHelper(state);
}

/**** Helper functions ****/


/**** Reducer functions ****/

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

/*
action parameter:

controlled: bool, indicates whether we initialize tapePointer 
*/
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

/*
action parameter:

val: string, the value 
*/
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

/*
action parameter:

id: string (optional, but must be returned by standardizeTapeCellId), indicate which cell we want to fill 
val: any, the value 
position: number, indicates which presentational cell we are filling
*/
export function fillTape(state, action) {
	let new_state = Object.assign({}, state);
	let val = action.val;

	let target;
	// if there is an indicated cell, we fill it with value we want
	if (action.id) {
		target = state[action.id];
		new_state[action.id] = createCell(target.cur, target.prev, target.next, val);
	} else {
		// if there is not, we calculate the actual id
		let position = action.position + state.anchorCell;
		target = findCell(state, position);
		new_state[standardizeCellId(position)] = createCell(target.cur, target.prev, target.next, val);
	}

	return new_state;
}

/*
action parameter:
None

//
Called when right handside button of tape is pressed
*/
export function moveTapeRight(state, action) {
	let new_state = Object.assign({}, state, {
		anchorCell: state.anchorCell + 1,
		tapePointer: state.tapePointer + 1
	})

	// see if we need to append a new cell
	let position = new_state.cellNum + new_state.anchorCell - 1;
	if (position >= new_state.tapeTail) {
		appendAfterTailHelper(new_state, null);
	}

	// return highlightCellAt(new_state, { order: new_state.cellNum - 1 });
	return new_state;
}

/*
action parameter:

None

*/
export function moveTapeLeft(state, action) {
	let new_state = Object.assign({}, state, {
		anchorCell: state.anchorCell - 1,
		tapePointer: state.tapePointer - 1
	})

	// see if we need to insert a new cell
	let position = new_state.anchorCell;
	if (position <= new_state.tapeHead) {
		insertBeforeHeadHelper(new_state, null);
	}

	// return highlightCellAt(new_state, { order: 0 });
	return new_state;
}

/*
action parameter:

None

*/
export function moveLeft(state, action) {
	let new_state = Object.assign({}, state, {
		tapePointer: state.tapePointer - 1
	});

	if (new_state.tapePointer < new_state.anchorCell) {
		new_state.anchorCell--;

		// because tapeHead is sentinel, it implies
		// when anchorCell == tapeHead, the head is pointing to 
		// an undefined cell, so we need to insert a cell
		if (new_state.anchorCell === new_state.tapeHead)
			insertBeforeHeadHelper(new_state, null)
	}


	// specially defined for running trials (for memory efficiency)
	if (read(new_state) === undefined) {
		insertBeforeHeadHelper(new_state, null)
	}

	return highlightCorrespondingCell(new_state, {
		flag: true
	});
}

/*
action parameter:

None

*/
export function moveRight(state, action) {
	var new_state = Object.assign({}, state, {
		tapePointer: state.tapePointer + 1
	});

	// new_state.anchorCell + new_state.cellNum - 1 is the cell id of the rightmost
	// cell (of presentational tape)
	if (new_state.tapePointer > new_state.anchorCell + new_state.cellNum - 1) {
		new_state.anchorCell++;

		// because tapeTail is sentinel, it implies
		// when anchorCell + cellNum - 1 == tapeTail, the head is pointing to 
		// an undefined cell, so we need to append a new cell
		if (new_state.anchorCell + new_state.cellNum - 1 === new_state.tapeTail) {
			appendAfterTailHelper(new_state, null)
		}
	}


	// specially defined for running trials (for memory efficiency)
	if (read(new_state) === undefined) {
		appendAfterTailHelper(new_state, null)
	}

	return highlightCorrespondingCell(new_state, {
		flag: true
	});
}

/*
action parameter:

flag: bool, indicates whether we want to cell that pointed by head currently to
			be highlighted
*/
export function highlightCorrespondingCell(state, action) {
	var new_state = Object.assign({}, state, {
		highlightedCellOrder: (action.flag) ? state.tapePointer - state.anchorCell : -1
	});

	return new_state;
}

/*
action parameter:

order: number, indicates which presentational cell we want to highlight
  0 <= order < cellNum
*/
export function highlightCellAt(state, action) {
	return Object.assign({}, state, {
		highlightedCellOrder: action.order
	});
}

/*
action parameter:

state: string, new state
*/
export function setInternalState(state, action) {
	return adjustHeadWidth(Object.assign({}, state, {
		tapeInternalState: action.state
	}), action.state);
}


/**** Reducer functions ****/