import React, { PropTypes } from 'react';

let SQUARE = 0; // square id
const TAPE_CELL_ID_PREFIX = "TAPE-CELL-";
export function standardizeTapeCellId(id) {
  return TAPE_CELL_ID_PREFIX + id;
}

export function getTapeCellNumber(fullId) {
  return parseInt(fullId.slice(TAPE_CELL_ID_PREFIX.length, fullId.length));
}

class Square extends React.Component {
  render() {
    return (
      <input className="square" 
      onKeyPress={this.props.onKeyPress}
      onChange={this.props.onChange} 
      id={standardizeTapeCellId(SQUARE++)}
      value={this.props.read}>
      </input>
    );
  }
}

Square.propTypes = {
  onChange: propTypes.func.isRequired,
  onKeyPress: propTypes.func.isRequired,
  read: propTypes.string.isRequired
}


export default Square;