import { connect } from 'react-redux';
import DeleteRowButton from '../components/DeleteRowButton';
import { deleteRowAction } from '../actions/index';


const deleteRow = (dispatch, ownProps) => {
	dispatch(deleteRowAction(ownProps.parent));
}

const mapStateToProps = (state, ownProps) => ({})

const mapDispatchToProps = (dispatch, ownProps) => ({
	deleteRow: () => { deleteRow(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(DeleteRowButton);