import { connect } from 'react-redux';
import AutoCompleteField from '../../components/table/AutoCompleteField';
import { setRowInStateAction, setRowReadAction, setRowWriteAction, setRowNewStateAction } from '../../actions/tableActions';
import { FIELD_TYPES } from '../../components/table/DynamicRuleTable';
import { HALT, BLANK, STAR } from '../../constants/SpecialCharacters';

export const standardFilter = (searchText, key) => (searchText === "" || key.startsWith(searchText) && key !== searchText);

const onUpdateInput = (searchText, dispatch, ownProps) => {
	if (searchText.toUpperCase() === HALT) searchText = HALT;
	switch(ownProps.fieldType) {
		case FIELD_TYPES[0]:
			dispatch(setRowInStateAction(ownProps.parent, searchText));
			break;
		case FIELD_TYPES[4]:
			dispatch(setRowNewStateAction(ownProps.parent, searchText));
			break;
		case FIELD_TYPES[1]:
			dispatch(setRowReadAction(ownProps.parent, searchText));
			break;
		case FIELD_TYPES[2]:
			dispatch(setRowWriteAction(ownProps.parent, searchText));
			break;
		default:
			break;
	}
}

export const getAllStates = (state) => {
	let dataSource = { HALT: 0 };
	dataSource[state.tapeInternalState] = 0;
	for (var i = 0; i < state.rowsById.length; i++) {
		let row = state[state.rowsById[i]];
		if (row.in_state) dataSource[row.in_state] = 0;
		if (row.new_state) dataSource[row.new_state] = 0;
	}
	delete dataSource[""];
	return dataSource;
}

const getAllInputs = (state) => {
	let dataSource = { [STAR]: 0, [BLANK]: 0 };
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
	let filter = standardFilter;
	let fontColor = "#212121";
	let error = "";
	let dataSource = {};
	let value = "";
	switch(ownProps.fieldType) {
		case FIELD_TYPES[0]:
			value = thisRow.in_state;
			error = thisRow.in_state_error;
			dataSource = getAllStates(state);
			fontColor = (value === HALT) ? "#1976D2" : fontColor; // #FF3D00
			break;
		case FIELD_TYPES[4]:
			value = thisRow.new_state;
			error = thisRow.new_state_error;
			dataSource = getAllStates(state);
			fontColor = (value === HALT) ? "#1976D2" : fontColor; // #FF3D00
			break;
		case FIELD_TYPES[1]:
			value = thisRow.read;
			error = thisRow.read_error;
			dataSource = getAllInputs(state);
			filter = (searchText, key) => (true);
			fontColor = (value === BLANK || value === STAR) ? "#1976D2" : fontColor; // #FF3D00
			break;
		case FIELD_TYPES[2]:
			value = thisRow.write;
			error = thisRow.write_error;
			dataSource = getAllInputs(state);
			filter = (searchText, key) => (true);
			fontColor = (value === BLANK || value === STAR) ? "#1976D2" : fontColor; // #FF3D00
			break;
		default:
			break;
	}

	delete dataSource[null];
	return {
		fontColor: fontColor,
		searchText: value,
		errorText: error,
		dataSource: Object.keys(dataSource),
		filter: filter,
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	onUpdateInput: (searchText) => { onUpdateInput(searchText, dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteField);