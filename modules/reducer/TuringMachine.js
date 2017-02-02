import {DLNode, DoublyLinkedList} from './lib/DoublyLinkedList.js';
import * as TuringMachineModel from '../TuringMachineModel.js';

const initialState = {
	/* Tape and Head
	tapePointer: 0,
	tapeCells: new DoublyLinkedList(),
	tapeInternalState: null,
	*/
	tape: new TuringMachineModel.Tape(),

	rules: new TuringMachineModel.Transition_Graph()
};

