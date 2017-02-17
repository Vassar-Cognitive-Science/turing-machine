import React, { PropTypes } from 'react';
import Head from './Head.js';
import Square, { standardizeTapeCellId } from './Square.js';

export const N_CELLS = 21;

export function shiftAllToLeft() {
  for (var id = 0; id < N_CELLS; id++) {
    var curE = document.getElementById(standardizeTapeCellId(id));
    var nextE = document.getElementById(standardizeTapeCellId(id + 1))
    curE.value = nextE.value;
  }
}

export function shiftAllToRight() {
  for (var id = N_CELLS-1; id >= 0; id--) {
    var curE = document.getElementById(standardizeTapeCellId(id));
    var prevE = document.getElementById(standardizeTapeCellId(id - 1))
    curE.value = prevE.value;
  }
}

class Tape extends React.Component {
  renderSquares(n) {
    var squares = [];
    for (var i = 0; i < n; i++)
      squares.push(<Square />);
    return squares;
  }
  renderHead(i) {
    return <Head />;
  }
  render() {
    return (
      <div className='tape'>
        <div className="head-row">
        {this.renderHead(0)}
        </div>
        <div className="board-row">
          {this.renderSquares(21)}
        </div>
      </div>
    );
  }
}

export default Tape;