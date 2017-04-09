import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  INIT_HAIR_STYLES,
  generate_head_style,
  HEAD_LEFT_BOUNDARY,
  HEAD_MOVE_INTERVAL,
  HEAD_INPUT_MAXLENGTH
} from '../../constants/components/Head';

export const HEAD_INPUT_ID = 'HEAD_INPUT_1';

class Head extends React.Component {
  render() {
    return (
      <div className='draggable-head' id='draggable-head'>
      <Draggable
        axis="x"
        handle=".header"
        position={{x: this.props.head_position, y: 0}}
        grid={[HEAD_MOVE_INTERVAL, 0]}
        zIndex={100}
        bounds={{left: HEAD_LEFT_BOUNDARY, top: 0, right: this.props.rightBoundary}} 
        onStart={this.props.handleStart}
        onDrag={this.props.handleDrag}
        onStop={this.props.handleStop}
        disabled={this.props.isRunning}
        >
        <div className="header">
          <div className="hair" style={(this.props.hair_styles)?(this.props.hair_styles):INIT_HAIR_STYLES} ></div>
          <MuiThemeProvider>
            <AutoComplete 
              className="head"
              filter={this.props.filter}
              id={HEAD_INPUT_ID}
              underlineStyle={{display: 'none'}}
              searchText={this.props.internalState}
              dataSource={this.props.dataSource} 
              inputStyle={{textAlign: 'center', color: this.props.fontColor}}
              style={{width: 150}}
              textFieldStyle={(this.props.head_styles)?(generate_head_style(this.props.head_styles)):generate_head_style()}
              onUpdateInput={this.props.onUpdateInput}
              maxLength={HEAD_INPUT_MAXLENGTH}
              disabled={this.props.isRunning || this.props.isEdittingExpectedTape}
              >
            </AutoComplete>
          </MuiThemeProvider>
          <div className="neck"></div>
          <div className="shoulder"></div>
        </div>
      </Draggable>
      </div>
      );
  }
}

Head.PropTypes = {
  handleStart: PropTypes.func.isRequired,
  handleDrag: PropTypes.func.isRequired,
  handleStop: PropTypes.func.isRequired,
  onFocus: PropTypes.func.isRequired,
  hair_styles: PropTypes.object.isRequired,
  head_styles: PropTypes.object.isRequired,
  internalState: PropTypes.string.isRequired,
}

export default Head;