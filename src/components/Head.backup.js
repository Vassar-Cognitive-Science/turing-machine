import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';


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
          {(!this.props.editable) ? 
            (<button className="head" onClick={this.props.onDoubleClick} >{this.props.label}</button>) :
            (<input className="head" value={this.props.label} onBlur={this.props.onBlur} onChange={this.props.onChange} ></input>)
          }
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
  onDoubleClick: PropTypes.func.isRequired,
  pointer: PropTypes.number.isRequired
}

export default Head;