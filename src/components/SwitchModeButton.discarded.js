import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import Done from 'material-ui/svg-icons/action/done';
import Edit from 'material-ui/svg-icons/editor/mode-edit';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const EDIT_MODE_ID_PRIFIX = "editMode-of-";

export const standardizeSwitchModeButtonId = (id) => (EDIT_MODE_ID_PRIFIX+id);

class SwitchModeButton extends React.Component {
	render() {
    return (
    	<MuiThemeProvider>
          <IconButton  
          onTouchTap={this.props.switchMode}
          parent={this.props.parent}
          value={this.props.value}>
          {(this.props.value)?<Edit />:<Done />}
          </IconButton>
        </MuiThemeProvider>
        )
	}
}

SwitchModeButton.PropTypes = {
	switchMode: PropTypes.func.isRequired,
	parent: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired
}

export default SwitchModeButton;