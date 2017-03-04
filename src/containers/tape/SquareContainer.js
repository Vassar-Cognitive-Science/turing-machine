import { connect } from 'react-redux';
import { standardizeCellId } from '../../reducers/tape';
import { moveTapeRightAction, moveTapeLeftAction, fillTapeAction } from '../../actions/tapeActions';
import { N_CELLS } from '../../constants/GUISettings';
import Square, { standardizeTapeCellId, getTapeCellNumber } from '../../components/tape/Square';

const isNowLastCell = () => standardizeTapeCellId(N_CELLS-1) === document.activeElement.id;

const isNowFirstCell = () => standardizeTapeCellId(0) === document.activeElement.id;

const focusOnPrev = () => {
  var prevId = getTapeCellNumber(document.activeElement.id) - 1;
  document.getElementById(standardizeTapeCellId(prevId)).focus();
}

const focusOnNext = () => {
  let nextId = getTapeCellNumber(document.activeElement.id) + 1;
  document.getElementById(standardizeTapeCellId(nextId)).focus();
}

const activeId = () => (getTapeCellNumber(document.activeElement.id));

export const rollTapeToRight = (dispatch, passedFlag=false) => {
  if (isNowFirstCell() || passedFlag) {
      dispatch(moveTapeLeftAction(0));
    } else {
      focusOnPrev();
    }
}

export const rollTapeToLeft = (dispatch, passedFlag=false) => {
  if (isNowLastCell() || passedFlag) {
      dispatch(moveTapeRightAction(N_CELLS-1));
    } else {
      focusOnNext();
    }
}

const onKeyDown = (e, dispatch) => {
  var key = e.which;

  /* left arrow */
  if (key === 37) { 
    rollTapeToRight(dispatch);
  }
  /* right arrow */
  else if (key === 39) { 
    rollTapeToLeft(dispatch);
  }
  /* backspace, delete */
  else if (key === 8 || key === 46) { 
    dispatch(fillTapeAction(activeId(), ""));
  } 

  else if ((key >= 48 && key <= 90) || (key >= 96 && key <= 105)) {
    dispatch(fillTapeAction(activeId(), String.fromCharCode(key)));
    rollTapeToLeft(dispatch);
  }
}


const mapStateToProps = (state, ownProps) => {
  var tar = state[standardizeCellId(state.anchorCell+ownProps.order)];
  var val = (tar !== undefined && tar !== null) ? tar.val : "";

  return {
    val: val,
    isHighlighted: tar.highlight
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onKeyDown: (e) => { onKeyDown(e, dispatch) },
})

export default connect(mapStateToProps, mapDispatchToProps)(Square);
