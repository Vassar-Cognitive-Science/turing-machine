import { HALT, STAR } from '../constants/SpecialCharacters';
import {
	REACH_HALT,
	UNDEFINED_RULE,
	NO_MORE_BACK,
	EXCEED_MAX_STEP_LIMIT,
	RULE_TABLE_ERROR,
	IS_IN_EDITTING_ERROR
} from '../constants/Messages';
import { MAX_STEP_LIMIT } from '../constants/GeneralAppSettings';
import * as tape from './tape';
import * as gui from './gui';


// import insertState from '../database';

/*
Helper function that matches in_state and read to rule, and return its id.
Parameter:
state --- a state object from store
in_state --- string
read --- string, (should be from tape.read function

**** Responsible for handling special character * Here **** 
*/

// specific first

export function matchRule(state, in_state, read) {
	let ruleId = null;

	for (var i = 0; i < state.rowsById.length; i++) {
		let row = state[state.rowsById[i]];
		if (row.in_state === in_state) { 

			if (row.read === read) { // match read
				ruleId = state.rowsById[i];
				break;
			} else if (row.read === STAR) { // handles *
				ruleId = state.rowsById[i];
				continue;
			}

		}
	}

	return ruleId;
}

/*
Helper function that saves relevant data to restore to last step
save the following data

*** MODEL INFO ***
tapePointer
tape cell
tape internal state

tape head
tape tail
tape cell id array
anchor cell

step count

*** GUI INFO ***
headX, head position
headWidth
headLeftOffset

highlighted rule (row) id
highlighted cell order


*/
const cachedLastStep = (lastState) => {
	return {
		highlightedRow: lastState.highlightedRow,
		highlightedCellOrder: lastState.highlightedCellOrder,
		
		headX: lastState.headX,
		headWidth: lastState.headWidth,
		headLeftOffset: lastState.headLeftOffset,


		stepCount: lastState.stepCount,

		tapeInternalState: lastState.tapeInternalState,
		cachedPointer: lastState.tapePointer,
		cachedCell: tape.cloneCellById(lastState, lastState.tapePointer),

		anchorCell: lastState.anchorCell,
		tapeHead: lastState.tapeHead,
		tapeTail: lastState.tapeTail,
		tapeCellsById: lastState.tapeCellsById.slice(),
	};
}



/*
Prepare for a step forward
Check all rules validity
Set play button according to if it is a single step
Highlight Corresponding Cell
Highlight Corresponding Rule
*/
export function preStep(state, action) {
	if (state.isEdittingTrial)
		return stop(state, {message: IS_IN_EDITTING_ERROR, flag: true});

	let new_state = Object.assign({}, state);
	if (!action.singleStep) {// if we want run automatically
		new_state = gui.setPlayStateHelper(new_state, true); 
	} else {// if we want only a single step 
		new_state = state;
	}

	if (new_state.isAnimationOn)
		return new_state;

	// highlight corresponding cell
	new_state = tape.highlightCorrespondingCellHelper(new_state, true);

	/* Find rule by internal state, and val of tape cell, and highlight it*/
	new_state = highlightCorrespondingRuleHelper(new_state, true);

	// scroll into view
	// if (new_state.highlightedRow)
	// 	document.getElementById(new_state.highlightedRow).scrollIntoView(false);

	return new_state;
}

/*
Step forward
Find rule (handled by highlightCorrespondingRule)
If not find, stop

Push cachedLastStep to runHistory
Write value into tape
Set internal state
Adjust head width
Move Head according to rule.isLeft 
*/
export function stepHelper(state, silent) { // optimize performance
	if (state.machineLocked) {
		return stop(state, {message: RULE_TABLE_ERROR, flag: true});
	}

	// is machine halted?
	if (state.tapeInternalState === HALT) {
		return stop(state, {message: REACH_HALT, flag: true});
	}

	// is there too many steps?
	if (state.stepCount > MAX_STEP_LIMIT) {
		return stop(state, {message: EXCEED_MAX_STEP_LIMIT, flag: true});
	}

	let highlightedRow = matchRule(state, state.tapeInternalState, tape.read(state));

	// is the rule we want defined?
	if (highlightedRow === null) {
		return stop(state, {message: UNDEFINED_RULE, flag: true});
	}

	// are we running without animation?
	// if (!silent) {
	// 	// if with animation, scroll to the highlighted rule
	// 	document.getElementById(highlightedRow).scrollIntoView(false);
	// }

	// cache history, and highlight rule
	state.highlightedRow = highlightedRow;
	state.runHistory.push(cachedLastStep(state)); // memeroy bottleneck

	// find the rule data
	let rule = state[state.highlightedRow];
	// write into tape
	state = tape.writeIntoTapeHelper(state, state.tapePointer, rule.write);
	// set state (and new head width, handled in this reducer)
	state = tape.setInternalStateHelper(state, rule.new_state);

	// move head
	if (rule.isLeft){
		state = gui.moveHeadHelper(state, true);
	} else {
		state = gui.moveHeadHelper(state, false);
	}

	// count step
	state.stepCount++;
	
	return state;
}

export function step(state, action) {
	if (state.isEdittingTrial)
		return stop(state, {message: IS_IN_EDITTING_ERROR, flag: true});

	let new_state = Object.assign({}, state, {
		runHistory: state.runHistory.slice(),
		tapeCellsById: state.tapeCellsById.slice()
	})
	
	return stepHelper(new_state, action.silent);
}

/*
Run with out animation
*/
export function silentRun(state, action) {
	if (state.isEdittingTrial)
		return stop(state, {message: IS_IN_EDITTING_ERROR, flag: true});

	let new_state = Object.assign({}, state, {
		runHistory: state.runHistory.slice()
	})
	while (new_state.isRunning) {
		new_state = stepHelper(new_state, true);
	}
	return new_state;
}

/*
Record interval
*/
export function recordInterval(state, action) {
	return Object.assign({}, state, {
		interval: action.interval
	});
}


export function highlightCorrespondingRuleHelper(state, flag, rule) {
	// highlight wanted rule directly
	if (rule && flag) {
		state.highlightedRow = rule;
		return state;
	}

	// cancel highlight
	if (!flag) {
		state.highlightedRow = null;
		return state;
	}

	// highlight corresponding rule
	let ruleId = matchRule(state, state.tapeInternalState, tape.read(state));

	state.highlightedRow = ruleId;

	return state;
}

/*
Highlight Corresponding Rule
*/
export function highlightCorrespondingRule(state, action) {
	let new_state = Object.assign({}, state);

	return highlightCorrespondingRuleHelper(new_state, action.flag, action.rule);
}



/*
Handles what happends when paused

handles clearInterval
cancel highlight on corresponding cell
cancel highlight on corresponding rule
add possible error message
*/
export function stop(state, action) {
	let new_state = Object.assign({}, state);

	// change pause sign to play
	// clear time interval, handled already in the called reducer helper 
	new_state = gui.setPlayStateHelper(new_state, false); 

	// cancel highlights
	new_state = tape.highlightCorrespondingCellHelper(new_state, false); 
	new_state = highlightCorrespondingRuleHelper(new_state, false);

	// report error, if there is
	new_state.machineReportError = action.message;
	new_state.showReportedError = action.flag
	return new_state; 
}

/*
Restore to last step
Data is fetched from runHistory 
*/
export function stepBack(state, action) {
	if (state.isEdittingTrial)
		return stop(state, {message: IS_IN_EDITTING_ERROR, flag: true});

	if (state.runHistory.length > 0) {
		let cached = state.runHistory[state.runHistory.length - 1];

		// restore to last step
		let new_state = Object.assign({}, state, {
			// General
			stepCount: cached.stepCount,

			// run history
			runHistory: state.runHistory.slice(0, state.runHistory.length - 1),

			// GUI
			highlightedRow: cached.highlightedRow,
			highlightedCellOrder: cached.highlightedCellOrder,
			headX: cached.headX,
			headWidth: cached.headWidth,
			headLeftOffset: cached.headLeftOffset,

			// Head
			tapePointer: cached.cachedPointer,
			tapeInternalState: cached.tapeInternalState,

			// Tape
			anchorCell: cached.anchorCell,
			tapeHead: cached.tapeHead, // since only step back, restore control tape
			tapeTail: cached.tapeTail,
			tapeCellsById: cached.tapeCellsById.slice(),
		})

		// More priority here than undo edit
		new_state[tape.standardizeCellId(cached.cachedPointer)] = cached.cachedCell;

		// delete this cell if necessary
		if (!new_state.tapeCellsById.includes(tape.standardizeCellId(state.tapePointer)))
			delete new_state[tape.standardizeCellId(state.tapePointer)];

		return new_state;
	}

	// automatically stop
	return stop(state, {message: NO_MORE_BACK, flag: true});
}


/*
Restore to first step
Data is fetched from runHistory (by pop)
---Preserve edited rules (if there are changes)
---More priority here than undo edit
*/
export function restore(state, action) {
	if (state.isEdittingTrial)
		return stop(state, {message: IS_IN_EDITTING_ERROR, flag: true});

	if (state.runHistory.length > 0) { // if there is some history
		let cached = state.runHistory;

		let new_state = Object.assign({}, state, {
			// General
			stepCount: cached[0].stepCount,

			// run history
			runHistory: [],

			// GUI
			highlightedRow: cached[0].highlightedRow,
			highlightedCellOrder: cached[0].highlightedCellOrder,
			headX: cached[0].headX,
			headWidth: cached[0].headWidth,
			headLeftOffset: cached[0].headLeftOffset,

			// Head
			tapePointer: cached[0].cachedPointer,
			tapeInternalState: cached[0].tapeInternalState,

			// Tape
			anchorCell: cached[0].anchorCell,
			tapeHead: cached[0].tapeHead, // since only step back, restore control tape
			tapeTail: cached[0].tapeTail,
			tapeCellsById: cached[0].tapeCellsById.slice(),
		})

		// More priority here than undo edit, discarded
		// restore to the very first point, step by step
		let i = cached.length - 1, lastStep;
		while (i >= 0) {
			lastStep = cached[i];
			let id = tape.standardizeCellId(lastStep.cachedPointer);
			if (new_state.tapeCellsById.includes(id)) // if we need this cell
				new_state[id] = lastStep.cachedCell; // already cloned
			else
				delete new_state[id];
			i--;
		}

		return new_state;
	} else {
		return state;
	}
}

export function goodMachineSave(state, action) {
	let new_state = Object.assign({}, state);

	new_state.anyChangeInNormal = false;
	history.pushState(null, null, '/' + action.url);

	return new_state;
} 