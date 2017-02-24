import { connect } from 'react-redux';
import SwitchDirectionButton from '../components/SwitchDirectionButton';
import { switchRowDirectionAction } from '../actions/index';
import { getRowData, FIELD_TYPES } from '../components/DynamicRuleTable';


const switchDirection = (dispatch, ownProps) => {
	dispatch(switchRowDirectionAction(ownProps.parent));
}

const mapStateToProps = (state, ownProps) => {
	console.log(state)
	return {
		value: state[ownProps.parent].isLeft
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	switchDirection: () => { switchDirection(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchDirectionButton);