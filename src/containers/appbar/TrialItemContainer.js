import { connect } from 'react-redux';
import TrialItem from '../../components/appbar/TrialItem';
import {
	deleteTrialAction,
	runTrialAction,
	loadTrialAction,
	preRunTrialAction,
	toggleEditModeAction
} from '../../actions/trialActions';
import { standardizeTestReportId } from '../../reducers/trial';

const deleteTrial = (dispatch, ownProps) => {
	dispatch(deleteTrialAction(ownProps.id));
}

export const runTrial = (dispatch, ownProps, timeout=800) => {
	dispatch(preRunTrialAction(ownProps.id));
	dispatch(function(dispatch, getState) {
		// let the loading button show up
		setTimeout(()=>{dispatch(runTrialAction(ownProps.id));}, timeout);
	});
}

const loadTrial = (dispatch, ownProps) => {
	dispatch(loadTrialAction(ownProps.id));
}

const editTrial = (dispatch, ownProps) => {
	dispatch(toggleEditModeAction());
	
}

const mapStateToProps = (state, ownProps) => {
	let testReport = state[standardizeTestReportId(ownProps.id)];

	return {
		steps: (testReport) ? testReport.stepCount : null,
		statusCode: (testReport) ? testReport.status : null,
		feedback: (testReport) ? testReport.feedback : null
	}
};


const mapDispatchToProps = (dispatch, ownProps) => ({
	deleteTrial: () => { deleteTrial(dispatch, ownProps) },
	runTrial: () => { runTrial(dispatch, ownProps) },
	loadTrial: () => { loadTrial(dispatch, ownProps) },
	editTrial: () => { editTrial(dispatch, ownProps) },
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialItem);