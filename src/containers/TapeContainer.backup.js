import { connect } from 'react-redux';
import { N_CELLS } from '../constants/index';
import Tape from '../components/Tape';
import { standardizeTapeCellId } from '../components/Square';
import { rollTapeToRight, rollTapeToLeft } from './SquareContainer';

const FIRST_CELL_ID = standardizeTapeCellId(0);
const LAST_CELL_ID = standardizeTapeCellId(N_CELLS-1);

const prepareHead = () => {
	document.getElementById(FIRST_CELL_ID).focus();
}

const prepareTail = () => {
	document.getElementById(LAST_CELL_ID).focus();
};

const rollLeft = (dispatch) => {
	prepareHead();
    rollTapeToRight(dispatch)
    // document.getElementById(FIRST_CELL_ID).blur();
}

const rollRight = (dispatch) => {
	prepareTail();
	rollTapeToLeft(dispatch)
    // document.getElementById(LAST_CELL_ID).blur();
}

const mapStateToProps = (state) => ({});

const mapDispatchToProps = (dispatch, ownProps) => ({
	rollLeft: () => { rollLeft(dispatch) },
  	rollRight: () => { rollRight(dispatch) }
})

export default connect(mapStateToProps, mapDispatchToProps)(Tape);