import * as tape from './tape';
import * as gui from './gui';
import { EXCEED_MAX_TEST_STEP_LIMIT, DIFF_FINAL_STATE, DIFF_FINAL_TAPE } from '../constants/Messages';

import { HALT } from '../constants/SpecialCharacters';
import { MAX_TEST_STEP_LIMIT } from '../constants/GeneralAppSettings';
import { matchRule } from './machine';

// import { UNDEFINED_RULE, EXCEED_MAX_TEST_STEP_LIMIT, DIFF_FINAL_STATE } from '../constants/Messages';


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
export const standardizeTestReportId = (id) => "REPORT-OF-" + id;

// generate string that describes step counts
const traceSuccessTrialStep = (step) => {
	if (step > 1)
		return step + " steps";
	return step + " step";
}

// generate string that describes failing at which step
const traceFailingStep = (step) => "Fail at step " + step + ".";

// see if result is as expected
const isExpected = (finalSandbox, trial) => {
	let result = {
		status: STATUS_CODE_PASS,
		feedback: "",
		fullreport: "",
		finalState: finalSandbox,
	};

	if (finalSandbox.tapeInternalState !== trial.expectedState) {
		result.status = STATUS_CODE_FAIL;
		result.feedback = DIFF_FINAL_STATE;
		result.fullreport = DIFF_FINAL_STATE + " Expected: " + trial.expectedState +
							"; You have: " + finalSandbox.tapeInternalState; 
		return result;
	}

	// Compare cells
	// To be determined!

	for (let i = 0; i < trial.expectedTape.length; i++) {
		let id = finalSandbox.tapeCellsById[i]; // already sorted when constructed
		let expected = trial.expectedTape[i].toString();

		if (finalSandbox[id].val !== expected) {
			result.status = STATUS_CODE_FAIL;
			result.feedback = DIFF_FINAL_TAPE;
			result.fullreport = DIFF_FINAL_STATE + 
							" Expected at index " + i + " : " + trial.expectedTape[i] +
							"; You have: " + finalSandbox[id].val; 
			return result;
		}
	}

	return result;
}


export function createTapeFromTrial(trial, isTargetStartTape = true) {
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

	let current = generatedTape[tape.standardizeCellId(sourceHead)];
	for (let i = 0; i < sourceArray.length; i++) {
		let val = tape.standardizeInputToTape(sourceArray[i], "");
		current.val = val;
		current = generatedTape[current.next];
	}

	return generatedTape;
}

/*
Helper function that loads 
	sourceTape, an object representing tape, returned by createTapeFromTrial
into the state
*/
function loadTrialTapeHelper(state, sourceTape) {
	// initialize state
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
		while (current.next !== null) {
			state[current.cur].val = current.val;
			current = sourceTape[current.next];
		}
	}

	return state;
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
					expectedTapePoiner,
					startTapeHead,
					expectedTapeHead,
					sourceFile
					) {

	let pointer = (tapePointer !== undefined && tapePointer !== null) ? tapePointer : 0;

	return {
		id: id,

		startState: (startState) ? startState : "0",
		expectedState: HALT,
		startTape: (startTape) ? startTape : [],
		expectedTape: (expectedTape) ? expectedTape : [],

		// start Head pointer
		tapePointer: pointer,
		// expected Head pointer
		expectedTapePoiner: (expectedTapePoiner !== undefined && expectedTapePoiner !== null) ? expectedTapePoiner : pointer,

		// record name of source file
		sourceFile: (sourceFile) ? sourceFile : id+'.json',

		// tape head
		startTapeHead: (startTapeHead !== undefined && startTapeHead !== null) ? startTapeHead : 0,
		expectedTapeHead: (expectedTapeHead !== undefined && expectedTapeHead !== null) ? expectedTapeHead : 0,

		// auto generate corresponding test report id
		testReportId: standardizeTestReportId(id), 
	};
}

export function cloneTrial(trial) {
	return {
		id: trial.id,
		startState: trial.startState,
		expectedState: trial.expectedState,
		startTape: trial.startTape.slice(),
		expectedTape: trial.expectedTape.slice(),

		tapePointer: trial.tapePointer,
		expectedTapePoiner: trial.expectedTapePoiner,

		sourceFile: trial.sourceFile,

		startTapeHead: trial.startTapeHead,
		expectedTapeHead: trial.expectedTapeHead,

		testReportId: trial.testReportId,
	};
}

function createTestReport(sourceId, sourceFile, statusCode, feedback, stepCount, fullreport, id, sandbox) {
	return {
		// trial id
		sourceId: sourceId,
		// source file
		sourceFile: sourceFile,
		// result 
		status: statusCode,
		// short feedback
		feedback: feedback,
		// counts of steps
		stepCount: stepCount,
		// full report
		fullreport: fullreport,
		// self id
		id: id,
		// runned sandbox
		sandbox: sandbox
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
		sandbox = tape.expandBeforeHead(sandbox, { n: -expandTo + 5}); // for extra space, notice N must be greater the expandTo
	} else if (expandTo > 0) {
		expandTo -= trial.startTape.length;
		if (expandTo > 0)
			sandbox = tape.expandAfterTail(sandbox, {n: expandTo + 5});
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
							action.sourceFile);

	new_state[action.id] = trial;

	return new_state;
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

export function runTrial(state, action) {
	let trial = state[action.sourceId];

	let sandbox = createSandbox(trial);
	while (sandbox.tapeInternalState !== HALT) {

		// check for infinite loop, if reach max step limit, generate report
		if (sandbox.stepCount > MAX_TEST_STEP_LIMIT) {
			return reportTestResult(state, {
				sourceId: action.sourceId,
				sourceFile: trial.sourceFile,
				status: STATUS_CODE_TIMEOUT,
				feedback: EXCEED_MAX_TEST_STEP_LIMIT,
				fullreport: EXCEED_MAX_TEST_STEP_LIMIT + " " + traceFailingStep(sandbox.stepCount),
				stepCount: sandbox.stepCount,
				// sandbox: sandbox
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
		sourceFile: trial.sourceFile,
		status: result.status,
		feedback: (result.status === STATUS_CODE_PASS) ? traceSuccessTrialStep(sandbox.stepCount) : result.feedback,
		stepCount: sandbox.stepCount,
		fullreport: result.fullreport,
		// sandbox: sandbox
	});
}


export function reportTestResult(state, action) {
	let new_state = Object.assign({}, state, {
		runningTrials: state.runningTrials.filter(tid => tid !== action.sourceId),
		// isRunningTrial: false,
	});

	let id = standardizeTestReportId(action.sourceId);
	new_state[id] = createTestReport(
		action.sourceId, action.sourceFile,
		action.status, action.feedback,
		action.stepCount, action.fullreport, id, action.sandbox
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


export function toggleEditMode(state, action) {
	let isEdittingTrial = !state.isEdittingTrial;
	let new_state = Object.assign({}, state, {
		isEdittingTrial: isEdittingTrial,
		edittingTrialId: (isEdittingTrial) ? action.id : null,
		isEdittingExpectedTape: false,
		anyChangeInTrial: false,
	});

	if (isEdittingTrial) { 
		let trial = new_state[action.id];

		new_state.originalTape = tape.extractTape(new_state);
		new_state.edittingStartTape = createTapeFromTrial(trial, true);
		new_state.edittingExpectedTape = createTapeFromTrial(trial, false);

		return loadTrial(new_state, action);
	} else {
		let originalTape = new_state.originalTape;

		// initialize
		new_state.originalTape = null;
		new_state.edittingStartTape = null;
		new_state.edittingExpectedTape = null;

		new_state = tape.loadTape(new_state, originalTape);
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
		new_state.edittingStartTape = tape.extractTape(new_state);
	} else { // editting start tape
		target = new_state.edittingStartTape;
		new_state.edittingExpectedTape = tape.extractTape(new_state);
	}

	return loadTrialTapeHelper(new_state, target);
}

export function saveTrialHelper(oldTrial, startTape, expectedTape) {
	let trial = cloneTrial(oldTrial);

	trial.startTapeHead = startTape.tapeHead + 1; // plus one so that it is no longer sentinel
	trial.startTape = tape.tapeToArray(startTape);
	trial.startState = startTape.tapeInternalState;

	trial.expectedTapeHead = expectedTape.tapeHead + 1; // plus one so that it is no longer sentinel
	trial.expectedTape = tape.tapeToArray(expectedTape);
	trial.expectedState = expectedTape.tapeInternalState;

	trial.tapePointer = startTape.tapePointer;
	trial.expectedTapePointer = expectedTape.tapePointer;

	return trial;
}

export function saveTrial(state, action) {
	let new_state = Object.assign({}, state, {
		anyChangeInTrial: false,
	});

	let id = new_state.edittingTrialId;
	let oldTrial = new_state[id];

	if (new_state.isEdittingExpectedTape) {
		new_state.edittingExpectedTape = tape.extractTape(new_state);
	} else {
		new_state.edittingStartTape = tape.extractTape(new_state);
	}

	new_state[id] = saveTrialHelper(oldTrial, new_state.edittingStartTape, new_state.edittingExpectedTape);

	return new_state;
}