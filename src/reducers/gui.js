import { INIT_HEAD_WIDTH, INIT_HEAD_LEFT_OFFSET } from '../constants/GUISettings';

export const adjustHeadWidth = (state, action) => {
	let textLength = (action.text) ? action.text.length : 0;
	let newWidth, newLeftOffset;
	let defaultTextLength = INIT_HEAD_WIDTH / 10;

	if (textLength <= defaultTextLength) {
		newWidth = INIT_HEAD_WIDTH;
		newLeftOffset = INIT_HEAD_LEFT_OFFSET;
	} else {
		let diff = textLength - defaultTextLength;
		newWidth = INIT_HEAD_WIDTH + 10 * diff;
		newLeftOffset = INIT_HEAD_LEFT_OFFSET - 5 * diff;
	}

	return Object.assign({}, state, {
		headWidth: newWidth,
		headLeftOffset: newLeftOffset
	});
}


export const setPlayState = (state, action) => {
	return Object.assign({}, state, {
		isPaused: action.flag
	});
}

export const setAnimationSpeed = (state, action) => {
	return Object.assign({}, state, {
		animationSpeed: action.percentage
	});
}