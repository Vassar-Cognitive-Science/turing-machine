import React, { PropTypes } from 'react';

const TAPE_CELL_ID_PREFIX = "TAPE-CELL-";
export function standardizeTapeCellId(i) {
  return TAPE_CELL_ID_PREFIX + i;
}

export function getTapeCellNumber(fullId) {
  return parseInt(fullId.slice(TAPE_CELL_ID_PREFIX.length, fullId.length));
}

class Square extends React.Component {
  render() {
  	// this.props.read[this.props.order] = "";
    return (
      <input className="square" 
      onKeyPress={this.props.onKeyPress}
      onChange={this.props.onChange} 
      onFocus={this.props.onFocus}
      onKeyDown={this.props.onKeyDown}
      type={"text"}
      value={this.props.val}
      id={this.props.id}
      >
      </input>
    );
  }
}

Square.PropTypes = {
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyPress: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  read: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
}


export default Square;