import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';
import Square from './Square';

const HEAD_ID_PREFIX = "HEAD-";


class Head extends React.Component {
  render() {
    return (
      <Draggable
        axis="x"
        handle=".header"
        defaultPosition={{x: 499, y: 0}}
        position={null}
        grid={[49, 0]}
        zIndex={100}
        bounds={{left: 9, top: 0, right: 989, bottom: 0}} 
        onStart={this.props.handleStart}
        onDrag={this.props.handleDrag}
        onStop={this.props.handleStop}>
        <div  onFocus={this.props.onFocus} className="header">
          <div className="hair"></div>
          <button className="head" onDoubleClick={this.props.onDoubleClick}>{this.props.in_state}</button>
          <div className="neck"></div>
          <div className="shoulder"></div>
        </div>
      </Draggable>
      );
  }
}


Head.PropTypes = {
  in_state: PropTypes.string.isRequired,
  handleStart: PropTypes.func.isRequired,
  handleDrag: PropTypes.func.isRequired,
  handleStop: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  onDoubleClick: PropTypes.func.isRequired
}

// export const standardizeHeadId = (id) => HEAD_ID_PREFIX+id;

// class Head extends React.Component {
//   render() {
//     return (
//         <div className="header" id={this.props.id} onMouseDown={this.props.handleStart} onMouseMove={this.props.handleDrag} onmouseup={this.props.handleStop}>
//           <div className="hair"></div>
//           <button className="head" >{this.props.in_state}</button>
//           <div className="neck"></div>
//           <div className="shoulder"></div>
//         </div>
//       );
//   }
// }


// Head.PropTypes = {
//   in_state: PropTypes.string.isRequired,
//   handleStart: PropTypes.func.isRequired,
//   handleDrag: PropTypes.func.isRequired,
//   handleStop: PropTypes.func.isRequired,
//   onFocus: PropTypes.func.isRequired,
//   onDoubleClick: PropTypes.func.isRequired
// }

// const GRID = 49;
// const LEFT_MOST_BOUNDARY = 9;
// const RIGHT_MOST_BOUNDARY = 9 + N_CELLS * GRID;
// const START_POSITION = N_CELLS / 2 * GRID + LEFT_MOST_BOUNDARY;



export default Head;