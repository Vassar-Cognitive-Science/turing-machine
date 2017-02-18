import React, { PropTypes } from 'react';
import { standardizeTapeCellId } from './Square.js';
import Square from '../containers/SquareContainer';
import Head from '../containers/HeadContainer';

export const N_CELLS = 21;

/*Use when fill the last cell*/
export function shiftAllToLeft() {
  var curE, nextE; 
  for (let i = 0; i < N_CELLS-1; i++) {
    curE = document.getElementById(standardizeTapeCellId(i));
    nextE = document.getElementById(standardizeTapeCellId(i + 1));
    curE.value = nextE.value;
  }
}

/*Use when fill the first cell*/
export function shiftAllToRight() {
  for (var i = N_CELLS-1; i > 0; i--) {
    var curE = document.getElementById(standardizeTapeCellId(i));
    var prevE = document.getElementById(standardizeTapeCellId(i - 1))
    curE.value = prevE.value;
  }
}

function populatedSquares(size) {
  var squares = [];
  for (var i = 0; i < size; i++)
    squares.push(i);
  return squares;
}

class Tape extends React.Component {
  render() {
    return (
      <div>
      <div className='tape'>
        <div className="head-row">
        <Head />
        </div>
        <div className="tape-row">
          {populatedSquares(N_CELLS).map((i) => (
            <Square key={standardizeTapeCellId(i)} read={i} id={standardizeTapeCellId(i)} />
            ))}
        </div>
      </div>
      </div>
    );
  }
}

Tape.PropTypes = {

}

export default Tape;