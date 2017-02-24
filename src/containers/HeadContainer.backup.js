import { connect } from 'react-redux';
import { moveLeftAction, moveRightAction, switchHeadModeAction, setInternalStateAction } from '../actions/index';
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

const onDoubleClick = (dispatch, ownProps) => {
    dispatch(switchHeadModeAction(true));
}

const onBlur = (dispatch) => {
    dispatch(switchHeadModeAction(false));
}

const onChange = (e, dispatch) => {
    dispatch(setInternalStateAction(e.target.value))
}

const mapStateToProps = (state, ownProps) => {
    console.log(state)
    return {
	   label: state.tapeInternalState,
       editable: state.tapeHeadEditable
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleStart: (e, ui) => { headOnStart(e, ui) },
	handleDrag: (e, ui) => { headOnDrag(e, ui, dispatch) },
    handleStop: (e, ui) => { headOnStop(e, ui) },
    // onFocus: () => {  document.getElementById(standardizeTapeCellId(POSITION)).focus(); },
    onFocus: (e) => {  },
    onBlur: () => { onBlur(dispatch) },
    onDoubleClick: () => { onDoubleClick(dispatch, ownProps) },
    onChange: (e) => { onChange(e, dispatch) }
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
