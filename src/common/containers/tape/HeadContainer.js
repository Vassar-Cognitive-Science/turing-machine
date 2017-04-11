import { connect } from 'react-redux';
import { setInternalStateAction, highlightCorrespondingCellAction } from '../../actions/tapeActions';
import { moveHeadAction } from '../../actions/guiActions';
import Head from '../../components/tape/Head';
import { getAllStates } from '../table/AutoCompleteFieldContainer';
import { HALT } from '../../constants/SpecialCharacters';
import { standardFilter } from '../table/AutoCompleteFieldContainer';

function pauseEvent(e){
    if(e.stopPropagation) e.stopPropagation();
    if(e.preventDefault) e.preventDefault();
    e.cancelBubble=true;
    e.returnValue=false;
    return false;
}

function unFocus() {
  if (document.selection) {
    document.selection.empty()
  } else {
    window.getSelection().removeAllRanges()
  }
} 

const headOnStart = (e, ui, dispatch) => {
    dispatch(highlightCorrespondingCellAction(true));
}

const headOnStop = (e, ui, dispatch) => {
    dispatch(highlightCorrespondingCellAction(false));
}

const headOnDrag = (e, ui, dispatch) => {
  dispatch(function(dispatch, getState) {
    if (ui.x < getState().headX)
      dispatch(moveHeadAction(true)); // left
    else if (ui.x > getState().headX)
      dispatch(moveHeadAction(false)) // right
  });
  pauseEvent(e);
  unFocus();
}

const onUpdateInput = (searchText, dispatch) => {
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
    fontColor: (state.tapeInternalState === HALT) ? "#1976D2" : "#212121", //#FF3D00

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
  onUpdateInput: (searchText) => {
    onUpdateInput(searchText, dispatch)
  },
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
