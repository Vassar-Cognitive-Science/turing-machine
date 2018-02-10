import React from 'react';
import FlatButton from 'material-ui/RaisedButton';
import { Card, CardActions } from 'material-ui/Card';

import RowItem from '../../containers/table/RowItemContainer';
import withDragDropContext from './withDragDropContext';

const style = {
  TableContainer: {
    width: '90%',
    margin: '0 auto',
    height: 'auto',
    paddingBotton: '20px'
  },
  BlankHeader: {
    width: '100%',
    padding: '10px'
  },
  Table: {
    width: '90%',
    margin: '0 auto',
  },
  AddButtonContainer: {
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    padding: '30px'
  }
}

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
      <div style={{...style.TableContainer}}>
          <Card>
              {
                this.props.rowsById.length > 0 ?
                <div style={{...style.BlankHeader}} /> :
                null
              }
               <div style={{...style.Table}}>
                  {this.props.rowsById && this.props.rowsById.map(
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
                <div style={{...style.AddButtonContainer}}>
                  <FlatButton label="Add Rule" primary={true} onClick={this.props.addRow}/>
               </div> 
          </Card>
      </div>
    )
  }
}

export default withDragDropContext(DynamicRuleTable);