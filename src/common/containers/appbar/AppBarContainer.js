import { connect } from 'react-redux';
import AppToolBar from '../../components/appbar/AppBar';
import { initializeTapeAction } from '../../actions/tapeActions';
import { toggleAnimationAction } from '../../actions/guiActions';
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
	saveMachineActionCreator,
} from '../../actions/machineActions';

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
	dispatch(saveMachineActionCreator(ownProps));
}

const handleClearTape = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(initializeTapeAction(false));
}

const handleSpeedChange = (newValue, dispatch, ownProps) => {
	dispatch(setMachineSpeedThunkActionCreator(newValue));
}


const mapStateToProps = (state, ownProps) => {
    return {
    	isRunning: state.isRunning,
    	animationOn: state.animationOn,
    	animationSpeedFactor: state.animationSpeedFactor,
    	animationSpeedLabel: standardizeAnimationSpeedLabel(state.animationSpeedFactor),
    	redoAble: state.redoEditHistory.length > 0,
    	undoAble: state.undoEditHistory.length > 0,
    	lastStepAble: state.runHistory.length > 0,
    	isEdittingTrial: state.isEdittingTrial
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
})

export default connect(mapStateToProps, mapDispatchToProps)(AppToolBar);