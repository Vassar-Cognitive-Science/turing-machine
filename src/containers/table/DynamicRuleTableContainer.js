import { connect } from 'react-redux';
import { addRowAction } from '../../actions/tableActions';
import DynamicRuleTable from '../../components/table/DynamicRuleTable';

var ROW_ID = 0;
const ROW_ID_PREFIX = "TABLE-ROW-";

export const standardizeTableRowId = (id) => (ROW_ID_PREFIX + id); 

const addRow = (dispatch, ownProps) => {
	dispatch(addRowAction(standardizeTableRowId(ROW_ID++)));
}

const mapStateToProps = (state, ownProps) => {
	return {
		state: state
	}
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	addRow: () => { addRow(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DynamicRuleTable);