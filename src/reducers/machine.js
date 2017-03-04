import { HALT } from '../constants/ReservedWords';
import { REACH_HALT, UNDEFINED_RULE } from '../constants/ErrorMessages';
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

	let new_state = tape.writeIntoTape(state, {val: rule.write});
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
