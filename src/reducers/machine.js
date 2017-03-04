import { HALT } from '../constants/ReservedWords';
import { REACH_HALT, UNDEFINED_RULE, NO_MORE_BACK } from '../constants/ErrorMessages';
import * as tape from './tape';
import * as gui from './gui';


export function step(state, action) {
	if (state.tapeInternalState === HALT) {
		return stop(state, {message: REACH_HALT, flag: true});
	}
	
	/* Find rule by internal state, and val of tape cell*/
	let keyS = state.tapeInternalState, keyV = tape.read(state);
	let rule = null;
	for (var i = 0; i < state.rowsById.length; i++) {
		let row = state[state.rowsById[i]];
		if (row.in_state === keyS && row.read === keyV) {
			rule = row;
			break;
		}
	}

	if (rule === null) {
		return stop(state, {message: UNDEFINED_RULE, flag: true});
	}

	let new_state = Object.assign({}, state, {
		runHistory: state.runHistory.slice(),
		runCount: state.runCount+1,
		lastRun: state,
	});
	new_state.runHistory.push(new_state.runCount);

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
	new_state = tape.setCorrespondingCellHighlight(new_state, {flag: false});
	return Object.assign({}, new_state, {
		machineReportError: action.message,
		showReportedError: action.flag,
	})
}

export function stepBack(state, action) {
	if (state.lastRun) {
		let new_state = Object.assign({}, state.lastRun, {
			lastRun: (state.lastRun) ? state.lastRun.lastRun : null,
			runCount: (state.runCount > 0) ? state.runCount - 1 : 0,
			runHistory: state.runHistory.slice(0, state.runHistory.length - 1),
		})

		return new_state;
	}

	return stop(state, {message: NO_MORE_BACK, flag: true});
}

export function restore(state, action) {
	if (state.lastRun) {
		let tmp = state;
		while (tmp.lastRun) {
			tmp = tmp.lastRun
		}

		return stop(tmp, {message: "", flag: false});
	} else {
		return state;
	}
}