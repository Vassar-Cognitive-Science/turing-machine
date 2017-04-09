import React, { PropTypes } from 'react';
import { standardizeCellId } from '../../reducers/tape';
import { highlightCellAtAction } from '../../actions/tapeActions';


class Square extends React.Component {
  constructor(props) {
    super(props);
    this.state = { style: { backgroundColor: "#fff" }};

    this.onFocus = () => {
      this.props.dispatch(highlightCellAtAction(this.props.order));
      // this.setState({style: { backgroundColor: "#87dbff" }});
    }
    this.onBlur = () => {
      this.props.dispatch(highlightCellAtAction(-1));
      // this.setState({style: { backgroundColor: "#fff" }});
    }
    this.onMouseEnter = () => {
      let style;
      if (this.state.style.backgroundColor !== "#87dbff")
        style = {style: { backgroundColor: "#f1fc7e" }};
      else
        style = this.state.style;
        
      this.setState(style);
    }
    this.onMouseLeave = () => {
      let style;
      if (this.state.style.backgroundColor === "#f1fc7e")
        style = {style: { backgroundColor: "#fff" }};
      else
        style = this.state.style;
      this.setState(style);
    }
  }

  render() {
  	// this.props.read[this.props.order] = "";
    return (
      <input className="square"
      style={(this.props.id === standardizeCellId(this.props.highlightedCellOrder))?{"backgroundColor": "#87dbff"}: this.state.style}
      onKeyDown={this.props.onKeyDown}
      value={(this.props.val)?this.props.val:""}
      id={this.props.id}
      onFocus={this.onFocus}
      onBlur={this.onBlur}
      onMouseEnter={this.onMouseEnter}
      onMouseLeave={this.onMouseLeave}
      />
    );
  }
}

Square.PropTypes = {
  onKeyDown: PropTypes.func.isRequired,
  order: PropTypes.number.isRequired,
  id: PropTypes.string.isRequired,
}


export default Square;