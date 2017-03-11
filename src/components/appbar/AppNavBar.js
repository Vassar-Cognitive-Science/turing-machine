import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { grey50 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

class AppNavBar extends Component {
	render() {
		return (
		<div>
			<MuiThemeProvider>
				<AppBar title={"Turing Machine Simulator"} 
				iconElementLeft={
					<IconMenu
			          iconButtonElement={<IconButton ><Hamburger color={grey50} /></IconButton>}>
			          <MenuItem value="1" primaryText="Import" />
			          <MenuItem value="2" primaryText="Export" />
			          <Divider />
			          <MenuItem value="3" primaryText="Help" />
			        </IconMenu>
				}
				titleStyle={this.props.titleStyle}
				/>
			</MuiThemeProvider>
		</div>
		)
	}
}

export default AppNavBar;