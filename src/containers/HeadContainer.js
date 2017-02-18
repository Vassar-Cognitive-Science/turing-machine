import $ from 'jquery';
import { connect } from 'react-redux';
import { moveLeftAction, moveRightAction, moveTapeRightAction, moveTapeLeftAction } from '../actions/index.js';
import Head, { standardizeHeadId } from '../components/Head.js';
import { standardizeTapeCellId } from '../components/Square.js';
import { shiftAllToLeft, shiftAllToRight, N_CELLS } from '../components/Tape.js';
import { isNowFirstCell, isNowLastCell, setAnchorCell, getAnchorCell } from './SquareContainer.js';



var OLD_MOUSE_X = 0 // mouse horizontal position
var POSITION = 10;
var START_DRAG = 0;

// const highlightCell = (position, flag) => {
//     $("#"+standardizeTapeCellId(position)).toggleClass("square-highlight", null, false  );
// }

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
    $("#"+standardizeTapeCellId(POSITION)).blur();
}

const headOnDrag = (e, ui, dispatch) => {
    $("#"+standardizeTapeCellId(POSITION)).focus();
    var active = document.getElementById(document.activeElement.id);

    if (e.pageX < OLD_MOUSE_X && START_DRAG) { // Left
        dispatch(moveLeftAction());
        if (POSITION !== 0) {
            POSITION--;
        } else {
            shiftAllToRight();
            setAnchorCell("L");
            active.value = null;
            dispatch(moveTapeLeftAction(getAnchorCell()+POSITION));
        }
    } else if (e.pageX > OLD_MOUSE_X && START_DRAG) {
        dispatch(moveRightAction());
        if (POSITION !== N_CELLS-1) {
            POSITION++;
        } else {
            shiftAllToLeft();
            setAnchorCell("R");
            active.value = null;
            dispatch(moveTapeRightAction(getAnchorCell()+POSITION));
        }
    }

    $("#"+standardizeTapeCellId(POSITION)).focus();
    setOld_Mouse_X(e.pageX);
}


const mapStateToProps = (state) => ({
	in_state: state.tapeInternalState
})

const mapDispatchToProps = (dispatch) => ({
	handleStart: (e, ui) => { headOnStart(e, ui) },
	handleDrag: (e, ui) => { headOnDrag(e, ui, dispatch) },
    handleStop: (e, ui) => { headOnStop(e, ui) },
    onFocus: () => {  $("#"+standardizeTapeCellId(POSITION)).focus(); },
    onDoubleClick: () => { console.log(1) }
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
