import { connect } from 'react-redux';
import { setInternalStateAction, setCorrespondingCellHighlightAction } from '../../actions/tapeActions';
import { moveHeadAction } from '../../actions/guiActions';
import { adjustHeadWidthAction } from '../../actions/guiActions';
import Head from '../../components/tape/Head';
import { getAllStates } from '../table/AutoCompleteFieldContainer';
import {
  HEAD_LEFT_BOUNDARY,
  head_right_boundary,
  head_x,
  head_move_interval,
} from '../../constants/GUISettings';

let OLD_X = head_x(); 


const setOldX = (ui) => {
    if ((ui.x >= HEAD_LEFT_BOUNDARY) && (ui.x <= 989)) 
        OLD_X = ui.x;
}

const headOnStart = (e, ui, dispatch) => {
    setOldX(ui);
    dispatch(setCorrespondingCellHighlightAction(true));
    window.getSelection().removeAllRanges()
}

const headOnStop = (e, ui, dispatch) => {
    dispatch(setCorrespondingCellHighlightAction(false));
}

const headOnDrag = (e, ui, dispatch) => {
    window.getSelection().removeAllRanges()
    if (ui.x < OLD_X && ui.x >= (HEAD_LEFT_BOUNDARY-head_move_interval()) && ui.x <= head_right_boundary()) { // Left
        dispatch(moveHeadAction(true)); // left

        setOldX(ui);
    } else if (ui.x > OLD_X && ui.x <= head_right_boundary()+head_move_interval() && ui.x >= 9) {
        dispatch(moveHeadAction(false)) // right
        setOldX(ui);
    }
}

const onUpdateInput = (searchText, dispatch) => {
    dispatch(adjustHeadWidthAction(searchText));
    dispatch(setInternalStateAction(searchText));
}

const mapStateToProps = (state, ownProps) => {
    let filter = (searchText, key) => (searchText === "" || key.startsWith(searchText));
    let dataSource = getAllStates(state);
    delete dataSource[null];

    return {
	   internalState: state.tapeInternalState,
       head_position: state.headX, 
       dataSource: Object.keys(dataSource),
       filter: filter,
       hair_styles: {
        width: state.headWidth,
        left: state.headLeftOffset,
       },
       head_styles: {
        height: state.headHeight,
        width: state.headWidth,
        left: state.headLeftOffset,
       }
    };
}

const mapDispatchToProps = (dispatch, ownProps) => ({
	handleStart: (e, ui) => { headOnStart(e, ui, dispatch) },
	handleDrag: (e, ui) => { headOnDrag(e, ui, dispatch) },
    handleStop: (e, ui) => { headOnStop(e, ui, dispatch) },
    onUpdateInput: (searchText) => { onUpdateInput(searchText, dispatch) }
})


export default connect(mapStateToProps, mapDispatchToProps)(Head);
