import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete-forever';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { TABLE_ROW_NO_COL_STYLE } from '../../constants/components/Table';

class DeleteRowButton extends React.Component {
  shouldComponentUpdate(nextProps, nextState) {
    return false;
  }
	render() {
    return (
    	<MuiThemeProvider>
          <div>
          <p style={TABLE_ROW_NO_COL_STYLE.style}>{(this.props.rowNum) +"."}</p>
          <IconButton  
          onTouchTap={this.props.deleteRow}
          id={this.props.id}>
          <Delete />
          </IconButton>
          </div>
        </MuiThemeProvider>
        )
	}
}

DeleteRowButton.PropTypes = {
	deleteRow: PropTypes.func.isRequired,
	parent: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default DeleteRowButton;