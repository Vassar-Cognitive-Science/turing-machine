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
	}
}

export function preRunTrialAction(id) {
	return {
		type: actionTypes.PRE_RUN_TRIAL,
		id: id
	}
}

export function runTrialAction(sourceId) {
	return {
		type: actionTypes.RUN_TRIAL,
		sourceId: sourceId
	}
}

export function loadTrialAction(id) {
	return {
		type: actionTypes.LOAD_TRIAL,
		id: id,
	}
}