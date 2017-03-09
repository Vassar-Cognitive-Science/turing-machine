import {
	MAX_CELL_NUM,
	MIN_CELL_NUM,
	BREAK_POINT,
	INIT_HEAD_WIDTH,
	INIT_HEAD_LEFT_OFFSET,
	ANIMATION_SPEED,
	HEAD_MOVE_INTERVAL,
  	HEAD_LEFT_BOUNDARY,
} from '../constants/GUISettings';
import { moveLeft, moveRight } from './tape';

/*
Adjust the Head width according to the length of text in it
*/
export function adjustHeadWidth(state, action) {
	let text = (action.text) ? action.text : state.tapeInternalState.toString();
	let textLength = text.length + 2;
	let newWidth, newLeftOffset;
	let defaultTextLength = INIT_HEAD_WIDTH / 10;

	if (textLength <= defaultTextLength - 2) {
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

/* SIDE EFFECT HERE!*/
/* IF THE MACHINE IS RUNNING AND WANTED TO BE STOPPED,
	clearInterval WILL BE CALLED	
*/
export function setPlayState(state, action) {
	if (!action.flag && state.interval) {
		clearInterval(state.interval); 
	}

	return Object.assign({}, state, {
		isRunning: action.flag
	});
}

/*
	Handles speed changes
*/
export function setAnimationSpeed(state, action) {
	return Object.assign({}, state, {
		animationSpeedFactor: action.percentage,
		animationSpeed: ANIMATION_SPEED / action.percentage 
	});
}

/*
	WRAPPER FUNCTION:
	Handles model changes and view changes for Head
*/
export function moveHead(state, action) {
	let new_head_x, new_state;

	// model changes
	if (action.moveLeft) {
		new_head_x = state.headX - HEAD_MOVE_INTERVAL;
		new_state = moveLeft(state);
	} else {
		new_head_x = state.headX + HEAD_MOVE_INTERVAL;
		new_state = moveRight(state);
	}

	// view changes
	return Object.assign({}, new_state, {
		headX: (new_head_x <= new_state.rightBoundary && 
				new_head_x >= HEAD_LEFT_BOUNDARY) ? new_head_x : state.headX
	});
}


/*
Resize the screen and tape according to screen size
newScreenSize * 0.9 - 96; look at tape.css (90% = 0.9 is from class card-of-tape, 96 is the widthes of two buttons)
always center the Head (and tapePointer) to center of the tape by following calculations:

midPoint = cell numbers // 2 (floor it)
headX: left boundary + move_interval * midPointer, --- for correctness, see view
tapePointer: anchor cell + midPointer.  
--- correctness proof: 
	since anchor cell always denotes the id of leftmost cell, then anchor cell + midPointer
	is always the value of the corresponding pointer to the midpoint cell of the tape

General correctness proof:
	And because this reducer only changes:
		cellNum,
		screenSize,
		headX,
		tapePointer,
		rightBoundary,
	We are assured that it won't affect other properties 
*/
export function resizeScreenAndTape(state, action) {
	let newScreenSize = action.screenWidth;
	let newTapeSpace = newScreenSize * 0.91 - 96;
	let newCellNum;
	let new_state = state;

	if (newTapeSpace < BREAK_POINT) {
		let diff = Math.ceil((BREAK_POINT-newTapeSpace)/50)
		newCellNum = MAX_CELL_NUM - diff;
		if (newCellNum <= MIN_CELL_NUM) newCellNum = MIN_CELL_NUM;
	} else {
		newCellNum = MAX_CELL_NUM;
	}

	// console.log(newTapeSpace + " " + newCellNum)
	let midPoint = Math.floor(newCellNum/2);
	return Object.assign({}, new_state, {
		screenSize: newScreenSize,
		cellNum: newCellNum,
		headX: HEAD_LEFT_BOUNDARY + midPoint * HEAD_MOVE_INTERVAL,
		tapePointer: new_state.anchorCell + midPoint,
		rightBoundary: HEAD_LEFT_BOUNDARY + (newCellNum-1) * HEAD_MOVE_INTERVAL,
	});
}