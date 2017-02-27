import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Next from 'material-ui/svg-icons/av/skip-next';
import Last from 'material-ui/svg-icons/av/skip-previous';
import Pause from 'material-ui/svg-icons/av/pause';
import Stop from 'material-ui/svg-icons/av/stop';
import Redo from 'material-ui/svg-icons/content/redo';
import Undo from 'material-ui/svg-icons/content/undo';
import Test from 'material-ui/svg-icons/action/bug-report';
import Restore from 'material-ui/svg-icons/action/restore';
import Save from 'material-ui/svg-icons/content/save';
import Clear from 'material-ui/svg-icons/content/delete-sweep';
import Menu from 'material-ui/svg-icons/navigation/menu';
import { grey50 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AppToolBar extends React.Component {
	render() {
		return (
			<div className='app-bar'>
				<div>
					<MuiThemeProvider>
						<AppBar title={"Turing Machine Simulator"} 
						iconElementLeft={
							<IconMenu
					          iconButtonElement={<IconButton ><Menu color={grey50} /></IconButton>}
					        openDirection="bottom-right" >
					          <MenuItem value="1" primaryText="Import" />
					          <MenuItem value="2" primaryText="Export" />
					          <Divider />
					          <MenuItem value="3" primaryText="Help" />
					        </IconMenu>
						}
						/>
					</MuiThemeProvider>
				</div>
				<div>
					<MuiThemeProvider>
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<IconButton tooltip="Stop" touch={true} tooltipPosition="bottom-right"><Stop /></IconButton>
								<IconButton tooltip="Last" touch={true} tooltipPosition="bottom-right"><Last /></IconButton>
								<IconButton tooltip="Pause" touch={true} tooltipPosition="bottom-right"><Pause /></IconButton>
								<IconButton tooltip="Run" touch={true} tooltipPosition="bottom-right"><Play /></IconButton>
								<IconButton tooltip="Next" touch={true} tooltipPosition="bottom-right"><Next /></IconButton>
								<IconButton tooltip="Restore" touch={true} tooltipPosition="bottom-right"><Restore /></IconButton>
								<ToolbarSeparator />
								<FlatButton label="Speed" disabled={true} />
								<Slider style={{width: 100}} sliderStyle={{bottom: -12}} axis="x" />
								<FlatButton label="100" disabled={true} />
								<ToolbarSeparator />
								<IconButton tooltip="Undo" touch={true} tooltipPosition="bottom-right"><Undo /></IconButton>
								<IconButton tooltip="Redo" touch={true} tooltipPosition="bottom-right"><Redo /></IconButton>
								<ToolbarSeparator />
								<IconButton tooltip="Test" touch={true} tooltipPosition="bottom-right"><Test /></IconButton>
								<IconButton tooltip="Save" touch={true} tooltipPosition="bottom-right"><Save /></IconButton>
								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip="Clear Machine" touch={true} tooltipPosition="bottom-left"><Clear /></IconButton>
							</ToolbarGroup>
					    </Toolbar>
				    </MuiThemeProvider>
			    </div>
		    </div>
		)
	}
}

AppToolBar.PropTypes = {
	handlePlay: PropTypes.func.isRequired
};

export default AppToolBar;