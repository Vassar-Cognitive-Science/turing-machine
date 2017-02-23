import { LEFT, RIGHT } from '../constants/ReservedWords';

export const DUPLICATED_RULE_ERROR = "Rule already exists.";
export const REQUIRED_FIELD_ERROR = "This field is required.";

export const getRowById = (state, id) => {
	var row = state[id];
	if (!row)
		return null;
	return row;
}

const createRow = (in_state="", read="", write="", isLeft=true, new_state="", 
				   in_state_error="", read_error="", write_error="", new_state_error="") => ({
	in_state: in_state,
	read: read,
	write: write,
	direction: ((isLeft) ? LEFT : RIGHT),
	new_state: new_state,
	isLeft: isLeft,
	in_state_error: in_state_error,
	read_error: read_error,
	write_error: write_error,
	new_state_error: new_state_error
})

export const addRow = (state, action) => {
	var new_state = Object.assign({}, state, {
		rowsById: state.rowsById.slice(),
	})

	new_state[action.id] = createRow();
	new_state.rowsById.push(action.id);

	return new_state;
}

export const deleteRow = (state, action) => {	
	var new_state = Object.assign({}, state, {
		rowsById: state.rowsById.filter(rid => rid !== action.id)
	});
	delete new_state[action.id];

	return new_state;
}

// export const switchRowMode = (state, action) => {
// 	var new_state = Object.assign({}, state);
// 	var oldRow = state[action.id];
// 	new_state[action.id] = createRow(!oldRow.editable, oldRow.isLeft);
// 	return new_state;
// }

export const switchRowDirection = (state, action) => {
	var new_state = Object.assign({}, state);
	var oldRow = state[action.id];
	new_state[action.id] = createRow(oldRow.in_state, 
									oldRow.read, 
									oldRow.write, 
									!oldRow.isLeft,
									oldRow.new_state);
	return new_state;
}

export const setRow = (state, action) => {
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