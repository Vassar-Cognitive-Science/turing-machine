import { connect } from 'react-redux';
import TextFieldWrapper from '../components/TextFieldWrapper';
import { setRowAction } from '../actions/index';
import { getRowData, FIELD_TYPES } from '../components/DynamicRuleTable';


const onBlur = (dispatch, ownProps) => {
	inputRule(dispatch, ownProps);
}

const inputRule = (dispatch, ownProps) => {
	let rowData = getRowData(ownProps.parent);
	dispatch(setRowAction(ownProps.parent, 
						  rowData[0], 
					  	  rowData[1], 
					  	  rowData[2], 
					  	  rowData[3], 
					  	  rowData[4]));
}

const onChange = (e, s, dispatch, ownProps) => {
	console.log(e.target)
	inputRule(dispatch, ownProps);
}


const mapStateToProps = (state, ownProps) => {
	let thisRow = state[ownProps.parent];
	let error = "";
	if (ownProps.fieldType === FIELD_TYPES[1]) {
		error = thisRow.read_error;
	} else if (ownProps.fieldType === FIELD_TYPES[2]) {
		error = thisRow.write_error;
	}

	return {
		errorText: error
	};
}


const mapDispatchToProps = (dispatch, ownProps) => ({
	onBlur: () => { onBlur(dispatch, ownProps) },
	onChange: (e, s) => { onChange(e, s, dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TextFieldWrapper);