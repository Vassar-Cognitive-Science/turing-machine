import { connect } from 'react-redux';
import AppToolBar from '../components/AppBar';
import { setPlayStateAction, setAnimationSpeedAction } from '../actions/guiActions';
import { initMachineAction } from '../actions/index';
import { N_CELLS } from '../constants/GUISettings';

const standardizeAnimationSpeedLabel = (speed) => ("x " + parseFloat(speed).toFixed(1));

const handlePlay = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(true));
}

const handlePause = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleStop = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleLast = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
}

const handleNext = (dispatch, ownProps) => {
	dispatch(setPlayStateAction(false));
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
	dispatch(initMachineAction(N_CELLS));
}

const handleSpeedChange = (newValue, dispatch) => {
	dispatch(setAnimationSpeedAction(newValue));
}

const mapStateToProps = (state, ownProps) => {
    return {
    	isPaused: state.isPaused,
    	animationSpeedFactor: state.animationSpeedFactor,
    	animationSpeedLabel: standardizeAnimationSpeedLabel(state.animationSpeedFactor),
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handlePlay: () => { handlePlay(dispatch, ownProps) },
	handlePause: () => { handlePause(dispatch, ownProps) },
	handleStop: () => { handleStop(dispatch, ownProps) },
	handleLast: () => { handleLast(dispatch, ownProps) },
	handleNext: () => { handleNext(dispatch, ownProps) },
	handleRestore: () => { handleRestore(dispatch, ownProps) },
	handleUndo: () => { handleUndo(dispatch, ownProps) },
	handleRedo: () => { handleRedo(dispatch, ownProps) },
	handleTest: () => { handleTest(dispatch, ownProps) },
	handleSave: () => { handleSave(dispatch, ownProps) },
	handleClear: () => { handleClear(dispatch, ownProps) },
	handleSpeedChange: (e, newValue) => { handleSpeedChange(newValue, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(AppToolBar);