import * as actionTypes from '../constants/ActionTypes.js';

export function initMachineAction(tapeSize) {
	return {
		type: actionTypes.INITIALIZAE_MACHINE,
		tapeSize: tapeSize
	};
} 

export function stepAction() {
	return {
		type: actionTypes.STEP_FORWARD
	};
}

export function playAction() {
	return {
		type: actionTypes.PLAY
	}
}

export function recordIntervalAction(interval) {
	return {
		type:actionTypes.RECORD_INTERVAL,
		interval: interval
	}
}

export function clearIntervalAction() {
	return {
		type: actionTypes.CLEAR_INTERVAL
	}
}

export function runMachineThunkActionCreater() {
	return (dispatch, getState) => {
		let interval = setInterval(() => {
			if (getState().isRunning) {
				dispatch(stepAction());
				// console.log();
			}
		}, getState().animationSpeed);
		dispatch(recordIntervalAction(interval));
	}
}