import { connect } from 'react-redux';
import { setInternalStateAction, highlightCorrespondingCellAction } from '../../actions/tapeActions';
import { moveHeadAction } from '../../actions/guiActions';
import { adjustHeadWidthAction } from '../../actions/guiActions';
import Head from '../../components/tape/Head';
import { getAllStates } from '../table/AutoCompleteFieldContainer';
import { HALT, standardFilter } from '../../constants/ReservedWords';

let OLD_X = 0; 
const setOldX = (e) => {
    OLD_X = e.pageX;
}

const headOnStart = (e, ui, dispatch) => {
    setOldX(e);
    dispatch(highlightCorrespondingCellAction(true));
    window.getSelection().removeAllRanges()
}

const headOnStop = (e, ui, dispatch) => {
    dispatch(highlightCorrespondingCellAction(false));
}

const headOnDrag = (e, ui, dispatch) => {
    window.getSelection().removeAllRanges()
    if (e.pageX < OLD_X) { // Left
        dispatch(moveHeadAction(true)); // left

        setOldX(e);
    } else if (e.pageX > OLD_X) {
        dispatch(moveHeadAction(false)) // right
        setOldX(e);
    }
}

const onUpdateInput = (searchText, dispatch) => {
    dispatch(adjustHeadWidthAction(searchText));
    dispatch(setInternalStateAction(searchText));
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
    fontColor: (state.tapeInternalState === HALT) ? "#1976D2" : "#212121", //#FF3D00

    hair_styles: {
      width: state.headWidth,
      left: state.headLeftOffset,
    },
    head_styles: {
      height: state.headHeight,
      width: state.headWidth,
      left: state.headLeftOffset,
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
  onUpdateInput: (searchText) => {
    onUpdateInput(searchText, dispatch)
  },
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
