import { connect } from 'react-redux';
import { addRowAction } from '../../actions/tableActions';
import DynamicRuleTable from '../../components/table/DynamicRuleTable';


var ROW_ID = 0;
const ROW_ID_PREFIX = "TABLE-ROW-";

export const standardizeTableRowId = (id) => (ROW_ID_PREFIX + id); 

const addRow = (dispatch, ownProps) => {
	dispatch(function(dispatch, getState) {
		let id = standardizeTableRowId(ROW_ID++);
		while (getState().rowsById.includes(id))
			id = standardizeTableRowId(ROW_ID++);
		dispatch(addRowAction(id));
	});
}

const mapStateToProps = (state, ownProps) => {
	console.log(state.highlightedRow)
	return {
		rowsById: state.rowsById,
		highlightedRow: state.highlightedRow,
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	addRow: () => { addRow(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DynamicRuleTable);