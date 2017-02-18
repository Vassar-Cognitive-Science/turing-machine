import { connect } from 'react-redux';
import { moveTapeRightAction, moveTapeLeftAction } from '../actions/index.js';
import Tape, { N_CELLS, shiftAllToLeft, shiftAllToRight } from '../components/Tape.js';
import { standardizeTapeCellId, getTapeCellNumber } from '../components/Square.js';
import { isNowFirstCell, isNowLastCell, setAnchorCell, getAnchorCell } from './SquareContainer.js';

const gotoHead = () => {
	document.getElementById(standardizeTapeCellId(0)).focus();
}

const prepareTail = () => {
	var id = getAnchorCell() + N_CELLS - 1;
	document.getElementById(standardizeTapeCellId(N_CELLS-1)).focus();
	return id;
};

const rollLeft = (dispatch) => {
	gotoHead();
    var active = document.getElementById(document.activeElement.id);
	shiftAllToRight();
    setAnchorCell("L");
    active.value = null;
    dispatch(moveTapeLeftAction(getAnchorCell()));
    // active.blur();
}

const rollRight = (dispatch) => {
	var selectedId = prepareTail();
	var active = document.getElementById(document.activeElement.id);
	shiftAllToLeft();
    setAnchorCell("R");
    active.value = null;
    dispatch(moveTapeRightAction(selectedId));
    // active.blur();
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
	rollLeft: () => { rollLeft(dispatch) },
  	rollRight: () => { rollRight(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Tape);