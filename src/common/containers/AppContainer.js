import { connect } from 'react-redux';
import App from '../components/App';
import {
	addTrialAction,
	runTrialAction,
	toggleIsRunningTrialAction,
	clearTestResultAction,
	preRunTrialAction,
	deleteTrialAction
} from '../actions/trialActions';

var TEST_ID = 1;
export const standardizeTestId = (id) => (`Test Case #${id}`); 

const handleAddTest = (dispatch, ownProps) => {
	dispatch(function(dispatch, getState) {
		let id = standardizeTestId(TEST_ID++);
		// find suitable id
		while (getState().testsById.includes(id))
			id = standardizeTestId(TEST_ID++);

		// add a blank trial
		dispatch(addTrialAction(id));
	});
}

const handleDeleteTests = (dispatch) => {
	dispatch(function(dispatch, getState) {
		let tests = getState().testsById;
		for (let i = 0; i < tests.length; i++) {
			dispatch(deleteTrialAction(tests[i]));
		}
	});

	// reset
	TEST_ID = 1;
}

const handleRunAllTests = (dispatch, ownProps) => {
	// update state
	dispatch(toggleIsRunningTrialAction(true));
	// clear previous test results
	dispatch(clearTestResultAction());

	// prepare all tests for running
	dispatch(function(dispatch, getState) {
		for (let i = 0; i < getState().testsById.length; i++)
			dispatch(preRunTrialAction(getState().testsById[i]));
	});

	// runn tests
	setTimeout(() => {
		dispatch(function(dispatch, getState) {
			for (let i = 0; i < getState().testsById.length; i++) {
				dispatch(runTrialAction(getState().testsById[i]));
			}
			dispatch(toggleIsRunningTrialAction(false));
		})
	}, 800);
}


const downloadAllTests = (dispatch, ownProps) => {
	dispatch((dispatch, getState) => {
		let state = getState();
		let suite = [];
		for (let i = 0; i < state.testsById.length; i++) {
			let id = state.testsById[i];
			let trial = Object.assign({}, state[id]);

			delete trial.id;
			delete trial.testReportId;
			
			suite.push(trial);
		}

		let data = "text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(suite, null, 4));
		// provide download link
		let a = document.createElement('a');
		a.href = 'data:' + data;
		a.download = "turingMachineTests-" + (new Date()).toISOString().slice(0,10).replace(/-/g,"") + '.json';

		a.click();
	});
}


function onReaderLoad(event) {
	let trials = JSON.parse(event.target.result);

	event.target.dispatch(function(dispatch, getState) {
		for (let i = 0; i < trials.length; i++) {
			let id = standardizeTestId(TEST_ID++);
			// find suitable id
			while (getState().testsById.includes(id))
				id = standardizeTestId(TEST_ID++);

			let trial = trials[i];
			// add in only these attributes
			dispatch(addTrialAction(id,
				trial.startState,
				trial.startTape,
				trial.expectedTape,
				trial.tapePointer,
				trial.expectedTapePoiner,
				trial.startTapeHead,
				trial.expectedTapeHead,
				trial.name
			));
		}
	});
}



const uploadTests = (dispatch) => {
	let a = document.createElement('input');
	a.setAttribute('type', 'file');
	a.setAttribute('multiple', true);
	a.setAttribute('accept', '.json');
	a.onchange = (event) => {
		let files = event.target.files;
		for (let i = 0; i < files.length; i++) {
			let reader = new FileReader();
			reader.onload = onReaderLoad;
			if (!files[i].name.endsWith('.json')) {
				continue;
			}

			// set callback
			reader.dispatch = dispatch;
			reader.name = files[i].name;
			reader.readAsText(files[i]);
		}


	};

	a.click();
}

const mapStateToProps = (state) => {
	let idAndName = [];
	for (let i = 0; i < state.testsById.length; i++) {
		let id = state.testsById[i];
		let obj = {id: id, name: state[id].name};
		idAndName.push(obj);
	}

	return {
		isEdittingTrial: state.isEdittingTrial,
		isRunningTrial: state.isRunningTrial,
    	testsById: idAndName,
    	runningTrials: state.runningTrials,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleAddTest: () => { handleAddTest(dispatch, ownProps) },
	handleRunAllTests: () => { handleRunAllTests(dispatch, ownProps) },
	downloadAllTests: () => { downloadAllTests(dispatch, ownProps) },
	uploadTests: () => { uploadTests(dispatch) },
	handleDeleteTests: () => { handleDeleteTests(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(App);