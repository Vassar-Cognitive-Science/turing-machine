import { DUPLICATED_RULE_ERROR, REQUIRED_FIELD_ERROR } from '../constants/Messages';


/*
const initialStateForTable = {
	rowsById: [],

	
	A row is a plain object that holds information for inputed rule and how it is presented
	{
		in_state: in_state, // rule infomation 
		read: read, // rule infomation
		write: write, // rule infomation
		direction: ((isLeft) ? LEFT : RIGHT), // rule infomation
		new_state: new_state, // rule infomation

		isLeft: isLeft, // presentational information 
		in_state_error: in_state_error, // presentational information
		read_error: read_error, // presentational information
		write_error: write_error, // presentational information
		new_state_error: new_state_error, // presentational information
	}

	
}
*/


function createRow(in_state = "", read = "", write = "", isLeft = false, new_state = "",
					in_state_error = "", read_error = "", write_error = "", new_state_error = "") {
	return {
		in_state: in_state,
		read: read,
		write: write,
		new_state: new_state,
		isLeft: isLeft,
		in_state_error: in_state_error,
		read_error: read_error,
		write_error: write_error,
		new_state_error: new_state_error
	}
}

function setRow(state, action) {
	let in_state_error = "";
	let read_error = "";
	let write_error = "";
	let new_state_error = "";

	for (var i = 0; i < state.rowsById.length; i++) {
		if (action.id === state.rowsById[i]) continue;
		let row = state[state.rowsById[i]];
		if (row.in_state && row.read) {
			if (action.in_state === row.in_state && action.read === row.read) {
				in_state_error = DUPLICATED_RULE_ERROR;
				read_error = DUPLICATED_RULE_ERROR;
			}
		}
	}

	if (!action.in_state && !in_state_error) in_state_error = REQUIRED_FIELD_ERROR;
	if (!action.read && !read_error) read_error = REQUIRED_FIELD_ERROR;
	if (!action.write && !write_error) write_error = REQUIRED_FIELD_ERROR;
	if (!action.new_state && !new_state_error) new_state_error = REQUIRED_FIELD_ERROR;

	var new_state = Object.assign({}, state);
	new_state[action.id] = createRow(action.in_state, 
									action.read, 
									action.write, 
									action.isLeft,
									action.new_state,
									in_state_error,
									read_error,
									write_error,
									new_state_error);
	return new_state;
}

export function cloneRow(row) {
	return createRow(row.in_state, row.read, row.write, row.isLeft, row.new_state, row.in_state_error, 
					row.read_error, row.write_error, row.new_state_error);
}

export function addRow(state, action) {
	var new_state = Object.assign({}, state, {
		rowsById: state.rowsById.slice(),
	})

	new_state[action.id] = createRow();
	new_state.rowsById.push(action.id);

	return new_state;
}

export function deleteRow(state, action) {	
	var new_state = Object.assign({}, state, {
		rowsById: state.rowsById.filter(rid => rid !== action.id)
	});
	delete new_state[action.id];

	return new_state;
}

export function setRowInState(state, action) {
	var oldRow = state[action.id];
	return setRow(state, {id: action.id, 
						  in_state: action.in_state, 
						  read: oldRow.read, 
						  write: oldRow.write, 
						  isLeft: oldRow.isLeft,
						  new_state: oldRow.new_state});
}

export function setRowNewState(state, action) {
	var oldRow = state[action.id];
	return setRow(state, {id: action.id, 
						  in_state: oldRow.in_state, 
						  read: oldRow.read, 
						  write: oldRow.write, 
						  isLeft: oldRow.isLeft,
						  new_state: action.new_state});
}

export function setRowRead(state, action) {
	var oldRow = state[action.id];
	return setRow(state, {id: action.id, 
						  in_state: oldRow.in_state, 
						  read: action.read, 
						  write: oldRow.write, 
						  isLeft: oldRow.isLeft,
						  new_state: oldRow.new_state});
}

export function setRowWrite(state, action) {
	var oldRow = state[action.id];
	return setRow(state, {id: action.id, 
						  in_state: oldRow.in_state, 
						  read: oldRow.read, 
						  write: action.write, 
						  isLeft: oldRow.isLeft,
						  new_state: oldRow.new_state});
}


export function switchRowDirection(state, action) {
	var oldRow = state[action.id];
	return setRow(state, {id: action.id, 
						  in_state: oldRow.in_state, 
						  read: oldRow.read, 
						  write: oldRow.write, 
						  isLeft: !oldRow.isLeft,
						  new_state: oldRow.new_state});
}

