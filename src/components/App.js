/* eslint max-len: 0 */
import React from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';

class Square extends React.Component {
  render() {
    return (
      <input className="square">
        {/* TODO */}
      </input>
    );
  }
}

class Head extends React.Component {
  render() {
    return (
      <Draggable
        axis="x"
        handle=".header"
        defaultPosition={{x: 9, y: 0}}
        position={null}
        grid={[49, 49]}
        zIndex={100}
        bounds={{left: 9, top: 0, right: 989, bottom: 0}}
        onStart={this.handleStart}
        onDrag={this.handleDrag}
        onStop={this.handleStop}>
        <div className="header">
          <button className="head">0</button>
          <div className="neck"></div>
          <div className="shoulder"></div>
        </div>
      </Draggable>
      );
  }
}

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

class RuleTable extends React.Component {
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

class App extends React.Component {
  renderSquare(i) {
    return <Square />;
  }
  renderHead(i) {
    return <Head />;
  }
  renderTable() {
    return <RuleTable />;
  }
  render() {
    return (
      <div>
        <div className="head-row">
        {this.renderHead(0)}
        </div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
          {this.renderSquare(9)}
          {this.renderSquare(10)}
          {this.renderSquare(11)}
          {this.renderSquare(12)}
          {this.renderSquare(13)}
          {this.renderSquare(14)}
          {this.renderSquare(15)}
          {this.renderSquare(16)}
          {this.renderSquare(17)}
          {this.renderSquare(18)}
          {this.renderSquare(19)}
          {this.renderSquare(20)}
        </div>
        <div>
          {this.renderTable()}
        </div>
      </div>
    );
  }
}

export default App;