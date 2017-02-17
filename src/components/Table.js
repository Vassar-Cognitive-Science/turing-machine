import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

const cellEditProp = {
  mode: 'dbclick'
};

const rules = [{
  id: "cell-0",
  in_state: 0,
  read: 1,
  write: -1,
  direction: "Right",
  new_state: 1
}];

class Checkbox extends React.Component {
  componentDidMount() { this.update(this.props.checked); }
  componentWillReceiveProps(props) { this.update(props.checked); }
  update(checked) {
    ReactDOM.findDOMNode(this).indeterminate = checked === 'indeterminate';
  }
  render() {
    return (
      <input className='react-bs-select-all'
        type='checkbox'
        name={ 'checkbox' + this.props.rowIndex }
        id={ 'checkbox' + this.props.rowIndex }
        checked={ this.props.checked }
        onChange={ this.props.onChange } />
    );
  }
}

class Table extends React.Component {
  createCustomModalFooter = (onClose, onSave) => {
    const style = {
      backgroundColor: '#ffffff'
    };
    return (
      <div className='modal-footer' style={ style }>
        <h3>Its a Custom footer</h3>
        <button className='btn btn-xs btn-info' onClick={ onClose }>Leave</button>
        <button className='btn btn-xs btn-danger' onClick={ onSave }>Confirm</button>
      </div>
    );
  };
  customMultiSelect(props) {
    const { type, checked, disabled, onChange, rowIndex } = props;
    /*
    * If rowIndex is 'Header', means this rendering is for header selection column.
    */
    if (rowIndex === 'Header') {
      return (
        <div className='checkbox-personalized'>
          <Checkbox {...props}/>
          <label htmlFor={ 'checkbox' + rowIndex }>
            <div className='check'></div>
          </label>
        </div>);
    } else {
      return (
        <div className='checkbox-personalized'>
          <input
            type={ type }
            name={ 'checkbox' + rowIndex }
            id={ 'checkbox' + rowIndex }
            checked={ checked }
            disabled={ disabled }
            onChange={ e=> onChange(e, rowIndex) }
            ref={ input => {
              if (input) {
                input.indeterminate = props.indeterminate;
              }
            } }/>
          <label htmlFor={ 'checkbox' + rowIndex }>
            <div className='check'></div>
          </label>
        </div>);
    }
  }
  render() {
    const options = {
       insertModalFooter: this.createCustomModalFooter
    };
    const selectRow = {
      mode: 'checkbox', //radio or checkbox
      customComponent: this.customMultiSelect
    };
    return (
      <BootstrapTable data={ rules } height='150' hover
      cellEdit={ cellEditProp } scrollTop={ 'Bottom' } 
      options={ options } insertRow selectRow={ selectRow } deleteRow
      tableStyle={ { border: '#0000FF 2.5px solid' } }
      containerStyle={ { border: '#FFBB73 2.5px solid' } }
      headerStyle={ { border: 'red 1px solid' } }
      bodyStyle={ { border: 'green 1px solid' } }>
          <TableHeaderColumn dataField='id' hidden={ true } isKey={ true }></TableHeaderColumn>
          <TableHeaderColumn dataField='in_state' width='14%'>In State</TableHeaderColumn>
          <TableHeaderColumn dataField='read' width='14%'>Read</TableHeaderColumn>
          <TableHeaderColumn dataField='write' width='14%'>Write</TableHeaderColumn>
          <TableHeaderColumn dataField='direction' width='14%'>Direction</TableHeaderColumn>
          <TableHeaderColumn dataField='new_state' width='14%'>New State</TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default Table;