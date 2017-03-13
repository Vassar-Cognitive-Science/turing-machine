import { connect } from 'react-redux';
import EditTapeInfoPanel from '../../components/appbar/EditTapeInfoPanel';
import { toggleEditModeAction, } from '../../actions/trialActions';

const saveEdit = (dispatch, ownProps) => {
	dispatch(toggleEditModeAction());
}

const cancelEdit = (dispatch, ownProps) => {
	dispatch(toggleEditModeAction());
}

const mapStateToProps = (state, ownProps) => {
	return {
	};
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	saveEdit: () => { saveEdit(dispatch, ownProps) },
	cancelEdit: () => { cancelEdit(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(EditTapeInfoPanel);