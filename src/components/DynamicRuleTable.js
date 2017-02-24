import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions } from 'material-ui/Card';
import DeleteRowButton from '../containers/DeleteRowButtonContainer';
import SwitchDirectionButton from '../containers/SwitchDirectionButtonContainer';
import AutoCompleteField from '../containers/AutoCompleteFieldContainer';
import { LEFT, RIGHT } from '../constants/ReservedWords';

export const FIELD_TYPES = ["Current State", "Read", "Write", "Direction", "New State"];

var DELETE_BUTTON_ID_PREFIX = "delete-row-button-of-";
var CURRENT_STATE_COL_ID_PREFIX = "current_state-of-";
var READ_COL_ID_PREFIX = "read-of-";
var WRITE_COL_ID_PREFIX = "write-of-";
var DIRECTION_COL_ID_PREFIX = "direction-of-";
var NEW_STATE_COL_ID_PREFIX = "new_state-of-";

export const standardizeDeleteButtonId = (id) => (DELETE_BUTTON_ID_PREFIX + id);

export const standardizeCurrentStateFieldId = (id) => (CURRENT_STATE_COL_ID_PREFIX + id);

export const standardizeReadFieldId = (id) => (READ_COL_ID_PREFIX + id);

export const standardizeWriteFieldId = (id) => (WRITE_COL_ID_PREFIX + id);

export const standardizeDirectionFieldId = (id) => (DIRECTION_COL_ID_PREFIX + id);

export const standardizeNewStateFieldId = (id) => (NEW_STATE_COL_ID_PREFIX + id);

export const translateDirectionValue = (flag) => ( (flag === 'true') ? LEFT : RIGHT ); // true: LEFT, false: RIGHT

export const getRowData = (parent) => {
  var results = [];

  var current_state = document.getElementById(standardizeCurrentStateFieldId(parent)).value;
  results.push(current_state);

  var read = document.getElementById(standardizeReadFieldId(parent)).value;
  results.push(read);

  var write = document.getElementById(standardizeWriteFieldId(parent)).value;
  results.push(write);

  var direction = document.getElementById(standardizeDirectionFieldId(parent)).value;
  results.push(direction);

  var new_state = document.getElementById(standardizeNewStateFieldId(parent)).value;
  results.push(new_state)

  return results;
}


class DynamicRuleTable extends React.Component {
  render() {
    return (
      <div className='card-of-rule-table'>
      <MuiThemeProvider>
      <Card>
        <div className="rule-table">
          <CardActions>
            <MuiThemeProvider>
              <FlatButton label="Add Rule" primary={true} onTouchTap={this.props.addRow} />
            </MuiThemeProvider>  
           </CardActions>    
          <MuiThemeProvider>
            <Table>
              <TableHeader displaySelectAll={false}>
                <TableRow>
                  <TableHeaderColumn style={{width:50}}></TableHeaderColumn>
                  <TableHeaderColumn >Current State</TableHeaderColumn>
                  <TableHeaderColumn >Read</TableHeaderColumn>
                  <TableHeaderColumn >Write</TableHeaderColumn>
                  <TableHeaderColumn >Move Direction</TableHeaderColumn>
                  <TableHeaderColumn >New State</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} >

                {this.props.state.rowsById.map((id) => (

                  <TableRow striped={true} key={id} id={id} selectable={false}>
                    <TableRowColumn style={{width:90}}>
                      <DeleteRowButton parent={id} id={standardizeDeleteButtonId(id)} />  
                    </TableRowColumn>

                    <TableRowColumn>
                        <AutoCompleteField parent={id} fieldType={FIELD_TYPES[0]} styles={{width:180}} id={standardizeCurrentStateFieldId(id)} />
                    </TableRowColumn>
                      
                    <TableRowColumn>
                        <AutoCompleteField parent={id} fieldType={FIELD_TYPES[1]} openOnFocus={true} styles={{width:80}} maxLength="1" id={standardizeReadFieldId(id)} />
                    </TableRowColumn>
                      
                    <TableRowColumn>
                        <AutoCompleteField parent={id} fieldType={FIELD_TYPES[2]} openOnFocus={true} styles={{width:80}} maxLength="1" id={standardizeWriteFieldId(id)} />
                    </TableRowColumn>

                    <TableRowColumn>
                        <SwitchDirectionButton parent={id} fieldType={FIELD_TYPES[3]} value={true} id={standardizeDirectionFieldId(id)} />
                    </TableRowColumn>
                      
                    <TableRowColumn>
                        <AutoCompleteField parent={id} fieldType={FIELD_TYPES[4]} styles={{width:180}} id={standardizeNewStateFieldId(id)} />
                    </TableRowColumn>
                </TableRow>
                ))}

            </TableBody>
            </Table>
          </MuiThemeProvider>
        </div>
      </Card>
      </MuiThemeProvider>
      </div>
    )
  }
}

DynamicRuleTable.PropTypes = {
  addRow: PropTypes.func.isRequired,
  state: PropTypes.object.isRequired
}

export default DynamicRuleTable;