import { connect } from 'react-redux';
import Tape from '../../components/tape/Tape';
import { rollTapeToRight, rollTapeToLeft } from './SquareContainer';
import { changeEdittingTargetAction, toggleEditModeAction, saveTrialAction } from '../../actions/trialActions';
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

const handleExit = (dispatch) => {
	dispatch(toggleEditModeAction());
}

const handleSave = (dispatch) => {
	dispatch(saveTrialAction());
}

const mapStateToProps = (state) => {
	let file = (state[state.edittingTrialId]) ? state[state.edittingTrialId].name : null;

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

		edittingFile: file
		// isEdittingExpectedTape: state.isEdittingExpectedTape,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	rollLeft: () => { rollLeft(dispatch) },
  	rollRight: () => { rollRight(dispatch) },
  	changeEdittingTarget: () => { changeEdittingTarget(dispatch) },
  	handleExit: () => { handleExit(dispatch) },
  	handleSave: () => { handleSave(dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Tape);