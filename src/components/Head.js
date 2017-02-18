import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';
import { N_CELLS } from './Tape.js';

export const HEAD_ID = "HEAD-0";
const GRID = 49;
const LEFT_MOST_BOUNDARY = 9;
const RIGHT_MOST_BOUNDARY = 9 + N_CELLS * GRID;
const START_POSITION = N_CELLS / 2 * GRID + LEFT_MOST_BOUNDARY;


class Head extends React.Component {
  render() {
    return (
      <Draggable
        axis="x"
        handle=".header"
        defaultPosition={{x: START_POSITION, y: 0}}
        position={null}
        grid={[GRID, GRID]}
        zIndex={100}
        bounds={{left: LEFT_MOST_BOUNDARY, top: 0, right: RIGHT_MOST_BOUNDARY, bottom: 0}} 
        onStart={this.props.handleStart}
        onDrag={this.props.handleDrag}
        onStop={this.handleStop}>
        <div className="header">
          <div className="hair"></div>
          <button className="head" id={HEAD_ID}>{this.props.in_state}</button>
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
  handleDrag: PropTypes.func.isRequired
}

export default Head;