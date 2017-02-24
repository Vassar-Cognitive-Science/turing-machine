import React, { PropTypes } from 'react';
import Draggable from 'react-draggable';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { INIT_HAIR_STYLES, INIT_HEAD_STYLES } from '../constants/index';

export const HEAD_INPUT_ID = 'HEAD_INPUT_1';

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
        <div  className="header">
          <div className="hair" style={(this.props.hair_styles)?(this.props.hair_styles):INIT_HAIR_STYLES} ></div>
          <MuiThemeProvider>
            <AutoComplete 
              inputStyle={{"textAlign":"center"}}
              className="head"
              id={HEAD_INPUT_ID}
              underlineStyle={{display: 'none'}}
              searchText={this.props.searchText}
              dataSource={this.props.dataSource} 
              textFieldStyle={(this.props.head_styles)?(this.props.head_styles):INIT_HEAD_STYLES}
              disabled={(this.props.editable)?!this.props.editable:false} 
              onUpdateInput={this.props.onUpdateInput} >
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
  styles: PropTypes.object.isRequired,
  onFocus: PropTypes.func.isRequired,
}

export default Head;