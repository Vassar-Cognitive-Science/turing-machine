import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
  INIT_HAIR_STYLES,
  INIT_HEAD_STYLES,
  HEAD_LEFT_BOUNDARY,
  HEAD_MOVE_INTERVAL,
  AUTO_COMPLETE_MAX_LENGTH
} from '../../constants/GUISettings';

export const HEAD_INPUT_ID = 'HEAD_INPUT_1';

class Head extends React.Component {
  render() {
    return (
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
        disabled={this.props.isRunning}>
        <div  className="header">
          <div className="hair" style={(this.props.hair_styles)?(this.props.hair_styles):INIT_HAIR_STYLES} ></div>
          <MuiThemeProvider>
            <AutoComplete 
              className="head"
              inputStyle={{"textAlign":"center"}}
              filter={(searchText, key) => (searchText === "" || key.startsWith(searchText))}
              id={HEAD_INPUT_ID}
              underlineStyle={{display: 'none'}}
              searchText={this.props.internalState}
              dataSource={this.props.dataSource} 
              textFieldStyle={(this.props.head_styles)?(this.props.head_styles):INIT_HEAD_STYLES}
              onUpdateInput={this.props.onUpdateInput}
              maxLength={AUTO_COMPLETE_MAX_LENGTH}
              disabled={this.props.isRunning}
              >
            </AutoComplete>
          </MuiThemeProvider>
          <div className="neck"></div>
          <div className="shoulder"></div>
        </div>
      </Draggable>
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