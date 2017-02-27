import * as actionTypes from '../constants/ActionTypes.js';

export function initMachineAction(tapeSize) {
	return {
		type: actionTypes.INITIALIZAE_MACHINE,
		tapeSize: tapeSize
	};
} 

export function stepAction() {
	return {
		type: actionTypes.STEP_FORWARD
	};
}

