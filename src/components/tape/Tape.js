import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import RollRight from 'material-ui/svg-icons/av/fast-forward';
import RollLeft from 'material-ui/svg-icons/av/fast-rewind';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { TAPE_ICON_STYLES } from '../../constants/GUISettings';
import { Card } from 'material-ui/Card';
import { standardizeCellId } from '../../reducers/tape';
import Square from '../../containers/tape/SquareContainer';
import Head from '../../containers/tape/HeadContainer';

import Swap from 'material-ui/svg-icons/action/autorenew';
import FlatButton from 'material-ui/FlatButton';

export const MARK_FIRST = "first";
export const MARK_LAST = "last";

function populatedSquares(size) {
  var squares = [];
  for (var i = 0; i < size; i++)
    squares.push(i);
  return squares;
}

class Tape extends React.Component {
  render() {
    return (
      <div className="card-of-tape">
         <MuiThemeProvider>
          <Card>
            <div className="machine-reported-error" 
              style={{visibility:(this.props.showReportedError)?"visible":"hidden", color: this.props.messageColor}}>
              {this.props.machineReportError}
            </div>
            {(this.props.isEdittingTrial) ? <FlatButton
                                              label={(this.props.isEdittingExpectedTape) ? "Expected Tape": "Start Tape"}
                                              labelPosition="after"
                                              primary={true}
                                              icon={<Swap />}
                                            /> :
                                            null}
            <div className="step-count">
              {(!this.props.isEdittingTrial) ? <p>Step: {this.props.stepCount}</p> : 
                null}
            </div>

            <div className="tape-with-button">
              <div className="roll-left"><IconButton tooltip="Roll Left" 
                onTouchTap={this.props.rollLeft} touch={true} style={TAPE_ICON_STYLES.style} 
                iconStyle={TAPE_ICON_STYLES.mediumIcon} tooltipPosition="bottom-left" disabled={this.props.isRunning}><RollLeft /></IconButton></div>
              <Head />
              {populatedSquares(this.props.cellNum).map((i) => {
                let mark = i;
                if (i === 0) mark = MARK_FIRST;
                if (i === this.props.cellNum - 1) mark = MARK_LAST;
                return <Square key={standardizeCellId(i)} order={i} mark={mark} id={standardizeCellId(i)} />
                })}
              <div className="roll-right"><IconButton tooltip="Roll Right" 
                onTouchTap={this.props.rollRight} touch={true} style={TAPE_ICON_STYLES.style} 
                iconStyle={TAPE_ICON_STYLES.mediumIcon} tooltipPosition="bottom-right" disabled={this.props.isRunning}><RollRight /></IconButton>
              </div>
            </div>
          </Card>
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
