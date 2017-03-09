import { connect } from 'react-redux';
import Tape from '../../components/tape/Tape';
import { rollTapeToRight, rollTapeToLeft } from './SquareContainer';

const rollLeft = (dispatch) => {
    rollTapeToRight(dispatch, true)
}

const rollRight = (dispatch) => {
	rollTapeToLeft(dispatch, true)
}

const mapStateToProps = (state) => {
	return {
		showReportedError: state.showReportedError,
		machineReportError: state.machineReportError,
		isRunning: state.isRunning,
		cellNum: state.cellNum,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	rollLeft: () => { rollLeft(dispatch) },
  	rollRight: () => { rollRight(dispatch) },
  	dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Tape);