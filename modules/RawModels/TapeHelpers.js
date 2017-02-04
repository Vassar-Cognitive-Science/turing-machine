LEFT = "L";
RIGHT = "R";
HALT = "H";
BLANK = "#";

function createCell(id, prev = null, next = null, val = null) {
	return {
		id: id,
		val: val,
		prev: prev,
		next: next
	};
}

function createTape(size = 0, internalState = null) {
	var cells = [];
	var tape = {
		cells: cells,
		internalState: internalState,
		pointer: 0,
		head: 0,
		tail: 0,
		size: 0
	};
	expandAfterTail(tape, size);
	return tape;
}

function isTapeEmpty(tape) {
	return tape.size == 0;
}

function appendAfterTail(tape, val = null) {
	if (isTapeEmpty(tape)) {
		tape.head--;
	}
	var prev = findCell(tape, tape.tail - 1);
	if (prev != null)
		prev.next = tape.tail
	tape.cells.push(createCell(tape.tail++, tape.tail - 2, null, val));
	tape.size++;
}

function insertBeforeHead(tape, val = null) {
	if (isTapeEmpty(tape)) {
		tape.tail++;
	}
	var next = findCell(tape, tape.head + 1);
	if (next != null)
		next.prev = tape.head;
	tape.cells.push(createCell(tape.head--, null, tape.head + 2, val));
	tape.size++;
}

function expandAfterTail(tape, n = 1) {
	while (n--)
		appendAfterTail(tape);
}

function expandBeforeTail(tape, n = 1) {
	while (n--)
		insertBeforeHead(tape);
}

function findCell(tape, id) {
	for (var i = 0; i < tape.cells.length; i++) {
		var cell = tape.cells[i];
		if (cell.id == id)
			return cell;
	}
	return null;
}

function write(tape, val = null) {
	var target = findCell(tape, tape.pointer);
	if (target == null)
		return false;
	if (val == BLANK)
		val = "";
	target.val = val;
	return true;
}

function moveLeft(tape) {
	var prev = findCell(tape, tape.pointer);
	if (prev == null)
		insertBeforeHead(tape);
	tape.pointer--;
}

function moveRight(tape) {
	var next = findCell(tape, tape.pointer);
	if (next == null)
		appendAfterTail(tape);
	tape.pointer++;
}

function writeAndMove(tape, direction, val) {
	write(tape, val);
	if (direction == LEFT) {
		moveLeft(tape);
	} else if (direction == RIGHT) {
		moveRight(tape);
	}
}

function read(tape) {
	var cur = findCell(tape, tape.pointer);
	if (cur == null)
		return null;
	return cur.val;
}