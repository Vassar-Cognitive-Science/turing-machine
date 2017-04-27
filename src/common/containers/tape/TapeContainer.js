import { connect } from 'react-redux';
import Tape from '../../components/tape/Tape';
import { rollTapeToRight, rollTapeToLeft } from './SquareContainer';
import {
	changeEdittingTargetAction,
	toggleEditModeAction,
	saveTrialAction,
	setTrialNameAction
} from '../../actions/trialActions';
import { REACH_HALT, } from '../../constants/Messages';

const rollLeft = (dispatch) => {
    rollTapeToRight(dispatch, true)
}

const rollRight = (dispatch) => {
	rollTapeToLeft(dispatch, true)
}

const changeEdittingTarget = (dispatch) => {
	dispatch(changeEdittingTargetAction());
}

const handleExit = (dispatch, ownProps) => {
	dispatch(toggleEditModeAction());
	ownProps.trialDrawerToggleCallback();
}

const handleSave = (dispatch) => {
	dispatch(saveTrialAction());
}

const setTrialName = (evt, newVal, dispatch) => {
	dispatch(setTrialNameAction(newVal));
}

const mapStateToProps = (state) => {
	return {
		showReportedError: state.showReportedError,
		machineReportError: state.machineReportError,
		isRunning: state.isRunning,
		cellNum: state.cellNum,
		messageColor: (state.machineReportError === REACH_HALT) ? "#1976D2" : "#FF3D00",
		stepCount: state.stepCount,

		isEdittingTrial: state.isEdittingTrial,
		isEdittingExpectedTape: state.isEdittingExpectedTape,

		tapePointer: state.tapePointer,

		anyChangeInTrial: state.anyChangeInTrial,

		edittingTrial: state.edittingTrialName,
		// isEdittingExpectedTape: state.isEdittingExpectedTape,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	rollLeft: () => { rollLeft(dispatch) },
  	rollRight: () => { rollRight(dispatch) },
  	changeEdittingTarget: () => { changeEdittingTarget(dispatch) },
  	handleExit: () => { handleExit(dispatch, ownProps) },
  	handleSave: () => { handleSave(dispatch) },
  	setTrialName: (evt, newVal) => { setTrialName(evt, newVal, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Tape);