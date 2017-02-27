import { connect } from 'react-redux';
import SwitchDirectionButton from '../../components/table/SwitchDirectionButton';
import { switchRowDirectionAction } from '../../actions/tableActions';


const switchDirection = (dispatch, ownProps) => {
	dispatch(switchRowDirectionAction(ownProps.parent));
}

const mapStateToProps = (state, ownProps) => {
	return {
		value: state[ownProps.parent].isLeft
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	switchDirection: () => { switchDirection(dispatch, ownProps) }
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchDirectionButton);