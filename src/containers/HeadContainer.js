import { connect } from 'react-redux';
import { moveLeftAction, moveRightAction } from '../actions/index';
import { N_CELLS } from '../constants/index';
import Head from '../components/Head';
import { standardizeTapeCellId } from '../components/Square';
import { rollTapeToRight, rollTapeToLeft } from './SquareContainer';

let OLD_MOUSE_X = 0 // mouse horizontal position
let POSITION = Math.floor(N_CELLS / 2);
let START_DRAG = 0;

const focusOnCorresCell = () => {
    document.getElementById(standardizeTapeCellId(POSITION)).focus();
}

const blurOnCorresCell = () => {
    document.getElementById(standardizeTapeCellId(POSITION)).blur();
}

const setOld_Mouse_X = (x) => {
    OLD_MOUSE_X = x;
}

const headOnStart = (e, ui) => {
    setOld_Mouse_X(e.pageX);
    START_DRAG = 1;
}

const headOnStop = (e, ui) => {
    setOld_Mouse_X(e.pageX);
    START_DRAG = 0;
    blurOnCorresCell();
}

const headOnDrag = (e, ui, dispatch) => {
    focusOnCorresCell();

    if (e.pageX < OLD_MOUSE_X && START_DRAG) { // Left
        dispatch(moveLeftAction());
        if (POSITION !== 0) {
            POSITION--;
        } else {
            rollTapeToRight(dispatch);
        }
    } else if (e.pageX > OLD_MOUSE_X && START_DRAG) {
        dispatch(moveRightAction());
        if (POSITION !== N_CELLS-1) {
            POSITION++;
        } else {
            rollTapeToLeft(dispatch);
        }
    }

    focusOnCorresCell();
    setOld_Mouse_X(e.pageX);
}


const mapStateToProps = (state) => {
    return {
	   in_state: state.tapeInternalState
    };
}

const mapDispatchToProps = (dispatch) => ({
	handleStart: (e, ui) => { headOnStart(e, ui) },
	handleDrag: (e, ui) => { headOnDrag(e, ui, dispatch) },
    handleStop: (e, ui) => { headOnStop(e, ui) },
    // onFocus: () => {  document.getElementById(standardizeTapeCellId(POSITION)).focus(); },
    onFocus: (e) => {  },
    onDoubleClick: () => { console.log(1) }
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
