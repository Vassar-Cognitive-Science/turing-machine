import * as actionTypes from '../constants/ActionTypes'

export function adjustHeadWidthAction (text) {
  return {
    type: actionTypes.ADJUST_HEAD_WIDTH,
    text
  }
}

export function setPlayStateAction (flag) {
  return {
    type: actionTypes.SET_PLAY_STATE,
    flag
  }
}

export function setAnimationSpeedAction (percentage) {
  return {
    type: actionTypes.SET_ANIMATION_SPEED,
    percentage
  }
}

export function moveHeadAction (moveLeft) { // moveLeft: boolean
  return {
    type: actionTypes.MOVE_HEAD,
    moveLeft
  }
}

export function resizeScreenAndTapeAction (width) {
  return {
    type: actionTypes.RESIZE_SCREEN_AND_TAPE,
    screenWidth: width
  }
}

export function toggleAnimationAction (flag = undefined) {
  return {
    type: actionTypes.ANIMATION_ON,
    flag
  }
}
