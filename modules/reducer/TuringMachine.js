
import * as Tape from './TapeHelpers.js';
import * as TuringMachineModel from '../TuringMachineModel.js';


export const HALT = "H";


const initialState = {
	// Tape 
	tape: Tape.createTape(),
	
	// Rules
	rules: new TuringMachineModel.Transition_Graph()
};