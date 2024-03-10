import * as actionTypes from '../constants/ActionTypes'

export function deleteTrialAction (id) {
  return {
    type: actionTypes.DELETE_TRIAL,
    id
  }
}

export function addTrialAction (id,
							   startState,
							   startTape,
							   expectedTape,
							   tapePointer,
							   expectedTapePoiner,
							   startTapeHead,
							   expectedTapeHead,
							   name) {
  return {
    type: actionTypes.ADD_TRIAL,
    id,

    startState,
    startTape,
    expectedTape,

    // start Head pointer
    tapePointer,
    // expected Head pointer
    expectedTapePoiner,

    // record name of source file
    name,

    // tape head
    startTapeHead,
    expectedTapeHead
  }
}

export function preRunTrialAction (id) {
  return {
    type: actionTypes.PRE_RUN_TRIAL,
    id
  }
}

export function runTrialAction (sourceId) {
  return {
    type: actionTypes.RUN_TRIAL,
    sourceId
  }
}

export function loadTrialAction (id) {
  return {
    type: actionTypes.LOAD_TRIAL,
    id
  }
}

export function toggleIsRunningTrialAction (flag = undefined) {
  return {
    type: actionTypes.TOGGLE_IS_RUNNING_TRIAL,
    flag
  }
}

export function clearTestResultAction () {
  return {
    type: actionTypes.CLEAR_TEST_RESULTS
  }
}

export function toggleEditModeAction (id = undefined) {
  return {
    type: actionTypes.TOGGLE_EDIT_MODE,
    id
  }
}

export function changeEdittingTargetAction () {
  return {
    type: actionTypes.CHANGE_EDITTING_TARGET
  }
}

export function saveTrialAction () {
  return {
    type: actionTypes.SAVE_TRIAL
  }
}

export function setTrialNameAction (name) {
  return {
    type: actionTypes.CHANGE_TRIAL_NAME,
    name
  }
}
