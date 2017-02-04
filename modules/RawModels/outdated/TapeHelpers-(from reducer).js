export const LEFT = "L";
export const RIGHT = "R";
export const BLANK = "#";

/*
Function List:

tape = {
	cellsById: {},
	internalState: null,
	pointer: 0,
	head: 0,
	tail: 0,
	size: 0
}

createTape(size, internalState)
isTapeEmpty(tape)
appendAfterTail(tape, val)
insertBeforeHead(tape, val)
expandAfterTail(tape, n)
expandBeforeTail(tape, n)
findCell(tape, id)
writeAndMove(tape, direction, val)
write(tape, val)
moveLeft(tape)
moveRight(tape)
read(tape) 
cloneTape(tape)
*/

initialState = {
	tape: createTape(20)
}

export const createCell = (prev = null, next = null, val = null) => {
	return {
		val: val,
		prev: prev,
		next: next
	};
}

export const createTape = (size = 0, internalState = null) => {
	var cells = {};
	var tape = {
		cellsById: cells,
		internalState: internalState,
		pointer: 0,
		head: 0,
		tail: 0,
		size: 0
	};
	expandAfterTail(tape, size);
	return tape;
}

export const isTapeEmpty = (tape) => {
	return tape.size == 0;
}

export const appendAfterTail = (tape, val = null) => {
	if (isTapeEmpty(tape)) {
		tape.head--;
	}
	var prev = findCell(tape, tape.tail - 1);
	if (prev != null)
		prev.next = tape.tail
	tape.cellsById[tape.tail++] = createCell(tape.tail - 2, null, val);
	tape.size++;
}

export const insertBeforeHead = (tape, val = null) => {
	if (isTapeEmpty(tape)) {
		tape.tail++;
	}
	var next = findCell(tape, tape.head + 1);
	if (next != null)
		next.prev = tape.head;
	tape.cellsById[tape.head--] = createCell(null, tape.head + 2, val);
	tape.size++;
}

export const expandAfterTail = (tape, n = 1) => {
	while (n--)
		appendAfterTail(tape);
}

export const expandBeforeTail = (tape, n = 1) => {
	while (n--)
		insertBeforeHead(tape);
}

export const findCell = (tape, id) => {
	var cell = tape.cellsById[id];
	if (cell != undefined)
		return cell;
	return null;
}

export const write = (tape, val = null) => {
	var target = findCell(tape, tape.pointer);
	if (target == null)
		return false;
	if (val == BLANK)
		val = "";
	target.val = val;
	return true;
}

export const moveLeft = (tape) => {
	var prev = findCell(tape, tape.pointer);
	if (prev == null)
		insertBeforeHead(tape);
	tape.pointer--;
}

export const moveRight = (tape) => {
	var next = findCell(tape, tape.pointer);
	if (next == null)
		appendAfterTail(tape);
	tape.pointer++;
}

export const writeAndMove = (tape, direction, val) => {
	write(tape, val);
	if (direction == LEFT) {
		moveLeft(tape);
	} else if (direction == RIGHT) {
		moveRight(tape);
	}
}

export const read = (tape) => {
	var cur = findCell(tape, tape.pointer);
	if (cur == null)
		return null;
	return cur.val;
}

export const cloneTape = (tape) => {
	return Object.assign({}, tape);
}
