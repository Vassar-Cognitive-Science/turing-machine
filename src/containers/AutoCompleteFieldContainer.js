import { connect } from 'react-redux';
import AutoCompleteField from '../components/AutoCompleteField';

const mapStateToProps = (state, ownProps) => {
	return {
		editable: state[ownProps.parent].editable
	};
}

const mapDispatchToProps = (dispatch, ownProps) => ({

})

export default connect(mapStateToProps, mapDispatchToProps)(AutoCompleteField);