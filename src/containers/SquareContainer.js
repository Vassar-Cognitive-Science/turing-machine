import { connect } from 'react-redux';
import { standardizeCellId } from '../reducers/tape.js';
import { moveTapeRightAction, moveTapeLeftAction, fillTapeAction } from '../actions/index.js';
import { standardizeTapeCellId, getTapeCellNumber } from '../components/Square.js';
import { N_CELLS, shiftAllToLeft, shiftAllToRight } from '../components/Tape.js';
import Square from '../components/Square.js';

let ANCHOR_CELL_ID = 0;
let SELECTED_CELL_ID;
let CELL_INPUT = null;

export const isNowLastCell = () => standardizeTapeCellId(N_CELLS-1) === document.activeElement.id;

export const isNowFirstCell = () => standardizeTapeCellId(0) === document.activeElement.id;

export const setAnchorCell = (direction) => {
  if (direction === "L") {
    ANCHOR_CELL_ID -= 1;
  } else if (direction === "R") {
    ANCHOR_CELL_ID += 1;
  }
}

const onKeyPress = (e) => {
  CELL_INPUT = String.fromCharCode(e.which);
}

const onKeyDown = (e, dispatch) => {
  var key = e.which;
  var active = document.getElementById(document.activeElement.id);

  if (key === 37) { // left arrow
    if (isNowFirstCell()) {
      shiftAllToRight();
      setAnchorCell("L");
      dispatch(moveTapeLeftAction(SELECTED_CELL_ID));
      active.value = null;
    } else {
      var prevId = getTapeCellNumber(document.activeElement.id) - 1;
      document.getElementById(standardizeTapeCellId(prevId)).focus();
    }
    onFocus();
  }
  else if (key === 39) { // right arrow
    if (isNowLastCell()) {
      shiftAllToLeft();
      setAnchorCell("R");
      dispatch(moveTapeRightAction(SELECTED_CELL_ID));
      active.value = null;
    } else {
      var nextId = getTapeCellNumber(document.activeElement.id) + 1;
      document.getElementById(standardizeTapeCellId(nextId)).focus();
    }
    onFocus();
  }
}

const onFocus = () => {
  SELECTED_CELL_ID = ANCHOR_CELL_ID + getTapeCellNumber(document.activeElement.id);
  console.log("On Focus: " + SELECTED_CELL_ID)
}

const onChange = (dispatch, ownProps) => {
	dispatch(fillTapeAction(SELECTED_CELL_ID, CELL_INPUT));
  var active = document.getElementById(document.activeElement.id);
  
	// If we reach the last cell presented
	if (isNowLastCell()) {
      shiftAllToLeft();
      setAnchorCell("R");
      active.value = null;
  }
  else {
      let nextId = getTapeCellNumber(document.activeElement.id) + 1;
      document.getElementById(standardizeTapeCellId(nextId)).focus();
      active.value = CELL_INPUT;
  }
  onFocus();
}


const mapStateToProps = (state, ownProps) => {
  var tar = state[standardizeCellId(ANCHOR_CELL_ID+ownProps.read)];
  var val = (tar !== undefined && tar !== null) ? tar.val : null;

  return {
    read: val
  };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	onKeyPress: (e) => { onKeyPress(e) },
	onChange: () => { onChange(dispatch, ownProps) },
  onFocus: () => { onFocus() },
  onKeyDown: (e) => { onKeyDown(e, dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Square);
