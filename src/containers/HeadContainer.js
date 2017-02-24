import { connect } from 'react-redux';
import { moveLeftAction, moveRightAction, switchHeadModeAction, setInternalStateAction } from '../actions/index';
import { N_CELLS } from '../constants/index';
import Head from '../components/Head';
import { standardizeTapeCellId } from '../components/Square';
import { rollTapeToRight, rollTapeToLeft } from './SquareContainer';

let OLD_X = 499; 

const calcPosition = () => ((OLD_X-9)/49);

const focusOnCorresCell = () => {
    document.getElementById(standardizeTapeCellId(calcPosition())).focus();
}

const blurOnCorresCell = () => {
    document.getElementById(standardizeTapeCellId(calcPosition())).blur();
}

const setOldX = (ui) => {
    if ((ui.x >= 9) && (ui.x <= 989) && ((ui.x-9)%49 === 0)) OLD_X = ui.x;
}

const headOnStart = (e, ui, dispatch) => {
    setOldX(ui);
}

const headOnStop = (e, ui, dispatch) => {
    dispatch(switchHeadModeAction(true));
    blurOnCorresCell();
}

const headOnDrag = (e, ui, dispatch) => {
    if (ui.x < OLD_X) { // Left
        dispatch(moveLeftAction());
        if (calcPosition() === 0)
            rollTapeToRight(dispatch, true);
    } else if (ui.x > OLD_X) {
        dispatch(moveRightAction());
        if (calcPosition() === N_CELLS - 1)
            rollTapeToLeft(dispatch, true);
    }
    setOldX(ui);
    focusOnCorresCell();
}


const onChange = (e, dispatch) => {
    dispatch(setInternalStateAction(e.target.value))
}

const mapStateToProps = (state, ownProps) => {
    console.log(state.tapePointer)
    return {
	   value: state.tapeInternalState,
       editable: state.tapeHeadEditable
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleStart: (e, ui) => { headOnStart(e, ui, dispatch) },
	handleDrag: (e, ui) => { headOnDrag(e, ui, dispatch) },
    handleStop: (e, ui) => { headOnStop(e, ui, dispatch) },
    onChange: (e) => { onChange(e, dispatch) }
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
