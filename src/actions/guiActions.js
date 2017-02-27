import * as actionTypes from '../constants/ActionTypes.js';


export function adjustHeadWidthAction(text) {
	return {
		type: actionTypes.ADJUST_HEAD_WIDTH,
		text: text
	};
}


export function setPlayStateAction(flag) {
	return {
		type: actionTypes.SET_PLAY_STATE,
		flag: flag
	};
}

export function setAnimationSpeedAction(percentage) {
	return {
		type: actionTypes.SET_ANIMATION_SPEED,
		percentage: percentage
	};
}