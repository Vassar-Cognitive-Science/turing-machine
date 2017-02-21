import { connect } from 'react-redux';
import { standardizeCellId } from '../reducers/tape';
import { moveTapeRightAction, moveTapeLeftAction, fillTapeAction } from '../actions/index';
import { LEFT, RIGHT } from '../constants/ReservedWords';
import { N_CELLS } from '../constants/index';
import Square, { standardizeTapeCellId, getTapeCellNumber } from '../components/Square';

let ANCHOR_CELL_ID = 0;
let CELL_INPUT = null;

const isNowLastCell = () => standardizeTapeCellId(N_CELLS-1) === document.activeElement.id;

const isNowFirstCell = () => standardizeTapeCellId(0) === document.activeElement.id;

const setAnchorCell = (direction) => {
  if (direction === LEFT) {
    ANCHOR_CELL_ID -= 1;
  } else if (direction === RIGHT) {
    ANCHOR_CELL_ID += 1;
  }
}

const focusOnPrev = () => {
  var prevId = getTapeCellNumber(document.activeElement.id) - 1;
  document.getElementById(standardizeTapeCellId(prevId)).focus();
}

const focusOnNext = () => {
  let nextId = getTapeCellNumber(document.activeElement.id) + 1;
  document.getElementById(standardizeTapeCellId(nextId)).focus();
}

const focusedTrueCellId = (display=false, activeId=document.activeElement.id) => {
  var selectedId = ANCHOR_CELL_ID + getTapeCellNumber(activeId);
  if (display) console.log(selectedId);
  return selectedId;
}

export const rollTapeToRight = (dispatch) => {
  if (isNowFirstCell()) {
      setAnchorCell(LEFT);
      dispatch(moveTapeLeftAction(focusedTrueCellId()));
    } else {
      focusOnPrev();
    }
}

export const rollTapeToLeft = (dispatch) => {
  if (isNowLastCell()) {
      setAnchorCell(RIGHT);
      dispatch(moveTapeRightAction(focusedTrueCellId()));
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
    dispatch(fillTapeAction(focusedTrueCellId(), ""));
  } 

  else {
    CELL_INPUT = String.fromCharCode(key);
  }
}

const onChange = (e, dispatch, ownProps) => {
  // console.log(CELL_INPUT)
	dispatch(fillTapeAction(focusedTrueCellId(), CELL_INPUT));
  CELL_INPUT = null;

	// If we reach the last cell presented
	if (isNowLastCell()) {
      rollTapeToLeft(dispatch);
  }
  else {
      focusOnNext();
  }
}

const mapStateToProps = (state, ownProps) => {
  var tar = state[standardizeCellId(ANCHOR_CELL_ID+ownProps.order)];
  var val = (tar !== undefined && tar !== null) ? tar.val : "";
  var cell = document.getElementById(ownProps.id);
  if (cell) cell.value = val;
  
  return {
    val: val
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	onChange: (e) => { onChange(e, dispatch, ownProps) },
  onFocus: () => { focusedTrueCellId(true) },
  onKeyDown: (e) => { onKeyDown(e, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Square);
