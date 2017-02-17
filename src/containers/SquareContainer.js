import React from 'react';
import { connect } from 'react-redux';
import { findCell } from '../reducers/tape.js';
import { moveRightAction, writeIntoTapeAction } from '../actions/index.js';
import { standardizeTapeCellId, getTapeCellNumber } from '../components/Square.js';
import { N_CELLS, shiftAllToLeft } from '../components/Tape.js';
import Square from '../components/Square.js';

let CELL_INPUT = null;


const onChange = (dispatch, ownProps) => {
	var activeId = document.activeElement.id;
	var active = document.getElementById(activeId);

	dispatch(writeIntoTapeAction(CELL_INPUT));
	
	// If we reach the last cell presented
	if (standardizeTapeCellId(N_CELLS) === activeId) {
      shiftAllToLeft();
      dispatch(moveRightAction());
    }

    else {
      var nextId = getTapeCellNumber(activeId) + 1;
      document.getElementById(standardizeTapeCellId(nextId)).focus();
    }
}

const mapStateToProps = (state) => ({
    read: findCell(state, state.tapePointer).val
})

const mapDispatchToProps = (dispatch, ownProps) => ({
	onKeyPress: (e) => { CELL_INPUT = String.fromCharCode(e.which) },
	onChange: () => { onChange(dispatch, ownProps) },
})

const SquareContainer = connect(mapStateToProps, mapDispatchToProps)(Square);

export default SquareContainer;