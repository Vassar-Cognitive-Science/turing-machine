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

export function step(state, action) {
	if (state.tapeInternalState === HALT) {
		return stop(state, {message: REACH_HALT, flag: true});
	}
	
	/* Find rule by internal state, and val of tape cell*/
	let keyS = state.tapeInternalState, keyV = tape.read(state);
	let rule = null, ruleId = null;
	for (var i = 0; i < state.rowsById.length; i++) {
		let row = state[state.rowsById[i]];
		if (row.in_state === keyS && row.read === keyV) {
			rule = row;
			ruleId = state.rowsById[i];
			break;
		}
	}

	if (rule === null) {
		return stop(state, {message: UNDEFINED_RULE, flag: true});
	}


	let new_state = Object.assign({}, state, {
		runHistory: state.runHistory.slice(),
		highlightedRow: ruleId
	});
	new_state.runHistory.push(cachedLastStep(state, state.tapePointer));

	new_state = tape.writeIntoTape(new_state, {val: rule.write});
	new_state = tape.setInternalState(new_state, {state: rule.new_state});
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

/* SIDE EFFECT HERE!*/
export function clear_Interval(state, action) { // special
	if (state.interval)
		clearInterval(state.interval);
	return state;
}

export function stop(state, action) {
	let new_state = gui.setPlayState(state, {flag: false});
	new_state = tape.highlightCorrespondingCell(new_state, {flag: false});
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

		new_state[tape.standardizeCellId(cached.cachedPointer)] = cached.cachedCell;

		for (var i = 0; i < state.rowsById.length; i++) {
			let row = state.rowsById[i];
			new_state[row] = state[row];
		}

		return stop(new_state, {message: "", flag: false});
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
			highlightCorrespondingCell: cached[0].highlightedCellOrder,
			tapeInternalState: cached[0].tapeInternalState,
			anchorCell: cached[0].anchorCell,
			headWidth: cached[0].headWidth,
			headHeight: cached[0].headHeight,
			headLeftOffset: cached[0].headLeftOffset,
		})

		let i = cached.length - 1, lastStep
		while (i >= 0) {
			lastStep = cached[i];
			new_state[tape.standardizeCellId(lastStep.cachedPointer)] = lastStep.cachedCell; // already cloned
			i--;
		}

		for (var i = 0; i < state.rowsById.length; i++) {
			let row = state.rowsById[i];
			new_state[row] = state[row];
		}

		return stop(new_state, {message: "", flag: false});
	} else {
		return state;
	}
}
