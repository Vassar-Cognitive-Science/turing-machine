import { connect } from 'react-redux';
import TrialItem from '../../components/appbar/TrialItem';
import { deleteTrialAction, runTrialAction, loadTrialAction } from '../../actions/trialActions';
import { standardizeTestReportId } from '../../reducers/trial';

const deleteTrial = (dispatch, ownProps) => {
	dispatch(deleteTrialAction(ownProps.id));
}

const runTrial = (dispatch, ownProps) => {
	dispatch(runTrialAction(ownProps.id));
}

const loadTrial = (dispatch, ownProps) => {
	dispatch(loadTrialAction(ownProps.id));
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
})

export default connect(mapStateToProps, mapDispatchToProps)(TrialItem);