import { connect } from 'react-redux';
import { standardizeCellId, CELL_ID_PREFIX } from '../../reducers/tape';
import { moveTapeRightAction, moveTapeLeftAction, fillTapeAction } from '../../actions/tapeActions';
import { BLANK } from '../../constants/SpecialCharacters';
import Square from '../../components/tape/Square';
import { MARK_LAST, MARK_FIRST } from '../../components/tape/Tape';

const getTapeCellNumber = (fullId) => parseInt(fullId.slice(CELL_ID_PREFIX.length, fullId.length), 10);

const focusOnPrev = () => {
  var prevId = getTapeCellNumber(document.activeElement.id) - 1;
  document.getElementById(standardizeCellId(prevId)).focus();
}

const focusOnNext = () => {
  let nextId = getTapeCellNumber(document.activeElement.id) + 1;
  document.getElementById(standardizeCellId(nextId)).focus();
}

const activeId = () => (getTapeCellNumber(document.activeElement.id));

export const rollTapeToRight = (dispatch, passedFlag = false, ownProps) => {
  if (passedFlag || ownProps.order === MARK_FIRST) {
    dispatch(moveTapeLeftAction()); // focus handled in reducer
  } else {
    focusOnPrev();
  }
}

export const rollTapeToLeft = (dispatch, passedFlag = false, ownProps) => {
  if (passedFlag || ownProps.mark === MARK_LAST) {
    dispatch(moveTapeRightAction()); // focus handled in reducer
  } else {
    focusOnNext();
  }
}

const onKeyDown = (e, dispatch, ownProps) => {
  var key = e.which;

  /* left arrow */
  if (key === 37) {
    rollTapeToRight(dispatch, false, ownProps);
  }
  /* right arrow */
  else if (key === 39) {
    rollTapeToLeft(dispatch, false, ownProps);
  }
  /* backspace, delete */
  else if (key === 8 || key === 46) {
    dispatch(fillTapeAction(activeId(), ""));
  } else if ((key >= 48 && key <= 90) || (key >= 96 && key <= 105)) {
    let val = String.fromCharCode(key).toUpperCase();
    if (key === 51 && e.shiftKey) val = BLANK;
    // if (key === 56 && e.shiftKey) val = STAR;
    if (key === 52 && e.shiftKey) val = "$";
    dispatch(fillTapeAction(activeId(), val));
    rollTapeToLeft(dispatch, ownProps.mark === MARK_LAST, ownProps);
  }
}


const mapStateToProps = (state, ownProps) => {
  let tar = state[standardizeCellId(state.anchorCell + ownProps.order)];
  let val = (tar !== undefined && tar !== null) ? tar.val : "";

  return {
    val: val,
    highlightedCellOrder: state.highlightedCellOrder,
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
  onKeyDown: (e) => {
    onKeyDown(e, dispatch, ownProps)
  },
  dispatch: dispatch
})

export default connect(mapStateToProps, mapDispatchToProps)(Square);