import { connect } from 'react-redux';
import SwitchDirectionButton from '../components/SwitchDirectionButton';
import { switchRowDirectionAction } from '../actions/index';


const switchDirection = (dispatch, ownProps) => {
	dispatch(switchRowDirectionAction(ownProps.parent));
}

const mapStateToProps = (state, ownProps) => {
	return {
		value: state[ownProps.parent].isLeft,
		editable: state[ownProps.parent].editable
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	switchDirection: () => { switchDirection(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchDirectionButton);