import { BLANK, STAR } from '../constants/SpecialCharacters';
import { HEAD_MOVE_INTERVAL, HEAD_LEFT_BOUNDARY } from '../constants/components/Head';
import { adjustHeadWidthHelper } from './gui';


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

export function isTapeEmpty(state) {
	return state.tapeHead === state.tapeTail;
}

export function findCell(state, id) {
	var cell = state[standardizeCellId(id)];
	if (cell !== undefined)
		return cell;
	return null;
}

// read from the cell to which the Head points
export function read(state) {
	var cur = findCell(state, state.tapePointer);

	// if that cell is not created, return undefined
	// (for sandbox)
	if (cur === null)
		return undefined;

	// treat null and "" as #
	return (cur.val === null || cur.val === "") ? BLANK : cur.val.toString();
}


export function standardizeInputToTape(val, oldVal) {
	if (val === undefined)
		return val;

	val = val.toString().trim().slice(0, 1);
	if (val === BLANK)
		return "";
	if (val === STAR)
		return oldVal;

	return val;
}	

export function standardizeReadFromTape(val) {
	if (val === "" || val === null)
		return BLANK;
	return val;
}

export function cloneCellById(state, id) {
	let tar = findCell(state, id);
	if (tar === null) return null;
	return createCell(tar.cur, tar.prev, tar.next, tar.val);
}

export function cloneCell(tar) {
	return createCell(tar.cur, tar.prev, tar.next, tar.val);
}

/*
Make a deep copy of the current tape and head
*/
export function extractTape(state) {
	let tape = {
		anchorCell: state.anchorCell,
		tapeHead: state.tapeHead,
		tapeTail: state.tapeTail,
		tapeCellsById: state.tapeCellsById.slice(),

		tapeInternalState: state.tapeInternalState,
		tapePointer: state.tapePointer,

		headX: state.headX,
		headWidth: state.headWidth,
		headLeftOffset: state.headLeftOffset,

		highlightedCellOrder: -1 // cancel any highlight
	};

	for (let i = 0; i < tape.tapeCellsById.length; i++) {
		let id = tape.tapeCellsById[i];
		tape[id] = cloneCell(state[id]);
	}

	return tape;
}

/*
Load back the copyed tape and head.
What attributes the parameter "tape" needs to have, please see the following
*/
export function loadTape(state, tape) {
	let new_state = initializeTape(state, {});
	new_state.anchorCell = tape.anchorCell;
	new_state.tapeHead = tape.tapeHead;
	new_state.tapeTail = tape.tapeTail;
	new_state.tapeCellsById = tape.tapeCellsById.slice();

	new_state.tapeInternalState = tape.tapeInternalState;
	new_state.tapePointer = tape.tapePointer;

	new_state.headX = tape.headX;
	new_state.headWidth = tape.headWidth;
	new_state.headLeftOffset = tape.headLeftOffset;

	new_state.highlightedCellOrder = -1; // cancel any highlight

	for (let i = 0; i < tape.tapeCellsById.length; i++) {
		let id = tape.tapeCellsById[i];
		new_state[id] = cloneCell(tape[id]);
	}

	return new_state;
}

export function lstrip(arr) {
	let lmark = 0;
	while (lmark < arr.length) {
		let val = standardizeReadFromTape(arr[lmark]);
		if (val !== BLANK)
			break;
		lmark++;
	}
	return arr.slice(lmark, arr.length);
}

export function rstrip(arr) {
	let rmark = arr.length - 1;
	while (rmark >= 0) {
		let val = standardizeReadFromTape(arr[rmark]);
		if (val !== BLANK)
			break;
		rmark--;
	}
	return arr.slice(0, rmark+1);
}

export function strip(arr) {
	return lstrip(rstrip(arr));
}

export function tapeToArray(tape) {
	let res = []
	if (isTapeEmpty(tape))
		return res;

	// run throught the linked list
	let dummy = standardizeCellId(tape.tapeHead+1);
	let current = tape[dummy];
	while (current) {
		let val = current.val;
		if (val === "" || val === null)
			val = BLANK;

		res.push(val);
		current = tape[current.next];
	}

	return res;
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
export function appendAfterTailHelper(state, val = null) {
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
export function insertBeforeHeadHelper(state, val = null) {
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

export function writeIntoTapeHelper(state, pointer, val) {
	let target = findCell(state, pointer);
	let value = standardizeInputToTape(val, target.val);
	state[standardizeCellId(pointer)] = createCell(target.cur, target.prev, target.next, value);
	return state;
}

/*
action parameter:

val: string, the value 
*/

export function writeIntoTape(state, action) {
	let new_state = Object.assign({}, state);

	return writeIntoTapeHelper(new_state, new_state.tapePointer, action.val);
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
export function moveTapeRightHelper(state, action) {
	state.anchorCell++;
	state.tapePointer++;

	// see if we need to append a new cell
	let position = state.cellNum + state.anchorCell - 1;
	if (position >= state.tapeTail) {
		appendAfterTailHelper(state);
	}

	return state;
}


export function moveTapeRight(state, action) {
	let new_state = Object.assign({}, state);

	return moveTapeRightHelper(new_state, action);
}

/*
action parameter:

None

*/
export function moveTapeLeftHelper(state, action) {
	state.anchorCell--;
	state.tapePointer--;

	// see if we need to insert a new cell
	let position = state.anchorCell;
	if (position <= state.tapeHead) {
		insertBeforeHeadHelper(state);
	}

	return state;
}

export function moveTapeLeft(state, action) {
	let new_state = Object.assign({}, state);

	return moveTapeLeftHelper(new_state, action);
}

export function moveLeftHelper(state) {
	state.tapePointer--;
	if (state.tapePointer < state.anchorCell) {
		state.anchorCell--;

		// because tapeHead is sentinel, it implies
		// when anchorCell == tapeHead, the head is pointing to 
		// an undefined cell, so we need to insert a cell
		if (state.anchorCell === state.tapeHead)
			insertBeforeHeadHelper(state, null)
	}

	// specially defined for running trials (for memory efficiency)
	if (read(state) === undefined) {
		insertBeforeHeadHelper(state, null)
	}

	state.highlightedCellOrder = state.tapePointer - state.anchorCell;
	return state;
}


/*
action parameter:

None

*/
export function moveLeft(state, action) {
	let new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});

	return moveLeftHelper(new_state);
}


export function moveRightHelper(state) {
	state.tapePointer++;

	if (state.tapePointer > state.anchorCell + state.cellNum - 1) {
		state.anchorCell++;
		// because tapeTail is sentinel, it implies
		// when anchorCell + cellNum - 1 == tapeTail, the head is pointing to 
		// an undefined cell, so we need to append a new cell
		if (state.anchorCell + state.cellNum - 1 === state.tapeTail) {
			appendAfterTailHelper(state, null)
		}
	}

	// specially defined for running trials (for memory efficiency)
	if (read(state) === undefined) {
		appendAfterTailHelper(state, null)
	}

	state.highlightedCellOrder = state.tapePointer - state.anchorCell;

	return state;
}

/*
action parameter:

None

*/
export function moveRight(state, action) {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	return moveRightHelper(new_state);
}

export function highlightCorrespondingCellHelper(state, flag) {
	state.highlightedCellOrder = (flag) ? state.tapePointer - state.anchorCell : -1;
	return state
}

/*
action parameter:

flag: bool, indicates whether we want to cell that pointed by head currently to
			be highlighted
*/
export function highlightCorrespondingCell(state, action) {
	let new_state = Object.assign({}, state);

	return highlightCorrespondingCellHelper(new_state, action.flag);
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

export function setInternalStateHelper(state, text) {
	state.tapeInternalState = text;
	return adjustHeadWidthHelper(state, text);
}

/*
action parameter:

state: string, new state
*/
export function setInternalState(state, action) {
	let new_state = Object.assign({}, state);
	return setInternalStateHelper(new_state, action.state);
}


/**** Reducer functions ****/