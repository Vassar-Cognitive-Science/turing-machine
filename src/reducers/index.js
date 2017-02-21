import * as tape from './tape';
import * as rules from './rule';
import * as reservedWords from '../constants/ReservedWords';
import * as actionTypes from '../constants/ActionTypes';

export const initialState = {
	fire: 0,

	/* Tape and Head */
	tapeHead: 0,
	tapeTail: 0,
	tapePointer: 0,
	tapeCellsById: [],
	tapeInternalState: null,
	/* Tape and Head */

	/* Rules */
	rulesById: []
	/* Rules */
};


const fire = (state, action) => {
	return {
		fire: state.fire +1,
		...state
	}
}

const initializeMachine = (state, action) => {
	return initialState;
}

const step = (state, action) => {
	if (state.tapeInternalState === reservedWords.HALT)
		return state;

	var rule = rules.findRule(state, state.tapeInternalState, tape.read(state));
	if (rule === null)
		return state;

	return tape.writeAndMove(state, {
		direction: rule.direction,
		new_state: rule.new_state,
		val: rule.write
	});
}

export default function(state=initialState, action) {
	switch (action.type) {
		case actionTypes.FIRE:
			return fire(state, action);
		/* Machine actions */
		case actionTypes.INITIALIZAE_MACHINE:
			return initializeMachine(state, action);
		case actionTypes.STEP_FORWARD:
			return step(state, action);
		/* Machine actions */

		/* Tape actions */
		case actionTypes.MOVE_TAPE_RIGHT:
			return tape.moveTapeRight(state, action);
		case actionTypes.MOVE_TAPE_LEFT:
			return tape.moveTapeLeft(state, action);
		case actionTypes.FILL_TAPE:
			return tape.fillTape(state, action);
		case actionTypes.INSERT_CELL_BEFORE_HEAD:
			return tape.insertCellBeforeHead(state, action);
		case actionTypes.APPEND_CELL_AFTER_TAIL:
			return tape.appendCellAfterTail(state, action);
		case actionTypes.WRITE_INTO_TAPE:
			return tape.writeIntoTape(state, action);
		case actionTypes.INITIALIZAE_TAPE:
			return tape.initializeTape(state, action);
		case actionTypes.SET_INTERNAL_STATE:
			return tape.setInternalState(state, action);
		case actionTypes.SHIFT_TAPE_POINTER_LEFT:
			return tape.moveLeft(state, action);
		case actionTypes.SHIFT_TAPE_POINTER_RIGHT:
			return tape.moveRight(state, action);
		/* Tape actions */

		/* Rule actions */
		case actionTypes.ADD_RULE:
			return rules.addRule(state, action);
		case actionTypes.SET_RULE:
			return rules.setRule(state, action);
		case actionTypes.DELETE_RULE:
			return rules.deleteRule(state, action);
		/* Rule actions */
		default:
			return state;
	}
}
