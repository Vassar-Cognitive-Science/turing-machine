import React, { PropTypes } from 'react';
import { standardizeTapeCellId } from './Square.js';
import Square from '../containers/SquareContainer';
import Head from '../containers/HeadContainer';
import IconButton from 'material-ui/IconButton';
import RollRight from 'material-ui/svg-icons/av/skip-next';
import RollLeft from 'material-ui/svg-icons/av/skip-previous';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

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

const styles = {
  mediumIcon: {
    width: 36,
    height: 36,
    margin: -10
  },
  style: {
    // background: "#81D4FA", 
    height: 50.7
  }

}

class Tape extends React.Component {
  render() {
    return (
      <div>
         <MuiThemeProvider>
          <div className="tape-with-button">
            <div className="roll-left"><IconButton tooltip="Roll Left" onTouchTap={this.props.rollLeft} touch={true} style={styles.style} iconStyle={styles.mediumIcon} tooltipPosition="bottom-left"><RollLeft /></IconButton></div>
            <div className='tape'>
              <div className="head-row"><Head /></div>
              <div className="tape-row">
                {populatedSquares(N_CELLS).map((i) => (
                  <Square key={standardizeTapeCellId(i)} read={i} id={standardizeTapeCellId(i)} />
                  ))}
              </div>
            </div>
            <div className="roll-right"><IconButton tooltip="Roll Right" onTouchTap={this.props.rollRight} touch={true} style={styles.style} iconStyle={styles.mediumIcon} tooltipPosition="bottom-right"><RollRight /></IconButton></div>
          </div>
          </MuiThemeProvider>
      </div>
    );
  }
}

Tape.PropTypes = {
  rollLeft: PropTypes.func.isRequired,
  rollRight: PropTypes.func.isRequired
}

export default Tape;

// class Tape extends React.Component {
//   render() {
//     return (
//       <div>
//       <div className='tape'>
//         <div className="head-row">
//         <Head />
//         </div>
//         <div className="tape-with-button">
//         <div className="roll-left"><button>LEFT</button></div>
//           <div className="tape-row">
//             {populatedSquares(N_CELLS).map((i) => (
//               <Square key={standardizeTapeCellId(i)} read={i} id={standardizeTapeCellId(i)} />
//               ))}
//           </div>
//         <div className="roll-right"><button>RIGHT</button></div>
//         </div>
//       </div>
//       </div>
//     );
//   }
// }
