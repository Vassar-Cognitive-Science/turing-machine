import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const EDIT_MODE_ID_PRIFIX = "editMode-of-";

export const standardizeDeleteRowButtonId = (id) => (EDIT_MODE_ID_PRIFIX+id);

class DeleteRowButton extends React.Component {
	render() {
    return (
    	<MuiThemeProvider>
          <IconButton  
          onTouchTap={this.props.deleteRow}
          id={this.props.id}>
          <Delete />
          </IconButton>
        </MuiThemeProvider>
        )
	}
}

DeleteRowButton.PropTypes = {
	deleteRow: PropTypes.func.isRequired,
	parent: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired
}

export default DeleteRowButton;