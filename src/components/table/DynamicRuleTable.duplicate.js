import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {Table, TableBody, TableHeader, TableHeaderColumn, TableRow, TableRowColumn} from 'material-ui/Table';
import {Card, CardActions } from 'material-ui/Card';
import DeleteRowButton from '../../containers/table/DeleteRowButtonContainer';
import SwitchDirectionButton from '../../containers/table/SwitchDirectionButtonContainer';
import AutoCompleteField from '../../containers/table/AutoCompleteFieldContainer';
import { LEFT, RIGHT } from '../../constants/ReservedWords';
import {
  TABLE_HEIGHT,
  TABLE_HEAD_BLANK_WIDTH,
  TABLE_ROW_DELETE_WIDTH,
  TABLE_ROW_INPUT_WIDTH,
  TABLE_ROW_STATE_WIDTH,
  AUTO_COMPLETE_MAX_LENGTH
} from '../../constants/GUISettings';

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


class DynamicRuleTable extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      rowHighlighted: false,
    };

    this.onFocus = () => {
      this.setState({rowHighlighted: true});
    }
    this.onBlur = () => {
      this.setState({rowHighlighted: false});
    }

  }
  shouldComponentUpdate(nextProps) {
    if (this.props.rowsById.length !== nextProps.rowsById.length ||
        this.props.highlightedRow !== nextProps.highlightedRow) {
      return true;
    }


    for (var i = 0; i < this.props.rowsById.length; i++) {
      let thisRow = this.props.rowsById[i], nextRow = nextProps.rowsById[i];
      if (thisRow.in_state !== nextRow.in_state ||
          thisRow.read !== nextRow.read ||
          thisRow.write !== nextRow.write ||
          thisRow.new_state !== nextRow.new_state ||
          thisRow.isLeft !== nextRow.isLeft) {
        return true;
      }
    }

    return false;
  }
  render() {
    return (
      <div className='card-of-rule-table'>
      <MuiThemeProvider>
      <Card>
          <CardActions>
            <MuiThemeProvider>
              <FlatButton label="Add Rule" primary={true} onTouchTap={this.props.addRow}/>
            </MuiThemeProvider>  
           </CardActions>   
          <div className="rule-table"> 
            <MuiThemeProvider>
              <Table fixedHeader={true} height={TABLE_HEIGHT} style={{overflowX: "auto"}}>
                <TableHeader displaySelectAll={false}>
                  <TableRow>
                    <TableHeaderColumn style={{width:TABLE_HEAD_BLANK_WIDTH}}></TableHeaderColumn>
                    <TableHeaderColumn >Current State</TableHeaderColumn>
                    <TableHeaderColumn >Read</TableHeaderColumn>
                    <TableHeaderColumn >Write</TableHeaderColumn>
                    <TableHeaderColumn >Move Direction</TableHeaderColumn>
                    <TableHeaderColumn >New State</TableHeaderColumn>
                  </TableRow>
                </TableHeader>
                <TableBody displayRowCheckbox={false}>

                  {this.props.rowsById.map((id) => (

                    <TableRow striped={true} key={id} id={id} selectable={false} 
                      onFocus={this.onFocus}
                      onBlur={this.onBlur}
                      style={(this.props.highlightedRow === id)?{backgroundColor: "#87dbff"}:{backgroundColor: "#fff"}}>
                      <TableRowColumn style={{width:TABLE_ROW_DELETE_WIDTH}}>
                        <DeleteRowButton parent={id} id={standardizeDeleteButtonId(id)} />  
                      </TableRowColumn>

                      <TableRowColumn>
                          <AutoCompleteField parent={id} fieldType={FIELD_TYPES[0]} openOnFocus={true} styles={{width:TABLE_ROW_STATE_WIDTH}} maxLength={AUTO_COMPLETE_MAX_LENGTH} id={standardizeCurrentStateFieldId(id)} />
                      </TableRowColumn>
                        
                      <TableRowColumn>
                          <AutoCompleteField parent={id} fieldType={FIELD_TYPES[1]} openOnFocus={true} styles={{width:TABLE_ROW_INPUT_WIDTH}} maxLength="1" id={standardizeReadFieldId(id)} />
                      </TableRowColumn>
                        
                      <TableRowColumn>
                          <AutoCompleteField parent={id} fieldType={FIELD_TYPES[2]} openOnFocus={true} styles={{width:TABLE_ROW_INPUT_WIDTH}} maxLength="1" id={standardizeWriteFieldId(id)} />
                      </TableRowColumn>

                      <TableRowColumn>
                          <SwitchDirectionButton parent={id} fieldType={FIELD_TYPES[3]} id={standardizeDirectionFieldId(id)} />
                      </TableRowColumn>
                        
                      <TableRowColumn>
                          <AutoCompleteField parent={id} fieldType={FIELD_TYPES[4]} openOnFocus={true} styles={{width:TABLE_ROW_STATE_WIDTH}} maxLength={AUTO_COMPLETE_MAX_LENGTH} id={standardizeNewStateFieldId(id)} />
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
  rowsById: PropTypes.array.isRequired,
  highlightedRow: PropTypes.string.isRequired
}

export default DynamicRuleTable;