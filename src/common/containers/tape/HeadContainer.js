import { connect } from 'react-redux';
import { setInternalStateAction, highlightCorrespondingCellAction } from '../../actions/tapeActions';
import { moveHeadAction } from '../../actions/guiActions';
import Head from '../../components/tape/Head';
import { getAllStates } from '../table/AutoCompleteFieldContainer';
import { HALT, standardFilter } from '../../constants/SpecialCharacters';


const headOnStart = (e, ui, dispatch) => {
    dispatch(highlightCorrespondingCellAction(true));
    window.getSelection().removeAllRanges()
}

const headOnStop = (e, ui, dispatch) => {
    dispatch(highlightCorrespondingCellAction(false));
}

const headOnDrag = (e, ui, dispatch) => {
  window.getSelection().removeAllRanges()
  dispatch(function(dispatch, getState) {
    if (ui.x < getState().headX)
      dispatch(moveHeadAction(true)); // left
    else if (ui.x > getState().headX)
      dispatch(moveHeadAction(false)) // right
  });
}

const onUpdateInput = (e, dispatch) => {
    dispatch(setInternalStateAction(e.target.value));
}

const mapStateToProps = (state, ownProps) => {
  let filter = standardFilter;
  let dataSource = getAllStates(state);
  delete dataSource[null];

  return {
    internalState: state.tapeInternalState,
    head_position: state.headX,
    dataSource: Object.keys(dataSource),
    filter: filter,
    isRunning: state.isRunning,
    rightBoundary: state.rightBoundary,
    // fontColor: (state.tapeInternalState === HALT) ? "#FF3D00" : "#212121", //#1976D2

    isEdittingExpectedTape: state.isEdittingExpectedTape,

    hair_styles: {
      width: state.headWidth,
      left: state.headLeftOffset,
    },
    head_styles: {
      height: state.headHeight,
      width: state.headWidth,
      left: state.headLeftOffset,
      color: (state.tapeInternalState === HALT) ? "#1976D2" : "#212121", //#FF3D00
    }
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  handleStart: (e, ui) => {
    headOnStart(e, ui, dispatch)
  },
  handleDrag: (e, ui) => {
    headOnDrag(e, ui, dispatch)
  },
  handleStop: (e, ui) => {
    headOnStop(e, ui, dispatch)
  },
  onUpdateInput: (e) => {
    onUpdateInput(e, dispatch)
  },
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
