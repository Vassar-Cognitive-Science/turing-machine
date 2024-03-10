import * as actionTypes from '../constants/ActionTypes'

export function writeIntoTapeAction (val = null) {
  return {
    type: actionTypes.WRITE_INTO_TAPE,
    val
  }
}

export function initializeTapeAction (controlled) {
  return {
    type: actionTypes.INITIALIZAE_TAPE,
    controlled
  }
}

export function fillTapeAction (position, val = null) {
  return {
    type: actionTypes.FILL_TAPE,
    position,
    val
  }
}

export function moveTapeRightAction () {
  return {
    type: actionTypes.MOVE_TAPE_RIGHT
  }
}

export function moveTapeLeftAction () {
  return {
    type: actionTypes.MOVE_TAPE_LEFT
  }
}

export function setInternalStateAction (state) {
  return {
    type: actionTypes.SET_INTERNAL_STATE,
    state
  }
}

export function moveLeftAction () {
  return {
    type: actionTypes.SHIFT_TAPE_POINTER_LEFT
  }
}

export function moveRightAction () {
  return {
    type: actionTypes.SHIFT_TAPE_POINTER_RIGHT
  }
}

export function highlightCorrespondingCellAction (flag) {
  return {
    type: actionTypes.SET_CORRES_CELL_HEIGHT,
    flag
  }
}

export function highlightCellAtAction (order) {
  return {
    type: actionTypes.HIGHLIGHT_CELL_AT,
    order
  }
}
