import { connect } from 'react-redux';
import AppToolBar from '../components/AppBar';
import { setPlayStateAction, setAnimationSpeedAction } from '../actions/guiActions';
import { stepAction } from '../actions/index';
import { initMachineAction, runMachineThunkActionCreater, recordIntervalAction, clearIntervalAction } from '../actions/index';
import { N_CELLS } from '../constants/GUISettings';

const standardizeAnimationSpeedLabel = (speed) => ("x " + parseFloat(speed).toFixed(1));


function handleRun(dispatch) {
	dispatch(setPlayStateAction(true));
	dispatch(runMachineThunkActionCreater());
}

const handlePause = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleLast = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleNext = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
	dispatch(stepAction());
}

const handleRestore = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleRedo = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleUndo = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleTest = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleSave = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleClear = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
	dispatch(initMachineAction(N_CELLS));
}

const handleSpeedChange = (newValue, dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
	dispatch(setAnimationSpeedAction(newValue));
	handleRun(dispatch, ownProps);
}

const mapStateToProps = (state, ownProps) => {
    return {
    	isRunning: state.isRunning,
    	animationSpeedFactor: state.animationSpeedFactor,
    	animationSpeedLabel: standardizeAnimationSpeedLabel(state.animationSpeedFactor),
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
	handleClear: () => { handleClear(dispatch, ownProps) },
	handleSpeedChange: (e, newValue) => { handleSpeedChange(newValue, dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(AppToolBar);