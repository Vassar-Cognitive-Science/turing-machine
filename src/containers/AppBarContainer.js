import { connect } from 'react-redux';
import AppToolBar from '../components/AppBar';
import { setPlayStateAction, setAnimationSpeedAction } from '../actions/guiActions';
import { setCorrespondingCellHighlightAction } from '../actions/tapeActions';
import {
	stepAction, 
	stopAction,
	initMachineAction,
	runMachineThunkActionCreator,
} from '../actions/index';
import { N_CELLS } from '../constants/GUISettings';

const standardizeAnimationSpeedLabel = (speed) => ("x " + parseFloat(speed).toFixed(1));


function handleRun(dispatch) {
	dispatch(setCorrespondingCellHighlightAction(true));
	dispatch(setPlayStateAction(true));
	dispatch(runMachineThunkActionCreator());
}

const handlePause = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleLast = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleNext = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(setCorrespondingCellHighlightAction(true));
	dispatch(stepAction());
}

const handleRestore = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleRedo = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleUndo = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleTest = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleSave = (dispatch, ownProps) => {
	dispatch(stopAction());
}

const handleClear = (dispatch, ownProps) => {
	dispatch(stopAction());
	dispatch(initMachineAction(N_CELLS));
}

const handleSpeedChange = (newValue, dispatch, ownProps) => {
	dispatch(function(dispatch, getState){
		dispatch(setAnimationSpeedAction(newValue));
		if (getState().isRunning) {
			dispatch(stopAction());
			handleRun(dispatch, ownProps);
		}
	})
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