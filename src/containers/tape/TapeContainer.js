import { connect } from 'react-redux';
import Tape from '../../components/tape/Tape';
import { rollTapeToRight, rollTapeToLeft } from './SquareContainer';
import { HALT } from '../../constants/index'

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
		messageColor: (state.tapeInternalState === HALT) ? "#1976D2" : "#FF3D00",
		stepCount: state.stepCount,
	}
};

const mapDispatchToProps = (dispatch, ownProps) => ({
	rollLeft: () => { rollLeft(dispatch) },
  	rollRight: () => { rollRight(dispatch) },
  	dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Tape);