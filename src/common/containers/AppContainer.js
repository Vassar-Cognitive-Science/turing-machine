import { connect } from 'react-redux';
import App from '../components/App';

const mapStateToProps = (state) => {
	return {
		isEdittingTrial: state.isEdittingTrial
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({})

export default connect(mapStateToProps, mapDispatchToProps)(App);