import React, { PropTypes } from 'react';

const TAPE_CELL_ID_PREFIX = "TAPE-CELL-";

export function standardizeTapeCellId(i) {
  return TAPE_CELL_ID_PREFIX + i;
}

export function getTapeCellNumber(fullId) {
  return parseInt(fullId.slice(TAPE_CELL_ID_PREFIX.length, fullId.length), 10);
}

class Square extends React.Component {
  render() {
  	// this.props.read[this.props.order] = "";
    return (
      <input className="square"
      style={(this.props.isHighlighted)?{"backgroundColor": "#87dbff"}:{"backgroundColor": "#fff"}}
      onKeyDown={this.props.onKeyDown}
      value={(this.props.val)?this.props.val:""}
      id={this.props.id}
      >
      </input>
    );
  }
}

Square.PropTypes = {
  onFocus: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  onKeyDown: PropTypes.func.isRequired,
  order: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired
}


export default Square;