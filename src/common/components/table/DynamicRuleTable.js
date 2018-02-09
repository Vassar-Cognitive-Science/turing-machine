import React, { PropTypes } from 'react';
import FlatButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { Card, CardActions } from 'material-ui/Card';

import RowItem from '../../containers/table/RowItemContainer';
import withDragDropContext from './withDragDropContext';

import {
  TABLE_INPUT_COL_STYLE,
  TABLE_STATE_COL_STYLE,
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

  render() {
    var rowN = 0;

    return (
      <div className='card-of-rule-table'>
      <MuiThemeProvider>
        <Card>
            <div style={{width: '100%', padding: '10px'}} />
             <div className="rule-table-container">
                {this.props.rowsById.map(
                    (id, i) =>
                      (<RowItem 
                          rowNum={i+1}
                          index={i} 
                          key={`${id}-row`} 
                          id={id} 
                          isHighlighted={this.props.highlightedRow === id}
                        />)
                  )
                }
              </div>
              <div style={{width: '100%', display: 'flex', flexDirection: 'row-reverse', padding: '30px'}}>
                <FlatButton label="Add Rule" primary={true} onTouchTap={this.props.addRow}/>
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

export default withDragDropContext(DynamicRuleTable);