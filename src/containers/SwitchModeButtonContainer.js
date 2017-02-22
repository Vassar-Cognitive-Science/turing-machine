import { connect } from 'react-redux';
import SwitchModeButton from '../components/SwitchModeButton';
import { switchRowModeAction } from '../actions/index';


const switchMode = (dispatch, ownProps) => {
	dispatch(switchRowModeAction(ownProps.parent));
}

const mapStateToProps = (state, ownProps) => {
	return {
		value: state[ownProps.parent].editable
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	switchMode: () => { switchMode(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchModeButton);