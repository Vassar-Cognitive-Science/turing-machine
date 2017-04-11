import {
	MAX_CELL_NUM,
	MIN_CELL_NUM,
	TAPE_BREAK_POINT,
	ANIMATION_SPEED,
} from '../constants/GeneralAppSettings';
import {
	INIT_HEAD_WIDTH,
	INIT_HEAD_LEFT_OFFSET,
	HEAD_MOVE_INTERVAL,
	HEAD_LEFT_BOUNDARY,
} from '../constants/components/Head';
import {
	moveLeftHelper,
	moveRightHelper,
	moveTapeRightHelper,
	moveTapeLeftHelper
} from './tape';

// define helper to optimize performance
export function adjustHeadWidthHelper(state, text) {
	text = (text) ? text : state.tapeInternalState.toString();
	// leave some white space
	let textLength = text.length + 2;

	let newWidth, newLeftOffset;
	// each char is of width 10px
	let defaultTextLength = INIT_HEAD_WIDTH / 10;

	// if < default text length
	// set head view to initial head view
	let charSize = 11;
	if (textLength < defaultTextLength) {
		newWidth = INIT_HEAD_WIDTH;
		newLeftOffset = INIT_HEAD_LEFT_OFFSET;
	} else {
		// else expand head
		let diff = textLength - defaultTextLength;
		newWidth = INIT_HEAD_WIDTH + charSize * diff;
		newLeftOffset = INIT_HEAD_LEFT_OFFSET - (charSize/2) * diff;
	}

	state.headWidth = newWidth;
	state.headLeftOffset = newLeftOffset;

	return state;
}

/*
Adjust the Head width according to the length of text in it

*** NOTE ***: It is wrapped in tape.setInternalState
*/
export function adjustHeadWidth(state, action) {
	let new_state = Object.assign({}, state);

	return adjustHeadWidthHelper(new_state, action.text);
}

export function setPlayStateHelper(state, flag) {
	if (!flag && state.interval) {
		clearInterval(state.interval);
	}

	state.isRunning = flag;
	state.interval = (flag) ? state.interval : null;

	return state;
}

/* SIDE EFFECT HERE!*/
/* IF THE MACHINE IS RUNNING AND WANTED TO BE STOPPED,
	clearInterval WILL BE CALLED	

action.flag: bool, true means the machine is running 

*/
export function setPlayState(state, action) {
	let new_state = Object.assign({}, state);

	return setPlayStateHelper(new_state, action.flag);
}

/*
	Handles speed changes
*/
export function setAnimationSpeed(state, action) {
	return Object.assign({}, state, {
		// update factor
		animationSpeedFactor: action.percentage,
		// calculate speed, not necessary, but would be handy to define it
		animationSpeed: ANIMATION_SPEED / action.percentage
	});
}

export function moveHeadHelper(state, moveLeft) {
	let new_head_x;

	if (moveLeft) {
		// view change
		new_head_x = state.headX - HEAD_MOVE_INTERVAL;
		// model change
		state = moveLeftHelper(state);
	} else {
		new_head_x = state.headX + HEAD_MOVE_INTERVAL;
		state = moveRightHelper(state);
	}

	// if headX exceeds boundary, don't change it!
	state.headX = (new_head_x <= state.rightBoundary &&
		new_head_x >= HEAD_LEFT_BOUNDARY) ? new_head_x : state.headX;

	return state;
}

/*
	WRAPPER FUNCTION:
	Handles model changes and view changes for Head
*/
export function moveHead(state, action) {
	let new_state = Object.assign({}, state, {
		tapeCellsById: state.tapeCellsById.slice()
	});

	return moveHeadHelper(new_state, action.moveLeft);
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
	let newTapeSpace = newScreenSize * 0.9 - 96;
	let newCellNum;
	let new_state = state;

	if (newTapeSpace < TAPE_BREAK_POINT) {
		let diff = Math.ceil((TAPE_BREAK_POINT - newTapeSpace) / 50)
		newCellNum = MAX_CELL_NUM - diff;
		if (newCellNum <= MIN_CELL_NUM) newCellNum = MIN_CELL_NUM;
	} else {
		newCellNum = MAX_CELL_NUM;
	}

	if (newCellNum === state.cellNum) return new_state;

	let originalPointer = new_state.tapePointer;

	let midPoint = Math.floor(newCellNum / 2);
	new_state = Object.assign({}, new_state, {
		screenSize: newScreenSize,
		cellNum: newCellNum,
		headX: HEAD_LEFT_BOUNDARY + midPoint * HEAD_MOVE_INTERVAL,
		tapePointer: new_state.anchorCell + midPoint,
		rightBoundary: HEAD_LEFT_BOUNDARY + (newCellNum - 1) * HEAD_MOVE_INTERVAL,
	});


	let offset = new_state.tapePointer - originalPointer;
	let moveLeft;
	if (offset < 0) { // need move right
		offset = -offset;
		moveLeft = false;
	} else { // need move left
		moveLeft = true;
	}

	while (offset--) {
		if (moveLeft)
			new_state = moveTapeLeftHelper(new_state);
		else
			new_state = moveTapeRightHelper(new_state);
	}

	new_state.highlightedCellOrder = -1; // cancel any highlight 

	return new_state;
}

export function toggleTrialDrawer(state, action) {
	let flag = (action.flag !== undefined) ? action.flag : !state.trialDrawerToggle;
	return Object.assign({}, state, {
		trialDrawerToggle: flag,
	});
}

export function toggleAnimation(state, action) {
	let flag = (action.flag !== undefined) ? action.flag : !state.animationOn;
	return Object.assign({}, state, {
		animationOn: flag
	});
}