import * as tape from './tape';
import * as gui from './gui';
import { EXCEED_MAX_TEST_STEP_LIMIT, DIFF_FINAL_STATE, DIFF_FINAL_TAPE } from '../constants/Messages';

import { HALT } from '../constants/SpecialCharacters';
import { MAX_TEST_STEP_LIMIT } from '../constants/GeneralAppSettings';
import { matchRule } from './machine';

/*
const sandbox = {
	stepCount: 0,
	tapeHead: 0, 
	tapeTail: 0, 
	tapePointer: 0, 
	tapeCellsById: [], 
	tapeInternalState: null, 
}
*/

export const STATUS = ["WAITING", "PASS", "FAIL", "TIMEOUT"];
export const STATUS_CODE_WAITING = 0;
export const STATUS_CODE_PASS = 1;
export const STATUS_CODE_FAIL = 2;
export const STATUS_CODE_TIMEOUT = 3;

// generate id
export const standardizeTestReportId = (id) => "Report-of-" + id;

// generate string that describes step counts
const traceSuccessTrialStep = (step) => {
	if (step > 1)
		return step + " steps";
	return step + " step";
}

// see if result is as expected
const isExpected = (sandbox, trial) => {
	let result = {
		status: STATUS_CODE_PASS,
		feedback: "",
	};

	if (sandbox.tapeInternalState !== trial.expectedState) {
		result.status = STATUS_CODE_FAIL;
		result.feedback = DIFF_FINAL_STATE; 
		return result;
	}

	let expectedTape = tape.strip(trial.expectedTape);
	let resultedTape = tape.strip(tape.tapeToArray(sandbox));
	if (expectedTape.length !== resultedTape.length) {
		result.status = STATUS_CODE_FAIL;
		result.feedback = DIFF_FINAL_TAPE;
		return result;
	}
	
	for (let i = 0; i < expectedTape.length; i++) {
		if (expectedTape[i].toString() !== resultedTape[i].toString()) {
			result.status = STATUS_CODE_FAIL;
			result.feedback = DIFF_FINAL_TAPE;
			return result;
		}
	}

	result.feedback = traceSuccessTrialStep(sandbox.stepCount);
	return result;
}


/*
{
	startState: string,
	expectedState: string,

	startPointer: number,

	// the anchor cell of start tape is always set to be 0
	startTape: array,
	expectedTape: array,

	expectedAnchorCell: number (optional, default is 0), // tells where we start to compare expected to result
	expectedPointer: number (optional, default is same as expectedAnchorCell)
}
*/


// create a trial object
function createTrial(id, 
					startState, 
					startTape, 
					expectedTape,
					tapePointer, 
					expectedTapePoiner, // optional, automatically handled
					startTapeHead,
					expectedTapeHead, // optional, automatically handled
					name
					) {

	let pointer = (tapePointer !== undefined && tapePointer !== null) ? tapePointer : 0;

	return {
		id: id,
		// record name 
		name: (name) ? name : id,

		startState: (startState) ? startState : "0",
		expectedState: HALT,
		startTape: (startTape) ? startTape : [],
		expectedTape: (expectedTape) ? expectedTape : [],

		// start Head pointer
		tapePointer: pointer,
		// expected Head pointer, not required
		expectedTapePoiner: (expectedTapePoiner !== undefined && expectedTapePoiner !== null) ? expectedTapePoiner : pointer,


		// tape head
		startTapeHead: (startTapeHead !== undefined && startTapeHead !== null) ? startTapeHead : 0,
		// not required
		expectedTapeHead: (expectedTapeHead !== undefined && expectedTapeHead !== null) ? expectedTapeHead : 0,

		// auto generate corresponding test report id
		testReportId: standardizeTestReportId(id), 
	};
}

export function cloneTrial(trial) {
	return {
		id: trial.id,
		name: trial.name,
		
		startState: trial.startState,
		expectedState: trial.expectedState,
		startTape: trial.startTape.slice(),
		expectedTape: trial.expectedTape.slice(),

		tapePointer: trial.tapePointer,
		expectedTapePoiner: trial.expectedTapePoiner,


		startTapeHead: trial.startTapeHead,
		expectedTapeHead: trial.expectedTapeHead,

		testReportId: trial.testReportId,
	};
}

function createTestReport(sourceId, name, statusCode, feedback, stepCount, id) {
	return {
		// trial id
		sourceId: sourceId,
		// source file
		name: name,
		// result 
		status: statusCode,
		// short feedback
		feedback: feedback,
		// counts of steps
		stepCount: stepCount,
		// self id
		id: id,
	}
}

/*
Create a fit sandbox from Trial Object
*/
function createSandbox(trial) {
	let sandbox = {
		stepCount: 0,
		anchorCell: 0,
		tapeHead: 0,
		tapeTail: 0,
		tapeCellsById: [],
		tapePointer: trial.tapePointer,
		tapeInternalState: trial.startState
	};
	// load tape
	for (let i = 0; i < trial.startTape.length; i++) {
		let val = trial.startTape[i];
		sandbox = tape.appendAfterTail(sandbox, { val: val });
	}

	// expand to right size
	let expandTo = trial.tapePointer;
	if (expandTo < 0) {
		// for extra space, notice N must be greater the expandTo
		sandbox = tape.expandBeforeHead(sandbox, { n: -expandTo + 5}); 
	} else if (expandTo > 0) {
		expandTo -= trial.startTape.length;
		if (expandTo > 0) {
			// for extra space, notice N must be greater the expandTo
			sandbox = tape.expandAfterTail(sandbox, {n: expandTo + 5});
		}
	}

	return sandbox;
}

/*
Delete trial
	delete Trial object
	delete Test report
*/
export function deleteTrial(state, action) {
	let new_state = Object.assign({}, state, {
		testsById: state.testsById.filter(tid => tid !== action.id)
	})

	let testReportId = new_state[action.id].testReportId;
	if (new_state[testReportId])
		delete new_state[testReportId];
	delete new_state[action.id];

	return new_state;
}

/*
Add a trial
	add Trial object
*/
export function addTrial(state, action) {
	if (state[action.id] !== undefined) return state;

	let new_state = Object.assign({}, state, {
		testsById: state.testsById.slice()
	})

	new_state.testsById.push(action.id);
	let trial = createTrial(action.id, 
							action.startState, 
							action.startTape,  
							action.expectedTape,
							action.tapePointer, 
							action.expectedTapePoiner,
							action.startTapeHead,
							action.expectedTapeHead,
							action.name);

	new_state[action.id] = trial;

	return new_state;
}


export function setTrialName(state, action) {
	return Object.assign({}, state, {
		edittingTrialName: action.name
	})
}

/*
Handles what to do before a trial runs
1. Clear previous test report if this trial is runned
2. (Seperately defined from runTrial so that there is) visual effect
*/
export function preRunTrial(state, action) {
	let new_state = Object.assign({}, state, {
		runningTrials: state.runningTrials.slice()
	});

	new_state.runningTrials.push(action.id);
	let testReportId = new_state[new_state[action.id].testReportId];
	delete new_state[testReportId];

	return new_state;
}

/*
Run the rules in sandbox
*/
export function runTrial(state, action) {
	let trial = state[action.sourceId];

	let sandbox = createSandbox(trial);
	while (sandbox.tapeInternalState !== HALT) {

		// check for infinite loop, if reach max step limit, generate report
		if (sandbox.stepCount > MAX_TEST_STEP_LIMIT) {
			return reportTestResult(state, {
				sourceId: action.sourceId,
				name: trial.name,
				status: STATUS_CODE_TIMEOUT,
				feedback: EXCEED_MAX_TEST_STEP_LIMIT,
				stepCount: sandbox.stepCount,
			});
		}

		// match rule
		let ruleId = matchRule(state, sandbox.tapeInternalState, tape.read(sandbox))
		if (ruleId === null) {
			break;
		}
		let rule = state[ruleId];

		// run
		// update tape
		sandbox = tape.writeIntoTapeHelper(sandbox, sandbox.tapePointer, rule.write); // writeIntoTape will handle special chars
		// update head state
		sandbox.tapeInternalState = rule.new_state; 
		// move
		if (rule.isLeft){
			sandbox = tape.moveLeftHelper(sandbox);
		} else {
			sandbox = tape.moveRightHelper(sandbox);
		}

		// count step
		sandbox.stepCount++;
	}

	// test if machine gives expected results
	let result = isExpected(sandbox, trial);

	// generate report
	return reportTestResult(state, {
		sourceId: action.sourceId,
		name: trial.name,
		status: result.status,
		feedback: result.feedback,
		stepCount: sandbox.stepCount,
	});
}


export function reportTestResult(state, action) {
	let new_state = Object.assign({}, state, {
		runningTrials: state.runningTrials.filter(tid => tid !== action.sourceId),
		// isRunningTrial: false,
	});

	let id = standardizeTestReportId(action.sourceId);
	new_state[id] = createTestReport(
									action.sourceId, // trial id
									action.name, // trial file
									action.status,  // statue
									action.feedback, // feedback
									action.stepCount, // total steps experienced
									id // testReport id
									);
	return new_state;
}

/*
General: 
	This function loads trial data into machine
		Move head to where it should be
		Start filling tape at 0

	What we will finally see in the GUI depends on where the head is 
*/
export function loadTrial(state, action) {
	let trial = state[action.id];
	let startTape = createTapeFromTrial(trial, true);

	let new_state = Object.assign({}, state);

	return loadTrialTapeHelper(new_state, startTape);
}

export function toggleIsRunningTrial(state, action) {
	// can be set by programmer or set defaultly by "toggling"
	let flag = (action.flag !== undefined) ? action.flag : !state.flag;

	return Object.assign({}, state, {
		isRunningTrial: flag
	});
}


export function clearTestResults(state, action) {
	let new_state = Object.assign({}, state);

	// clear test results
	for (let i = 0; i < new_state.testsById.length; i++) {
		// retreive test report id from Trial object
		let testReportId = new_state[new_state.testsById[i]].testReportId;

		// delete test report
		delete new_state[testReportId];
	}

	return new_state;
}

/*
Flow chart of entering, and exiting edit mode:

			 (a)						(b0)    (b1) (b2)  			(c)
Normal mode  ---> Enter edit mode  ---> swap, edit, save tapes  ---> Exit edit mode
			call 								call 					call
 createTapeFromTrial 					    loadTrialTapeHelper      tape.extractTape
 (convert from trial file) 	(further process what we get from trial file)

 tape.extractTape							tape.extractTape		 tape.loadTape

(a): The following is handled by toggleEditMode(state, action):
		 toggle state.isEdittingTrial to true,
		 record down the selected trial id into state.edittingTrialId
		 always starts with startTape
		 
		 Then, we record the tape from normal mode into state.originalTape
		 and we create two tapes, startTape and expectedTape from the selected trial
		 Finally, we load the startTape into the presentation tape

(b): 0. Change editting target, handled by changeEdittingTarget(state, action):
		 toggle state.isEdittingExpectedTape
		 if we are editting epectedTape:
		 	We set target = state.edittingExpectedTape
		 	We then record the current tape into state.edittingStartTape
		 	(by tape.extractTape)
		 	Finally, we load the target into the presentational tape
		 else
		    similar process as above
	
	1. Edit, handled in reducers/index.js:
			If any changes are made to the tape, state.anyChangeInTrial will
			be toggled to true

	2. Save, handled by saveTrial(state, action):
		if we are editting epectedTape:
			We need to update state.edittingExpectedTape from the current tape
		else
			We need to update state.edittingStartTape from the current tape

		Then, we call saveTrialHelper, which will update the following from
		state.edittingStartTape and state.edittingExpectedTape:
		
		startTapeHead: number,
		startTape: array,
		startState: string,

		expectedTapeHead: number,
		expectedTape: array,

		tapePointer: number,
		expectedTapePointer: number,

(c): Exit edit mode, handled by toggleEditMode(state, action):
		toggle state.isEdittingTrial to false,
		set state.edittingTrialId to null

		Then, we set:
			state.originalTape = null;
			state.edittingStartTape = null;
			state.edittingExpectedTape = null;
		to allow garbage collection

		Finally we load back state.originalTape into the presentational tape
		and delete former test resport (if there is one).
*/


export function toggleEditMode(state, action) {
	let isEdittingTrial = !state.isEdittingTrial;
	let new_state = Object.assign({}, state, {
		// toggle isEdittingTrial
		isEdittingTrial: isEdittingTrial, 
		// always starts with startTape
		isEdittingExpectedTape: false, 
		anyChangeInTrial: false,
	});

	if (isEdittingTrial) { 
		// record down the selected trial id
		new_state.edittingTrialId = action.id;
		let trial = new_state[action.id];

		new_state.edittingTrialName = trial.name;

		// we record the tape from normal mode
		new_state.originalTape = tape.extractTape(new_state); 
		// we create two tapes, startTape and expectedTape from the selected trial
		new_state.edittingStartTape = createTapeFromTrial(trial, true);
		new_state.edittingExpectedTape = createTapeFromTrial(trial, false);

		// Finally, we load the startTape into the presentation tape
		return loadTrialTapeHelper(new_state, new_state.edittingStartTape);
	} else {
		let testReportId = new_state[new_state.edittingTrialId].testReportId;
		// clear
		new_state.edittingTrialId = null;
		new_state.edittingTrialName = null;

		let originalTape = new_state.originalTape;

		// initialize
		new_state.originalTape = null;
		new_state.edittingStartTape = null;
		new_state.edittingExpectedTape = null;

		new_state = tape.loadTape(new_state, originalTape);

		if (new_state[testReportId])
			delete new_state[testReportId];
	}

	return new_state;
}

export function changeEdittingTarget(state, action) {
	let new_state = Object.assign({}, state, {
		isEdittingExpectedTape: !state.isEdittingExpectedTape
	});

	let target;
	// editting expected tape
	if (new_state.isEdittingExpectedTape) {
		target = new_state.edittingExpectedTape;
		// update latest changes to expected tape
		new_state.edittingStartTape = tape.extractTape(new_state);
	} else { // editting start tape
		target = new_state.edittingStartTape;
		// update latest changes to start tape
		new_state.edittingExpectedTape = tape.extractTape(new_state);
	}

	return loadTrialTapeHelper(new_state, target);
}

export function saveTrialHelper(oldTrial, startTape, expectedTape, newName) {
	let trial = cloneTrial(oldTrial);

	// plus one so that it is no longer sentinel
	// but points to the actual head id of the start tape
	trial.startTapeHead = startTape.tapeHead + 1; 
	trial.startTape = tape.rstrip(tape.tapeToArray(startTape));
	trial.startState = startTape.tapeInternalState;

	// plus one so that it is no longer sentinel
	// but points to the actual head id of the expected tape
	trial.expectedTapeHead = expectedTape.tapeHead + 1; 
	trial.expectedTape = tape.rstrip(tape.tapeToArray(expectedTape));
	trial.expectedState = expectedTape.tapeInternalState;

	trial.tapePointer = startTape.tapePointer;
	trial.expectedTapePointer = expectedTape.tapePointer;

	trial.name = newName;

	return trial;
}

export function saveTrial(state, action) {
	let new_state = Object.assign({}, state, {
		anyChangeInTrial: false,
	});

	let id = new_state.edittingTrialId;
	let newName = new_state.edittingTrialName;
	let oldTrial = new_state[id];

	if (new_state.isEdittingExpectedTape) {
		// update latest changes to expected tape
		new_state.edittingExpectedTape = tape.extractTape(new_state);
	} else {
		// update latest changes to start tape
		new_state.edittingStartTape = tape.extractTape(new_state);
	}

	new_state[id] = saveTrialHelper(oldTrial, new_state.edittingStartTape, new_state.edittingExpectedTape, newName);

	return new_state;
}

/*
Basically, what this function does is to add a head to an unfinished tape (returned by createTapeFromTrial) 
so that the resulted tape is eligible to be presented and manipulated by any 
tape related reducers.

It differs with tape.loadTape in that this helper function calculates the head position but not directly 
copies. tape.loadTape will need much more information. For more lease see tape.js

It creates a tape with head from 
	sourceTape, an "mid-point" object that should have the following attributes:
		{
		tapePointer: number,
		tapeHead: number,
		tapeTail: number,
		tapeInternalState: string,
		tapeCellsById: array,

		And corresponding tapeCell objects to tapeCellsById
		}

*/
function loadTrialTapeHelper(state, sourceTape) {
	// initialize a tape with head
	state = tape.initializeTape(state, {});

	// set new head state
	state = tape.setInternalStateHelper(state, sourceTape.tapeInternalState);

	// calculate offset from trial's tapePointer 
	// and move direction
	let offset = sourceTape.tapePointer - state.tapePointer;
	let isLeft;
	if (offset < 0) {
		offset = -offset;
		isLeft = true; 
	} else if (offset > 0) {
		isLeft = false;
	}

	// move head to trial's position
	while (offset--) {
		state = gui.moveHeadHelper(state, isLeft);
	}
	state.highlightedCellOrder = -1; // cancel any highlight

	// expand tape if necessary
	while (state.tapeHead > sourceTape.tapeHead) {
		tape.insertBeforeHeadHelper(state, null);
	}
	while (state.tapeTail < sourceTape.tapeTail) {
		tape.appendAfterTailHelper(state, null);
	}

	// copy values if the source tape is not empty
	if (!tape.isTapeEmpty(sourceTape)) {
		let dummy = tape.standardizeCellId(sourceTape.tapeHead + 1);
		let current = sourceTape[dummy];
		while (current) {
			state[current.cur].val = current.val;
			current = sourceTape[current.next];
		}
	}

	return state;
}


/*
Basically, what this function does is to create a tape without head from trial object.
The result should be further processed by loadTrialTapeHelper so that it can be loaded
into the presentational tape, which requires information of both tape and head.

*/
export function createTapeFromTrial(trial, isTargetStartTape = true) {
	// This should be passed into loadTrialTapeHelper
	let generatedTape = {

		tapeHead: 0,
		tapeTail: 0,

		tapeCellsById: [],

		tapeInternalState: (isTargetStartTape) ? trial.startState : trial.expectedState,
		tapePointer: (isTargetStartTape) ? trial.tapePointer : trial.expectedTapePoiner,
	};

	let sourceArray = (isTargetStartTape) ? trial.startTape : trial.expectedTape;
	let sourceHead = (isTargetStartTape) ? trial.startTapeHead : trial.expectedTapeHead;

	let offset = generatedTape.tapeHead - sourceHead;
	if (offset === 0) {
		for (let i = 0; i < sourceArray.length; i++) {
			let val = tape.standardizeInputToTape(sourceArray[i], "");
			tape.appendAfterTailHelper(generatedTape, val);
		}

		return generatedTape;

	// we need expand right
	} else if (offset < 0)  {  
		// one extra cell as in original tape object, tapeHead is a sentinel, here is not meant to be
		// here the one extra cell makes it easier for users to locate the start of the tape
		let size = (-offset) + sourceArray.length + 1; 
		while (size) {
			tape.appendAfterTailHelper(generatedTape, null);
			size--;
		}	

	// we need expand left
	} else { 
		while (offset >= 0) { // one extra cell as in original tape object, tapeHead is a sentinel, here is not meant to be
							  // here the one extra cell makes it easier for users to locate the start of the tape
			tape.insertBeforeHeadHelper(generatedTape, null);
			offset--;
		}
		let size = sourceArray.length;
		while (size) {
			tape.appendAfterTailHelper(generatedTape, null);
			size--;
		}

	}

	// copy values
	let current = generatedTape[tape.standardizeCellId(sourceHead)];
	for (let i = 0; i < sourceArray.length; i++) {
		let val = tape.standardizeInputToTape(sourceArray[i], "");
		current.val = val;
		current = generatedTape[current.next];
	}

	return generatedTape;
}

