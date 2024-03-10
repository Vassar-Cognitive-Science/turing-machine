import * as actionTypes from '../constants/ActionTypes'

export function addRowAction (id) {
  return {
    type: actionTypes.ADD_ROW,
    id
  }
}

export function deleteRowAction (id) {
  return {
    type: actionTypes.DELETE_ROW,
    id
  }
}

export function switchRowDirectionAction (id, value) {
  return {
    type: actionTypes.SWITCH_ROW_DIRECTION,
    id,
    value
  }
}

export function setRowInStateAction (id, in_state) {
  return {
    type: actionTypes.SET_ROW_IN_STATE,
    id,
    in_state
  }
}

export function setRowReadAction (id, read) {
  return {
    type: actionTypes.SET_ROW_READ,
    id,
    read
  }
}

export function setRowWriteAction (id, write) {
  return {
    type: actionTypes.SET_ROW_WRITE,
    id,
    write
  }
}

export function setRowNewStateAction (id, new_state) {
  return {
    type: actionTypes.SET_ROW_NEW_STATE,
    id,
    new_state
  }
}

export function moveToAction (from, to) {
  return {
    type: actionTypes.MOVE_TO,
    from,
    to
  }
}
