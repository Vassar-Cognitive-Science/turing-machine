import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import RollRight from 'material-ui/svg-icons/av/fast-forward';
import RollLeft from 'material-ui/svg-icons/av/fast-rewind';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { TAPE_ICON_STYLES } from '../../constants/components/Tape';
import { Card } from 'material-ui/Card';
import { standardizeCellId } from '../../reducers/tape';
import Square from '../../containers/tape/SquareContainer';
import Head from '../../containers/tape/HeadContainer';

import Swap from 'material-ui/svg-icons/action/autorenew';
import FlatButton from 'material-ui/FlatButton';
import Divider from 'material-ui/Divider';
import List from 'material-ui/List';
import MenuItem from 'material-ui/MenuItem';
import Subheader from 'material-ui/Subheader';
import TextField from 'material-ui/TextField';

import {
  cyan500 as primaryColor,
  pink400 as secondaryColor,
  indigo800 as promptColor,
  grey400 as disabledColor
} from 'material-ui/styles/colors';

export const MARK_FIRST = "first";
export const MARK_LAST = "last";

function populatedSquares(size) {
  var squares = [];
  for (var i = 0; i < size; i++)
    squares.push(i);
  return squares;
}

class Tape extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      editTrialName: false,
    };

    this.toggleEditTrialName = () => {
      this.setState({editTrialName: !this.state.editTrialName})
    }

  }


  render() {
    return (
      <div >
         <MuiThemeProvider>
         <div className="card-of-tape">
          <Card>
            <div className="machine-reported-error" 
              style={{visibility:(this.props.showReportedError)?"visible":"hidden", color: this.props.messageColor}}>
              {this.props.machineReportError}
            </div>

            {(this.props.isEdittingTrial) ? 
                                              <MuiThemeProvider>
                                              <div style={{display: "inline-block"}}>
                                              <FlatButton
                                              label={(this.props.isEdittingExpectedTape) ? "Expected Tape": "Start Tape"}
                                              labelPosition="after"
                                              primary={true}
                                              style={{
                                                color: (this.props.isEdittingExpectedTape) ? secondaryColor : primaryColor,
                                                }
                                              }
                                              onTouchTap={this.props.changeEdittingTarget}
                                              icon={<Swap 
                                                color={(this.props.isEdittingExpectedTape) ? secondaryColor : primaryColor}/>
                                              }
                                              />
                                              {
                                                (!this.state.editTrialName) ?
                                                <div className="TrialNameButton">
                                                  <FlatButton 
                                                  label={this.props.edittingTrial} 
                                                  onTouchTap={this.toggleEditTrialName} 
                                                  />
                                                  </div>:
                                                <TextField
                                                id="test-name-input"
                                                inputStyle={{fontSize: 16}}
                                                style={{width:"25%"}}
                                                defaultValue={this.props.edittingTrial}
                                                onChange={this.props.setTrialName}
                                                onBlur={this.toggleEditTrialName}
                                                />  
                                                }                                       
                                           <FlatButton
                                            label="Save" 
                                            primary={true}
                                            onTouchTap={this.props.handleSave}
                                            disabled={!this.props.anyChangeInTrial}
                                            />
                                            <FlatButton
                                            label="Exit" 
                                            secondary={true}
                                            onTouchTap={this.props.handleExit}
                                            />
                                            </div>
                                           </MuiThemeProvider>:
                                            null}

            {(!this.props.isEdittingTrial) ? 
              <div className="step-count"><p>Step: {this.props.stepCount}</p></div> : 
              null}

            <div className="whole-tape-wrapper">
              <div className="whole-tape">
                <Head />
                <div className="roll-left">
                  <IconButton tooltip="Roll Left" 
                    onTouchTap={this.props.rollLeft} touch={true} style={TAPE_ICON_STYLES.style} 
                    iconStyle={TAPE_ICON_STYLES.mediumIcon} tooltipPosition="bottom-left" disabled={this.props.isRunning}>
                    <RollLeft />
                  </IconButton>
                </div>
                {populatedSquares(this.props.cellNum).map((i) => {
                  let mark = i;
                  if (i === 0) mark = MARK_FIRST;
                  if (i === this.props.cellNum - 1) mark = MARK_LAST;
                  return <Square key={standardizeCellId(i)} order={i} mark={mark} id={standardizeCellId(i)} />
                  })}
                <div className="roll-right">
                  <IconButton tooltip="Roll Right" 
                    onTouchTap={this.props.rollRight} touch={true} style={TAPE_ICON_STYLES.style} 
                    iconStyle={TAPE_ICON_STYLES.mediumIcon} tooltipPosition="bottom-right" disabled={this.props.isRunning}>
                    <RollRight />
                  </IconButton>
              </div>
             </div>
            </div>
          </Card>
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}

Tape.PropTypes = {
  rollLeft: PropTypes.func.isRequired,
  rollRight: PropTypes.func.isRequired,
  showReportedError: PropTypes.bool.isRequired,
  machineReportError: PropTypes.string.isRequired,
}

export default Tape;
