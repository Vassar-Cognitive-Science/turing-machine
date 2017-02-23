import { connect } from 'react-redux';
import DeleteRowButton from '../components/DeleteRowButton';
import { deleteRowAction, deleteRuleAction } from '../actions/index';
import { getRowData } from '../components/DynamicRuleTable';

const deleteRow = (dispatch, ownProps) => {
	var rowData = getRowData(ownProps.parent);
	dispatch(deleteRowAction(ownProps.parent));
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
	deleteRow: () => { deleteRow(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteRowButton);