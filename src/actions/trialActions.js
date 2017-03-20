import * as actionTypes from '../constants/ActionTypes';

export function deleteTrialAction(id) {
	return {
		type: actionTypes.DELETE_TRIAL,
		id: id
	};
}

export function addTrialAction(id, startState="", expectedFinalState="", tape=[], expectedFinalTape=[],
								startHeadPosition = 0, sourceFile = null, errorMessage = "") {
	return {
		type: actionTypes.ADD_TRIAL,
		id: id,
		startState: startState,
		expectedFinalState: expectedFinalState,
		startTape: tape,
		expectedFinalTape: expectedFinalTape,

		startHeadPosition: startHeadPosition,
		sourceFile: sourceFile,
		errorMessage: errorMessage,
	};
}

export function preRunTrialAction(id) {
	return {
		type: actionTypes.PRE_RUN_TRIAL,
		id: id
	};
}

export function runTrialAction(sourceId) {
	return {
		type: actionTypes.RUN_TRIAL,
		sourceId: sourceId
	};
}

export function loadTrialAction(id) {
	return {
		type: actionTypes.LOAD_TRIAL,
		id: id,
	};
}

export function toggleIsRunningTrialAction(flag=undefined) {
	return {
		type: actionTypes.TOGGLE_IS_RUNNING_TRIAL,
		flag: flag,
	};
}

export function clearTestResultAction() {
	return {
		type: actionTypes.CLEAR_TEST_RESULTS,
	};
}

export function toggleEditModeAction(id=undefined) {
	return {
		type: actionTypes.TOGGLE_EDIT_MODE,
		id: id
	}
}

export function changeEdittingTargetAction() {
	return {
		type: actionTypes.CHANGE_EDITTING_TARGET
	}
}

export function saveTrialAction() {
	return {
		type: actionTypes.SAVE_TRIAL
	}
}