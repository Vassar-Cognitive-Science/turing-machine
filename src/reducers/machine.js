import { HALT } from '../constants/ReservedWords';
import { REACH_HALT, UNDEFINED_RULE, NO_MORE_BACK } from '../constants/ErrorMessages';
import * as tape from './tape';
import * as gui from './gui';

const cachedLastStep = (lastState, lastPointer) => {
	return {
		cachedPointer: lastPointer,
		cachedCell: tape.cloneCellById(lastState, lastPointer),
		headX: lastState.headX,
		highlightedRow: lastState.highlightedRow,
		highlightedCellOrder: lastState.highlightedCellOrder,
		tapeInternalState: lastState.tapeInternalState,
		anchorCell: lastState.anchorCell,
		headWidth: lastState.headWidth,
		headHeight: lastState.headHeight,
		headLeftOffset: lastState.headLeftOffset,
	};
}

function reportErrorMessage(state, action) {
	return Object.assign({}, state, {
		machineReportError: action.message,
		showReportedError: action.flag,
	});
}

// Prepare for a step forward
export function preStep(state, action) {
	let new_state;
	if (!action.singleStep)
		new_state = gui.setPlayState(state, { flag: true });
	else
		new_state = state;

	new_state = tape.highlightCorrespondingCell(new_state, { flag: true });

	/* Find rule by internal state, and val of tape cell, and highlight it*/
	new_state = highlightCorrespondingRule(new_state, { flag: true });

	if (new_state.highlightedRow)
		document.getElementById(new_state.highlightedRow).scrollIntoView(true);

	return new_state;
}

export function step(state, action) {
	if (state.tapeInternalState === HALT) {
		return stop(state, {message: REACH_HALT, flag: true});
	}

	let new_state = highlightCorrespondingRule(state, { flag: true });

	if (new_state.highlightedRow === null) {
		return stop(new_state, {message: UNDEFINED_RULE, flag: true});
	}

	document.getElementById(new_state.highlightedRow).scrollIntoView(true);

	new_state = Object.assign({}, new_state, {
		runHistory: new_state.runHistory.slice(),
	});
	new_state.runHistory.push(cachedLastStep(new_state, new_state.tapePointer));

	let rule = new_state[new_state.highlightedRow];
	new_state = tape.writeIntoTape(new_state, {val: rule.write});
	new_state = tape.setInternalState(new_state, {state: rule.new_state});
	new_state = gui.adjustHeadWidth(new_state, {});

	if (rule.isLeft){
		new_state = gui.moveHead(new_state, {moveLeft: true});
	} else {
		new_state = gui.moveHead(new_state, {moveLeft: false});
	}

	return new_state;
}

export function recordInterval(state, action) {
	return Object.assign({}, state, {
		interval: action.interval
	});
}

export function highlightCorrespondingRule(state, action) {
	if (action.rule && action.flag) {
		return Object.assign({}, state, {highlightedRow: action.rule} );
	}

	if (!action.flag) {
		return Object.assign({}, state, { highlightedRow: null });
	}
	let keyS = state.tapeInternalState, keyV = tape.read(state);
	let rule = null;
	for (var i = 0; i < state.rowsById.length; i++) {
		let row = state[state.rowsById[i]];
		if (row.in_state === keyS && row.read === keyV) {
			rule = state.rowsById[i];
			break;
		}
	}

	return Object.assign({}, state, { highlightedRow: rule });
}

/*
Handles what happends when paused

handles clearInterval
cancel highlight on corresponding cell
cancel highlight on corresponding rule
add possible error message
*/
export function stop(state, action) {
	let new_state = gui.setPlayState(state, {flag: false}); 
	new_state = tape.highlightCorrespondingCell(new_state, {flag: false}); 
	new_state = highlightCorrespondingRule(new_state, { flag: false });
	return reportErrorMessage(new_state, action); 
}


export function stepBack(state, action) {
	if (state.runHistory.length > 0) {
		let cached = state.runHistory[state.runHistory.length - 1];

		let new_state = Object.assign({}, state, {
			runHistory: state.runHistory.slice(0, state.runHistory.length - 1),
			rowsById: state.rowsById.slice(),
			highlightedRow: cached.highlightedRow,
			headX: cached.headX,
			tapePointer: cached.cachedPointer,
			highlightedCellOrder: cached.highlightedCellOrder,
			tapeInternalState: cached.tapeInternalState,
			anchorCell: cached.anchorCell,
			headWidth: cached.headWidth,
			headHeight: cached.headHeight,
			headLeftOffset: cached.headLeftOffset,
		})

		// More priority here than undo edit
		new_state[tape.standardizeCellId(cached.cachedPointer)] = cached.cachedCell;

		return new_state;
	}

	return stop(state, {message: NO_MORE_BACK, flag: true});
}

export function restore(state, action) {
	if (state.runHistory.length > 0) {
		let cached = state.runHistory;

		let new_state = Object.assign({}, state, {
			runHistory: [],
			rowsById: state.rowsById.slice(),
			headX: cached[0].headX,
			tapePointer: cached[0].cachedPointer,
			highlightedRow: cached[0].highlightedRow,
			highlightedCellOrder: cached[0].highlightedCellOrder,
			tapeInternalState: cached[0].tapeInternalState,
			anchorCell: cached[0].anchorCell,
			headWidth: cached[0].headWidth,
			headHeight: cached[0].headHeight,
			headLeftOffset: cached[0].headLeftOffset,
		})

		// More priority here than undo edit
		let i = cached.length - 1, lastStep;
		while (i >= 0) {
			lastStep = cached[i];
			new_state[tape.standardizeCellId(lastStep.cachedPointer)] = lastStep.cachedCell; // already cloned
			i--;
		}

		return new_state;
	} else {
		return state;
	}
}
