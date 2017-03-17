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

	if (finalSandbox.tapeInternalState !== trial.expectedFinalState) {
		result.status = STATUS_CODE_FAIL;
		result.feedback = DIFF_FINAL_STATE;
		result.fullreport = DIFF_FINAL_STATE + " Expected: " + trial.expectedFinalState +
							"; You have: " + finalSandbox.tapeInternalState; 
		return result;
	}

	// Compare cells
	// To be determined!

	for (let i = 0; i < trial.expectedFinalTape.length; i++) {
		let id = finalSandbox.tapeCellsById[i]; // already sorted when constructed
		let expected = trial.expectedFinalTape[i].toString();

		if (finalSandbox[id].val !== expected) {
			result.status = STATUS_CODE_FAIL;
			result.feedback = DIFF_FINAL_TAPE;
			result.fullreport = DIFF_FINAL_STATE + 
							" Expected at index " + i + " : " + trial.expectedFinalTape[i] +
							"; You have: " + finalSandbox[id].val; 
			return result;
		}
	}

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
function createTrial(id, startState, expectedFinalState, tape=[], expectedFinalTape=[],
					tapePointer=0, sourceFile=null) {
	return {
		id: id,

		startState: startState,
		expectedFinalState: expectedFinalState,
		startTape: tape,
		expectedFinalTape: expectedFinalTape,

		// start Head pointer
		tapePointer: tapePointer,

		// record name of source file
		sourceFile: sourceFile,

		// auto generate corresponding test report id
		testReportId: standardizeTestReportId(id), 
	};
}

// function cloneTrial(trial) {
// 	return {
// 		id: trial.id,
// 		startState: trial.startState,
// 		expectedFinalState: trial.expectedFinalState,
// 		startTape: trial.tape.slice(),
// 		expectedFinalTape: trial.expectedFinalTape.slice(),

// 		tapePointer: trial.tapePointer,
// 		sourceFile: trial.sourceFile,
// 		testReportId: trial.testReportId,
// 	};
// }

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

	delete new_state[new_state[action.id]].testReportId;
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
	let trial = createTrial(action.id, action.startState, action.expectedFinalState, 
							action.tape, action.tapePointer, 
							action.expectedTape, action.sourceFile);

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

	// initialize state
	let new_state = tape.initializeTape(state, {});

	// set new head state
	new_state = tape.setInternalState(new_state, {state: trial.startState});

	// calculate offset from trial's tapePointer 
	// and move direction
	let offset = trial.tapePointer - new_state.tapePointer;
	let isLeft;
	if (offset < 0) {
		offset = -offset;
		isLeft = true; 
	} else if (offset > 0) {
		isLeft = false;
	}

	// move head to trial's position
	while (offset--) {
		new_state = gui.moveHead(new_state, {moveLeft: isLeft});
	}

	// save anchor cell and highlighted cell,
	// we will alter them in the following operations since we
	// start filling tape from index 0
	let anchorCell = new_state.anchorCell;

	// reset, simulate tape head writes down trial tape data
	// use writeIntoTape function because it handles special chars already
	new_state.tapePointer = 0;
	new_state.anchorCell = 0;
	for (let i = 0; i < trial.startTape.length; i++) {
		let val = trial.startTape[i].toString();
		new_state = tape.writeIntoTape(new_state, { val: val});
		new_state = tape.moveRight(new_state);
	}

	// take back original value
	new_state.tapePointer = trial.tapePointer;
	new_state.anchorCell = anchorCell;

	new_state.highlightedCellOrder = -1;
	return new_state;
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
	let flag = (action.flag !== undefined) ? action.flag : !state.isEdittingTrial;
	return Object.assign({}, state, {
		isEdittingTrial: flag
	});
}