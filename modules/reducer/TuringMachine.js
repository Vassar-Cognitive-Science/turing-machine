import * as TuringMachineModel from '../TuringMachineModel2.js';

export const initialState = {
	tape: new TuringMachineModel.Tape(),
	rules: new TuringMachineModel.Transition_Graph()
};

export const test = TuringMachineModel.LEFT;