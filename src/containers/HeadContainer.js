import React from 'react';
import { connect } from 'react-redux';
import { moveLeftAction, moveRightAction } from '../actions/index.js';
import Head from '../components/Head.js';
import Tape from '../components/Tape.js';


let OLD_MOUSE_X = 0 // mouse horizontal position

const headOnClick = (e, ui) => {
	OLD_MOUSE_X = e.pageX;
}

const headOnDrag = (e, ui, dispatch) => {
    if (e.pageX < OLD_MOUSE_X) { // Left
    	dispatch(moveLeftAction());
    } else if (e.pageX > OLD_MOUSE_X) {
        dispatch(moveRightAction());
    }
    OLD_MOUSE_X = e.pageX;
  }
}

const mapStateToProps = (state) => {
  return {
    in_state: state.tapeInternalState
  };
}

const mapDispatchToProps = (dispatch) => {
	handleStart: headOnClick,
	handleDrag: (e, ui) => { headOnDrag(e, ui, dispatch); },

}


const HeadContainer = connect(mapStateToProps, mapDispatchToProps)(Head);

export default HeadContainer;