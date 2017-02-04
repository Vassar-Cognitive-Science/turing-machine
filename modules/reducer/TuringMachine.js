import * as tape from './Tape.js';
import * as rules from './Rules.js';
import * as TuringMachineModel from '../TuringMachineModel.js';


const HALT = "H";
const _INITIAL_TAPE_SIZE = 21;
const initialState = {
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
}

const initialize = (state = initialState, action) => {
	return tape.initializeTap(state, action);
}


/*
step: function() {
	if (this.isHalted())
		return;

	if (this.head.getState() == null) {
		throw HEAD_STATE_NULL_ERROR;
	}
	var edge = this.getRule(this.head.getState(), this.head.read());
	if (edge == null) {
		throw NO_SUCH_RULE_ERROR;
	}
	this.head.writeAndMove(edge.write, edge.direction)
	this.head.setState(edge.target.state);
},

run: function() {

	while (!this.isHalted()) {
		this.step();
	}

}
*/
