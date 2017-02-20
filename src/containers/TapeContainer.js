import { connect } from 'react-redux';
import { moveTapeRightAction, moveTapeLeftAction, fireAction } from '../actions/index.js';
import Tape, { N_CELLS, shiftAllToLeft, shiftAllToRight } from '../components/Tape.js';
import { standardizeTapeCellId, getTapeCellNumber } from '../components/Square.js';
import { isNowFirstCell, isNowLastCell, setAnchorCell, getAnchorCell } from './SquareContainer.js';

const FIRST_CELL_ID = standardizeTapeCellId(0);
const LAST_CELL_ID = standardizeTapeCellId(N_CELLS-1);

const getHead = () => {
	document.getElementById(FIRST_CELL_ID).focus();
}

const prepareTail = () => {
	var id = getAnchorCell() + N_CELLS - 1;
	document.getElementById(LAST_CELL_ID).focus();
	return id;
};

const rollLeft = (dispatch) => {
	getHead();
    var active = document.getElementById(document.activeElement.id);
    setAnchorCell("L");
    dispatch(moveTapeLeftAction(getAnchorCell()));
    // active.blur();
}

const rollRight = (dispatch) => {
	var selectedId = prepareTail();
	var active = document.getElementById(document.activeElement.id);
    setAnchorCell("R");
    dispatch(moveTapeRightAction(selectedId));
    // active.blur();
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
	rollLeft: () => { rollLeft(dispatch) },
  	rollRight: () => { rollRight(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Tape);