
export const findRowById = (state, id) => {
	var row = state[id];
	if (!row)
		return null;
	return row;
}

const createRow = (editable=true, isLeft=true) => ({
	editable: editable,
	isLeft: isLeft
})

export const addRow = (state, action) => {
	if (findRowById(action.id) !== null)
		return state;
	var new_state = Object.assign({}, state, {
		rowsById: state.rowsById.slice(),
	})

	new_state[action.id] = createRow();
	new_state.rowsById.push(action.id);

	return new_state;
}


export const deleteRow = (state, action) => {
	if (findRowById(action.id) !== null)
		return state;
	
	var new_state = Object.assign({}, state, {
		rowsById: state.rowsById.filter(rid => rid !== action.id)
	});
	delete new_state[action.id];

	return new_state;
}

export const switchRowMode = (state, action) => {
	var new_state = Object.assign({}, state);
	var oldRow = state[action.id];
	new_state[action.id] = createRow(!oldRow.editable, oldRow.isLeft);
	return new_state;
}

export const switchRowDirection = (state, action) => {
	var new_state = Object.assign({}, state);
	var oldRow = state[action.id];
	new_state[action.id] = createRow(oldRow.editable, !oldRow.isLeft);
	return new_state;
}