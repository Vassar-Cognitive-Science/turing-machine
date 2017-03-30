import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Table } from 'react-bootstrap';
import {Card, CardActions } from 'material-ui/Card';
import DeleteRowButton from '../../containers/table/DeleteRowButtonContainer';
import SwitchDirectionButton from '../../containers/table/SwitchDirectionButtonContainer';
import AutoCompleteField from '../../containers/table/AutoCompleteFieldContainer';
import {
  TABLE_INPUT_COL_STYLE,
  TABLE_STATE_COL_STYLE,
  TABLE_ROW_NO_COL_STYLE
} from '../../constants/components/Table';

export const FIELD_TYPES = ["Current State", "Read", "Write", "Direction", "New State"];

const highlightColor = "#87dbff";
const normalColor = "#fff";

let DELETE_BUTTON_ID_PREFIX = "delete-row-button-of-";
let CURRENT_STATE_COL_ID_PREFIX = "current_state-of-";
let READ_COL_ID_PREFIX = "read-of-";
let WRITE_COL_ID_PREFIX = "write-of-";
let DIRECTION_COL_ID_PREFIX = "direction-of-";
let NEW_STATE_COL_ID_PREFIX = "new_state-of-";

export const standardizeDeleteButtonId = (id) => (DELETE_BUTTON_ID_PREFIX + id);

export const standardizeCurrentStateFieldId = (id) => (CURRENT_STATE_COL_ID_PREFIX + id);

export const standardizeReadFieldId = (id) => (READ_COL_ID_PREFIX + id);

export const standardizeWriteFieldId = (id) => (WRITE_COL_ID_PREFIX + id);

export const standardizeDirectionFieldId = (id) => (DIRECTION_COL_ID_PREFIX + id);

export const standardizeNewStateFieldId = (id) => (NEW_STATE_COL_ID_PREFIX + id);


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
    var rowN = 0;

    return (
      <div className='card-of-rule-table'>
      <MuiThemeProvider>
      <Card>
          <CardActions>
            <MuiThemeProvider>
              <FlatButton label="Add Rule" primary={true} onTouchTap={this.props.addRow}/>
            </MuiThemeProvider>  
           </CardActions>   
           <div className="rule-table-container">
            <Table responsive condensed > 
              <thead>
                <tr>
                  <th></th>
                  <th>Current State</th>
                  <th>Read</th>
                  <th>Write</th>
                  <th>Move Direction</th>
                  <th>New State</th>
                </tr>
              </thead>
                 <tbody>
                  {this.props.rowsById.map((id) => {
                    return (
                    <tr id={id} key={id} style={(this.props.highlightedRow === id)?
                      {backgroundColor: highlightColor }:{backgroundColor: normalColor}}>
                      <td>
                        <p style={TABLE_ROW_NO_COL_STYLE.style}>{(++rowN) +"."}</p>
                        <DeleteRowButton parent={id} id={standardizeDeleteButtonId(id)} />
                      </td>

                      <td>
                          <AutoCompleteField parent={id} fieldType={FIELD_TYPES[0]} 
                          openOnFocus={true} styles={TABLE_STATE_COL_STYLE.style} 
                          maxLength={TABLE_STATE_COL_STYLE.maxLength} id={standardizeCurrentStateFieldId(id)} />
                      </td>
                        
                      <td>
                          <AutoCompleteField parent={id} fieldType={FIELD_TYPES[1]} 
                          openOnFocus={true} styles={TABLE_INPUT_COL_STYLE.style} maxLength={TABLE_INPUT_COL_STYLE.maxLength}
                          id={standardizeReadFieldId(id)} />
                      </td>
                        
                      <td>
                          <AutoCompleteField parent={id} fieldType={FIELD_TYPES[2]} 
                          openOnFocus={true} styles={TABLE_INPUT_COL_STYLE.style} 
                          maxLength={TABLE_INPUT_COL_STYLE.maxLength} id={standardizeWriteFieldId(id)} />
                      </td>

                      <td>
                          <SwitchDirectionButton parent={id} fieldType={FIELD_TYPES[3]} 
                          id={standardizeDirectionFieldId(id)} />
                      </td>
                        
                      <td>
                          <AutoCompleteField parent={id} fieldType={FIELD_TYPES[4]} 
                          openOnFocus={true} styles={TABLE_STATE_COL_STYLE.style} 
                          maxLength={TABLE_STATE_COL_STYLE.maxLength} id={standardizeNewStateFieldId(id)} />
                      </td>
                  </tr>
                  )})}
                </tbody>
              </Table>
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