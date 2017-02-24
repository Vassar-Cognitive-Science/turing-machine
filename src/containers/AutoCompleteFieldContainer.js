import { connect } from 'react-redux';
import AutoCompleteField from '../components/AutoCompleteField';
import { setRowAction } from '../actions/index';
import { getRowData, FIELD_TYPES } from '../components/DynamicRuleTable';


const inputRule = (dispatch, ownProps) => {
	var rowData = getRowData(ownProps.parent);
	dispatch(setRowAction(ownProps.parent, 
						  rowData[0], 
					  	  rowData[1], 
					  	  rowData[2], 
					  	  rowData[3], 
					  	  rowData[4]));
}

const getAllStates = (state) => {
	let dataSource = {};
	dataSource[state.tapeInternalState] = 0;
	for (var i = 0; i < state.rowsById.length; i++) {
		let row = state[state.rowsById[i]];
		if (row.in_state) dataSource[row.in_state] = 0;
		if (row.new_state) dataSource[row.new_state] = 0;
	}
	return dataSource;
}

const getAllInputs = (state) => {
	let dataSource = {};
	for (let i = 0; i < state.rowsById.length; i++) {
		let row = state[state.rowsById[i]];
		if (row.read) dataSource[row.read] = 0;
		if (row.write) dataSource[row.write] = 0;
	}

	for (let i = 0; i < state.tapeCellsById.length; i++) {
		let cell = state[state.tapeCellsById[i]];
		if (cell.val) dataSource[cell.val] = 0;
	}

	return dataSource;
}

const mapStateToProps = (state, ownProps) => {
	let thisRow = state[ownProps.parent];
	let filter = (searchText, key) => (searchText === "" || key.startsWith(searchText));
	let error = "";
	let dataSource = {};
	switch(ownProps.fieldType) {
		case FIELD_TYPES[0]:
			error = thisRow.in_state_error;
			dataSource = getAllStates(state);
			break;
		case FIELD_TYPES[4]:
			error = thisRow.new_state_error;
			dataSource = getAllStates(state);
			break;
		case FIELD_TYPES[1]:
			error = thisRow.read_error;
			dataSource = getAllInputs(state);
			filter = (searchText, key) => (true);
			break;
		case FIELD_TYPES[2]:
			error = thisRow.write_error;
			dataSource = getAllInputs(state);
			filter = (searchText, key) => (true);
			break;
		default:
			break;
	}

	delete dataSource[null];

	return {
		errorText: error,
		dataSource: Object.keys(dataSource),
		filter: filter
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	onUpdateInput: () => { inputRule(dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteField);