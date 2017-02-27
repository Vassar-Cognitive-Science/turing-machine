var LEFT = "L";
var RIGHT = "R";
var BLANK = "#";

const createCell = (prev = null, next = null, val = null) => {
	return {
		val: val,
		prev: prev,
		next: next
	};
}

const createTape = (size = 0, internalState = null) => {
	var cells = {};
	var tape = {
		cellsById: cells,
		internalState: internalState,
		pointer: 0,
		head: 0,
		tail: 0
	};
	expandAfterTail(tape, size);
	return tape;
}

const isTapeEmpty = (tape) => {
	return tapeSize(tape) == 0;
}

const appendAfterTail = (tape, val = null) => {
	if (isTapeEmpty(tape)) {
		tape.head--;
	}
	var prev = findCell(tape, tape.tail - 1);
	if (prev != null)
		prev.next = tape.tail
	tape.cellsById[tape.tail++] = createCell(tape.tail - 2, null, val);
}

const insertBeforeHead = (tape, val = null) => {
	if (isTapeEmpty(tape)) {
		tape.tail++;
	}
	var next = findCell(tape, tape.head + 1);
	if (next != null)
		next.prev = tape.head;
	tape.cellsById[tape.head--] = createCell(null, tape.head + 2, val);
}

const expandAfterTail = (tape, n = 1) => {
	while (n--)
		appendAfterTail(tape);
}

const expandBeforeHead = (tape, n = 1) => {
	while (n--)
		insertBeforeHead(tape);
}

const findCell = (tape, id) => {
	var cell = tape.cellsById[id];
	if (cell != undefined)
		return cell;
	return null;
}

const write = (tape, val = null) => {
	var target = findCell(tape, tape.pointer);
	if (target == null)
		return false;
	if (val == BLANK)
		val = "";
	target.val = val;
	return true;
}

const moveLeft = (tape) => {
	var prev = findCell(tape, tape.pointer-1);
	if (prev == null)
		insertBeforeHead(tape);
	tape.pointer--;
}

const moveRight = (tape) => {
	var next = findCell(tape, tape.pointer+1);
	if (next == null)
		appendAfterTail(tape);
	tape.pointer++;
}

const writeAndMove = (tape, direction, val) => {
	write(tape, val);
	if (direction == LEFT) {
		moveLeft(tape);
	} else if (direction == RIGHT) {
		moveRight(tape);
	}
}

const read = (tape) => {
	var cur = findCell(tape, tape.pointer);
	if (cur == null)
		return null;
	return cur.val;
}

const allIds = (tape) => {
	return Object.keys(tape.cellsById);
}

const tapeSize = (tape) => {
	return allIds(tape).length;
}

const cloneCellsById = (tape) => {
	var source = tape.cellsById;
	var cloned = {};
	var keys = Object.keys(source);
	for (var i = 0; i < keys.length; i++) {
		cloned[keys[i]] = {};
		cloned[keys[i]].val = source[keys[i]].val;
		cloned[keys[i]].prev = source[keys[i]].prev;
		cloned[keys[i]].next = source[keys[i]].next;
	}
	return cloned; 
}


a = createTape(20)
o = Object.assign({}, a, {cellsById: cloneCellsById(a)});
write(a, 1)
console.log(o)