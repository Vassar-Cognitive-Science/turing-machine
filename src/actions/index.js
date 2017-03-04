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

export function runMachineThunkActionCreator() {
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

export function stopAction(message="", flag=false) {
	return {
		type: actionTypes.STOP,
		message: message,
		flag: flag, //show error message
	}
}

export function clearReportedErrorAction() {
	return {
		type: actionTypes.CLEAR_REPORTED_ERROR
	}
}