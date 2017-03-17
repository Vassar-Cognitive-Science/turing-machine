import { connect } from 'react-redux';
import AppToolBar from '../../components/appbar/AppBar';
import { initializeTapeAction } from '../../actions/tapeActions';
import { toggleAnimationAction } from '../../actions/guiActions';
import {
	addTrialAction,
	runTrialAction,
	toggleIsRunningTrialAction,
	clearTestResultAction,
	preRunTrialAction
} from '../../actions/trialActions';
import {
	preStepAction,
	stepAction, 
	stopAction,
	runMachineThunkActionCreator,
	setMachineSpeedThunkActionCreator,
	stepBackAction,
	restoreAction,
	undoAction,
	redoAction,
} from '../../actions/machineActions';


var TEST_ID = 1;
const TEST_ID_PREFIX = "Test Case #";
export const standardizeTestId = (id) => (TEST_ID_PREFIX + id); 

const standardizeAnimationSpeedLabel = (speed) => ("x " + parseFloat(speed).toFixed(1));

function handleRun(dispatch) {
	dispatch(runMachineThunkActionCreator());
}

const handlePause = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleLast = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(stepBackAction());
}

const handleNext = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(preStepAction(true));
	dispatch(stepAction());
}

const handleRestore = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(restoreAction());
}

const handleToggleAnimation = (dispatch, ownProps) => {
	dispatch(toggleAnimationAction());
}

const handleRedo = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(redoAction());
}

const handleUndo = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(undoAction());
}

const handleTest = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleSave = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleClearTape = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(initializeTapeAction(false));
}

const handleSpeedChange = (newValue, dispatch, ownProps) => {
	dispatch(setMachineSpeedThunkActionCreator(newValue));
}

const handleAddTest = (dispatch, ownProps) => {
	dispatch(function(dispatch, getState) {
		let id = standardizeTestId(TEST_ID++);
		while (getState().testsById.includes(id))
			id = standardizeTestId(TEST_ID++);
		dispatch(addTrialAction(id));
	});
}

const handleRunAllTests = (dispatch, ownProps) => {
	// update state
	dispatch(toggleIsRunningTrialAction(true));
	// clear previous test results
	dispatch(clearTestResultAction());

	// prepare all tests for running
	dispatch(function(dispatch, getState) {
		for (let i = 0; i < getState().testsById.length; i++)
			dispatch(preRunTrialAction(getState().testsById[i]));
	});

	// runn tests
	setTimeout(() => {
		dispatch(function(dispatch, getState) {
			for (let i = 0; i < getState().testsById.length; i++) {
				dispatch(runTrialAction(getState().testsById[i]));
			}
			dispatch(toggleIsRunningTrialAction(false));
		})
	}, 800);
}

const mapStateToProps = (state, ownProps) => {
    return {
    	runningTrials: state.runningTrials,
    	isRunning: state.isRunning,
    	isRunningTrial: state.isRunningTrial,
    	animationOn: state.animationOn,
    	animationSpeedFactor: state.animationSpeedFactor,
    	animationSpeedLabel: standardizeAnimationSpeedLabel(state.animationSpeedFactor),
    	redoAble: state.redoEditHistory.length > 0,
    	undoAble: state.undoEditHistory.length > 0,
    	lastStepAble: state.runHistory.length > 0,
    	testsById: state.testsById,
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleRun: () => { handleRun(dispatch, ownProps) },
	handlePause: () => { handlePause(dispatch, ownProps) },
	handleLast: () => { handleLast(dispatch, ownProps) },
	handleNext: () => { handleNext(dispatch, ownProps) },
	handleRestore: () => { handleRestore(dispatch, ownProps) },
	handleUndo: () => { handleUndo(dispatch, ownProps) },
	handleRedo: () => { handleRedo(dispatch, ownProps) },
	handleTest: () => { handleTest(dispatch, ownProps) },
	handleSave: () => { handleSave(dispatch, ownProps) },
	handleClearTape: () => { handleClearTape(dispatch, ownProps) },
	handleSpeedChange: (e, newValue) => { handleSpeedChange(newValue, dispatch, ownProps) },
	handleToggleAnimation: () => { handleToggleAnimation(dispatch, ownProps) },
	handleAddTest: () => { handleAddTest(dispatch, ownProps) },
	handleRunAllTests: () => { handleRunAllTests(dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(AppToolBar);