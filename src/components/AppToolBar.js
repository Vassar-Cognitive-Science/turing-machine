import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarGroup, ToolbarSeparator, ToolbarTitle } from 'material-ui/Toolbar';
import Slider from 'material-ui/Slider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Next from 'material-ui/svg-icons/av/skip-next';
import Last from 'material-ui/svg-icons/av/skip-previous';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AppToolBar extends React.Component {
	render() {
		return (
			<div className='app-bar'>
			<div>
				<MuiThemeProvider>
					<AppBar title={"Turing Machine Simulator"} />
				</MuiThemeProvider>
			</div>
			<div>
			<MuiThemeProvider>
			<Toolbar>
				<ToolbarGroup firstChild={true}>
					<IconButton tooltip="Last" touch={true} tooltipPosition="bottom-left"><Last /></IconButton>
					<IconButton tooltip="Run" touch={true} tooltipPosition="bottom-left"><Play /></IconButton>
					<IconButton tooltip="Next" touch={true} tooltipPosition="bottom-left"><Next /></IconButton>
					<ToolbarSeparator />
					<FlatButton label="Speed" />
					<Slider style={{width: 100}} sliderStyle={{bottom: -12}} axis="x" />
					<ToolbarSeparator />
				</ToolbarGroup>
				<ToolbarGroup lastChild={true}>
					<FlatButton label="Save" />
					<FlatButton label="Help" />
				</ToolbarGroup>
		    </Toolbar>
		    </MuiThemeProvider>
		    </div>
		    </div>
		)
	}
}

AppToolBar.PropTypes = {
	
};

export default AppToolBar;