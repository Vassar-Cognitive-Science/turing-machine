import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import TextField from 'material-ui/TextField';
import DeleteRowButton from '../containers/DeleteRowButtonContainer';
import SwitchDirectionButton from '../containers/SwitchDirectionButtonContainer';
import AutoCompleteField from '../containers/AutoCompleteFieldContainer';


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


class DynamicRuleTable extends React.Component {
  render() {
    return (
      <div>
        <div>
          <MuiThemeProvider>
            <FlatButton label="Add Row" primary={true} onTouchTap={this.props.addRow} />
          </MuiThemeProvider>  
        </div>    
        <MuiThemeProvider>
          <Table>
            <TableHeader displaySelectAll={false}>
              <TableRow>
                <TableHeaderColumn style={{width:50}}></TableHeaderColumn>
                <TableHeaderColumn>Current State</TableHeaderColumn>
                <TableHeaderColumn>Read</TableHeaderColumn>
                <TableHeaderColumn>Write</TableHeaderColumn>
                <TableHeaderColumn style={{width:150}}>Move Direction</TableHeaderColumn>
                <TableHeaderColumn>New State</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false}>

              {this.props.state.rowsById.map((id) => (

                <TableRow striped={true} key={id} id={id} selectable={false}>
                  <TableRowColumn style={{width:100}}>
                    <DeleteRowButton parent={id} id={standardizeDeleteButtonId(id)} />  
                  </TableRowColumn>

                  <TableRowColumn>
                      <AutoCompleteField parent={id} editable={true} id={standardizeCurrentStateFieldId(id)} />
                  </TableRowColumn>
                    
                  <TableRowColumn>
                      <AutoCompleteField parent={id} editable={true} id={standardizeReadFieldId(id)} />
                  </TableRowColumn>
                    
                  <TableRowColumn>
                      <AutoCompleteField parent={id} editable={true} id={standardizeWriteFieldId(id)} />
                  </TableRowColumn>

                  <TableRowColumn style={{width:150}}>
                      <SwitchDirectionButton parent={id} value={true} id={standardizeDirectionFieldId(id)} />
                  </TableRowColumn>
                    
                  <TableRowColumn>
                      <AutoCompleteField parent={id} editable={true} id={standardizeNewStateFieldId(id)} />
                  </TableRowColumn>
              </TableRow>
              ))}

          </TableBody>
          </Table>
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