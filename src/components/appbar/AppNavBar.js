import React, { Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { grey50 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import IconButton from 'material-ui/IconButton';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

class AppNavBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isPopped: false,
		};
	}

	handlePopoverTouchTap = (event) => {
		// This prevents ghost click.
		event.preventDefault();
		this.setState({
			isPopped: true,
			anchorEl: event.currentTarget,
		});
	};

	handlePopoverRequestClose = () => {
		this.setState({
			isPopped: false,
		});
	};

	render() {
		return (
		<div>
			<MuiThemeProvider>
				<AppBar 
				title={"Turing Machine Simulator"} 
				iconElementLeft={
					<div>
					<IconButton onTouchTap={this.handlePopoverTouchTap}><Hamburger color={grey50} /></IconButton>				
					<Popover
			          open={this.state.isPopped}
			          anchorEl={this.state.anchorEl}
			          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
	      			  targetOrigin={{horizontal: 'left', vertical: 'top'}}
			          onRequestClose={this.handlePopoverRequestClose}
			        >
					<Menu>
			          <MenuItem primaryText="Import" />
			          <MenuItem primaryText="Export" />
			          <Divider />
			          <MenuItem primaryText="Help" />
			        </Menu>
			        </Popover>
			        </div>
				}
				titleStyle={this.props.titleStyle}
				/>
			</MuiThemeProvider>
		</div>
		)
	}
}

export default AppNavBar;