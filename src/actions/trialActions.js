import * as actionTypes from '../constants/ActionTypes';

export function deleteTrialAction(id) {
	return {
		type: actionTypes.DELETE_TRIAL,
		id: id
	};
}

export function addTrialAction(id, 
							   startState,
							   startTape,
							   expectedTape,
							   tapePointer,
							   expectedTapePoiner,
							   startTapeHead,
							   expectedTapeHead,
							   sourceFile) {
	return {
		type: actionTypes.ADD_TRIAL,
		id: id,

		startState: startState,
		startTape: startTape,
		expectedTape: expectedTape,

		// start Head pointer
		tapePointer: tapePointer,
		// expected Head pointer
		expectedTapePoiner: expectedTapePoiner,

		// record name of source file
		sourceFile: sourceFile,

		// tape head
		startTapeHead: startTapeHead,
		expectedTapeHead: expectedTapeHead,
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