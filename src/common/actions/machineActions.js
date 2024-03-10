import * as actionTypes from '../constants/ActionTypes';
import { setAnimationSpeedAction } from './guiActions';
import { restore } from '../reducers/machine';
import 'whatwg-fetch';


const __LOCAL_REALTIME_DB_URL = 'http://127.0.0.1:9000';
const realtimeDatabasePostUrl = () => {
	if (ENV === 'production') {
		return `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/machines.json`;
	}
	return `${__LOCAL_REALTIME_DB_URL}/machines.json?ns=${FIREBASE_PROJECT_ID}`
}

const realtimeDatabaseGetUrl = (machineId) => {
	if (ENV === 'production') {
		return `https://${FIREBASE_PROJECT_ID}-default-rtdb.firebaseio.com/machines/${machineId}.json`;
	}
	return `${__LOCAL_REALTIME_DB_URL}/machines/${machineId}.json?ns=${FIREBASE_PROJECT_ID}`;
}

export function initMachineAction() {
	return {
		type: actionTypes.INITIALIZAE_MACHINE,
	};
} 

export function preStepAction(singleStep) {
	return {
		type: actionTypes.PRE_STEP_FORWARD,
		singleStep: singleStep
	};
}

export function stepAction(silent=false) {
	return {
		type: actionTypes.STEP_FORWARD,
		silent: silent
	};
}

export function silentRunAction() {
	return {
		type: actionTypes.SILENT_RUN,
	};
}

export function recordIntervalAction(interval) {
	return {
		type:actionTypes.RECORD_INTERVAL,
		interval: interval
	};
}

export function runMachineThunkActionCreator() {
	return (dispatch, getState) => {
		dispatch(preStepAction());
		if (getState().animationOn) {
			let interval = setInterval(() => {
				if (getState().isRunning) {
					dispatch(stepAction());
				}
			}, getState().animationSpeed);
			dispatch(recordIntervalAction(interval));
		} else {
			setTimeout(() => {
				dispatch(silentRunAction());
			}, 800);
		}
	};
}

export function setMachineSpeedThunkActionCreator(newValue) {
	return (dispatch, getState) => {
		dispatch(setAnimationSpeedAction(newValue));
		if (getState().isRunning) {
			clearInterval(getState().interval);
			dispatch(runMachineThunkActionCreator());
		}
	};
}

export function stopAction(message="", flag=false) {
	return {
		type: actionTypes.STOP,
		message: message,
		flag: flag, //show error message
	};
}

export function clearReportedErrorAction() {
	return {
		type: actionTypes.CLEAR_REPORTED_ERROR
	};
}

export function stepBackAction() {
	return {
		type: actionTypes.STEP_BACK
	};
}

export function restoreAction() {
	return {
		type: actionTypes.RESTORE
	};
}

export function redoAction() {
	return {
		type: actionTypes.REDO
	};
}

export function undoAction() {
	return {
		type: actionTypes.UNDO
	};
}

export function loadMachineAction(machineId, history) {
	return (dispatch, getState) => {
		return fetch(realtimeDatabaseGetUrl(machineId)).then((response) => {
			return response.json();
		}).then((data) => {
			if (!data.machineJsonBlob) {
				throw new Error('not found');
			}
			dispatch({
				type: actionTypes.LOAD_MACHINE,
				preloadedState: JSON.parse(data.machineJsonBlob),
			});
		}).catch((err) => {
			history.push('/machine_not_found');
		});
	};
}

export function saveMachineActionCreator(ownProps) {
	return (dispatch, getState) => {
		if (!getState().anyChangeInNormal) {
			ownProps.snackBarSetAnythingNewCallback(false);
			ownProps.snackBarPopUpCallback();
		} else {
			// not saving runhistory or edit history
			let state = restore(getState());
			let step = getState().stepCount;

			const alreadyExists = !!state.machineId;
			const url = !alreadyExists ? realtimeDatabasePostUrl() : realtimeDatabaseGetUrl(state.machineId);
			var action = {
				headers: {"content-type": "application/json"},
				method: !alreadyExists ? 'POST' : 'PATCH',
				body: JSON.stringify({
					machineJsonBlob: JSON.stringify({state: state, step: step}),
				})
			}

			fetch(url, action).then(function(response) {
				if (response.status === 200) {
					return response.json();
				} else {
					throw new Error(response.statusText);
				}
			}).then((res) => {
				if (!alreadyExists) {
					dispatch(goodMachineSaveAction(res.name));
				} else {
					dispatch(goodMachineSaveAction(state.machineId));
				}
				ownProps.snackBarSetAnythingNewCallback(true);
			}).catch(function(err) {
				ownProps.setErrorMessageCallback(err);
			});
		}
	}
}

export function goodMachineSaveAction(url) {
	return {
		type: actionTypes.GOOD_SAVE,
		url: url
	};
}