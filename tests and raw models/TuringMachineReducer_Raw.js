const LEFT = "L";
const RIGHT = "R";
const BLANK = "#";
const HALT = "H";

const CELL_ID_PREFIX = "CELL ";
const RULE_PREFIX = "RULE - ";
const DUPLICATED_RULE_ERROR = "ERROR";

const initialState = {
	/* Tape and Head */
	tapeHead: 0,
	tapeTail: 0,
	tapePointer: 0,
	tapeCellsById: [],
	tapeInternalState: null,
	/* Tape and Head */

	/* Rules */
	rulesById: []
		/* Rules */
};


/* Reducer functions */
const initializeTape = (state, action) => {
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

const appendAfterTail = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	appendAfterTailHelper(new_state, action.val);
	return new_state;
}

const insertBeforeHead = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	insertBeforeHeadHelper(new_state, action.val);
	return new_state;
}

const expandAfterTail = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	expandAfterTailHelper(new_state, action.n);
	return new_state;
}

const expandAfterTailHelper = (state, n = 1) => {
	while (n--) {
		appendAfterTailHelper(state);
	}
}

const expandBeforeHead = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	expandBeforeHeadHelper(new_state);
	return new_state;
}

const findCell = (state, id) => {
	var cell = state[standardizeCellId(id)];
	if (cell != undefined)
		return cell;
	return null;
}

const write = (state, action) => {
	new_state = Object.assign({}, state);
	new_state[standardizeCellId(state.tapePointer)] = writeHelper(state, action.val);
	return new_state;
}

const moveLeft = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	moveLeftHelper(new_state);
	return new_state;
}

const moveRight = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});
	moveRightHelper(new_state);
	return new_state;
}

const writeAndMove = (state, action) => {
	var new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice(),
		tapeInternalState: action.new_state
	});
	writeAndMoveHelper(new_state, action.direction, action.val);
	return new_state;
}

const read = (state) => {
	var cur = findCell(state, state.tapePointer);
	if (cur == null)
		return null;
	return cur.val;
}

const setInternalState = (state, action) => {
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

const tapeSize = (state) => {
	return state.tapeCellsById.length;
}

const isTapeEmpty = (state) => {
	return tapeSize(state) == 0;
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


/* Useful functions */

const standardizeRuleId = (stateId, readId) => {
	if (readId == null) return null;
	return RULE_PREFIX + stateId + "-" + readId;
}

const ruleExists = (state, id) => {
	return findRuleById(state, id) != null;
}

const findRuleById = (state, id) => {
	var rule = state[id];
	if (rule == undefined)
		return null;
	return rule;
}

const ruleSize = (state) => {
	return state.rulesById.length;
}

/* Useful functions */


/* Reducer functions */

const addRule = (state, action) => {
	var new_state = Object.assign({}, state, {
		rulesById: state.rulesById.slice()
	});
	addRuleHelper(new_state, action.in_state, action.read, action.write, action.direction, action.new_state);
	return new_state;
}

const setRule = (state, action) => {
	var new_state = Object.assign({}, state);
	setRuleHelper(new_state, action.in_state, action.read, action.write, action.direction, action.new_state);
	return new_state;
}

const deleteRule = (state, action) => {
	var new_state = Object.assign({}, state, {
		rulesById: state.rulesById.slice()
	});
	deleteRuleHelper(new_state, action.in_state, action.read);
	return new_state;
}

const createRule = (in_state, read, write, direction, new_state) => {
	return {
		in_state: in_state,
		read: read,
		write: write,
		direction: direction,
		new_state: new_state
	};
}

const findRule = (state, stateName, readValue) => {
	return findRuleById(state, standardizeRuleId(stateName, readValue));
}


/* Reducer functions */


/* Helper functions */

const addRuleHelper = (state, in_state, read, write, direction, new_state) => {
	var id = standardizeRuleId(in_state, read);
	if (!ruleExists(state, id)) {
		state.rulesById.push(id);
		state[id] = createRule(in_state, read, write, direction, new_state);
	} else {
		throw DUPLICATED_RULE_ERROR;
	}
}

const setRuleHelper = (state, in_state, read, write, direction, new_state) => {
	var id = standardizeRuleId(in_state, read);
	state[id] = createRule(in_state, read, write, direction, new_state);
}

const deleteRuleHelper = (state, in_state, read) => {
	var id = standardizeRuleId(in_state, read);
	if (ruleExists(state, id)) {
		state.rulesById = state.rulesById.filter(rid => rid != id);
		delete state[id];
	}
}

/* Helper functions */

const initializeMachine = (state, action) => {
	return initialState;
}

const step = (state, action) => {
	if (state.tapeInternalState == HALT)
		return state;

	var rule = findRule(state, state.tapeInternalState, read(state));
	if (rule == null) 
		return state;

	return writeAndMove(state, {
		direction: rule.direction,
		val: rule.write,
		new_state: rule.new_state
	});
}

a = initialState;
s1 = expandAfterTail(a, {n: 5});
s1['CELL 0'] = { val: 1, prev: 'CELL -1', next: 'CELL 1' }
s1['CELL 1'] = { val: 2, prev: 'CELL 0', next: 'CELL 2' }
s1['CELL 2'] = { val: 3, prev: 'CELL 1', next: 'CELL 3' }
s1['CELL 3'] = { val: 4, prev: 'CELL 2', next: 'CELL 4' }
s1['CELL 4'] = { val: 5, prev: 'CELL 3', next: null }
s2 = setInternalState(s1, {state: 0});
s3 = addRule(s2, {
	in_state: 0,
	read: 1,
	write: 1,
	direction: LEFT,
	new_state: 1
})
s4 = addRule(s3, {
	in_state: 1,
	read: 2,
	write: -2,
	direction: RIGHT,
	new_state: 0
})
s5 = step(s4, {})

console.log(s5);