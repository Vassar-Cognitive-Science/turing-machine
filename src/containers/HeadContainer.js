import { connect } from 'react-redux';
import { moveLeftAction, moveRightAction } from '../actions/index.js';
import Head from '../components/Head.js';
import { shiftAllToLeft, shiftAllToRight } from '../components/Tape.js';
import { isNowFirstCell, isNowLastCell, setAnchorCell } from './SquareContainer.js';


var OLD_MOUSE_X = 0 // mouse horizontal position


const headOnDrag = (e, ui, dispatch) => {
    if (e.pageX < OLD_MOUSE_X) { // Left
    	dispatch(moveLeftAction());
    	if (isNowFirstCell()) {
    		shiftAllToRight();
            setAnchorCell("L");
    	}
    } else if (e.pageX > OLD_MOUSE_X) {
        dispatch(moveRightAction());
        if (isNowLastCell()) {
        	shiftAllToLeft();
            setAnchorCell("R");
        }
    }
    OLD_MOUSE_X = e.pageX;
}


const mapStateToProps = (state) => ({
	in_state: state.tapeInternalState
})

const mapDispatchToProps = (dispatch) => ({
	handleStart: (e, ui) => { OLD_MOUSE_X = e.pageX; },
	handleDrag: (e, ui) => { headOnDrag(e, ui, dispatch) } 
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
