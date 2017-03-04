import React, { PropTypes, Component } from 'react';
import AppBar from 'material-ui/AppBar';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import IconMenu from 'material-ui/IconMenu';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Play from 'material-ui/svg-icons/av/play-arrow';
import Next from 'material-ui/svg-icons/av/skip-next';
import Last from 'material-ui/svg-icons/av/skip-previous';
import Pause from 'material-ui/svg-icons/av/pause';
import Redo from 'material-ui/svg-icons/content/redo';
import Undo from 'material-ui/svg-icons/content/undo';
import Test from 'material-ui/svg-icons/action/bug-report';
import Restore from 'material-ui/svg-icons/action/restore';
import Save from 'material-ui/svg-icons/content/save';
import Clear from 'material-ui/svg-icons/content/delete-sweep';
import Popover from 'material-ui/Popover';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import { grey50, grey900 } from 'material-ui/styles/colors';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AppToolBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
      		open: false,
    	};

		this.handleTouchTap = (event) => {
			// This prevents ghost click.
			event.preventDefault();

			this.setState({
				open: true,
				anchorEl: event.currentTarget,
			});
		};
		this.handleRequestClose = () => {
			this.setState({
				open: false,
			});
		};
	}

	render() {
		return (
			<div className='app-bar'>
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
						/>
					</MuiThemeProvider>
				</div>
				<div>
					<MuiThemeProvider>
						<Toolbar>
							<ToolbarGroup firstChild={true}>

								<IconButton tooltip="Last" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleLast}><Last /></IconButton>

								{(this.props.isRunning)?
									<IconButton tooltip="Pause" touch={true} tooltipPosition="bottom-right" 
										onTouchTap={this.props.handlePause}><Pause /></IconButton>:
									<IconButton tooltip="Run" touch={true} tooltipPosition="bottom-right"
										onTouchTap={this.props.handleRun}><Play /></IconButton>}

								<IconButton tooltip="Next" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleNext}><Next /></IconButton>

								<IconButton tooltip="Restore" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleRestore}><Restore /></IconButton>

								<ToolbarSeparator />

								<FlatButton label="Speed" disabled={true} labelStyle={{color: grey900}} />
								<Slider style={{width: 100}} sliderStyle={{bottom: -12}} axis="x"  
									min={0.1} max={3} step={0.1}
									defaultValue={1} value={this.props.animationSpeed} 
									onChange={this.props.handleSpeedChange} />
								<FlatButton label={this.props.animationSpeedLabel} disabled={true} 
									labelStyle={{textTransform: "lowercase", color: grey900}}/>

								<ToolbarSeparator />

								<IconButton tooltip="Undo" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleUndo}><Undo /></IconButton>

								<IconButton tooltip="Redo" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleRedo}><Redo /></IconButton>

								<ToolbarSeparator />

								<IconButton tooltip="Test" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleTest}><Test /></IconButton>

								<IconButton tooltip="Save" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleSave}><Save /></IconButton>

								<ToolbarSeparator />
							</ToolbarGroup>

							<ToolbarGroup lastChild={true}>

								<IconButton  touch={true} tooltipPosition="bottom-left"
									onTouchTap={this.handleTouchTap}><Clear /></IconButton>
								<Popover
						          open={this.state.open}
						          anchorEl={this.state.anchorEl}
						          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
          						  targetOrigin={{horizontal: 'left', vertical: 'top'}}
						          onRequestClose={this.handleRequestClose}
						        >
						       <Menu>
					            <MenuItem primaryText="Clear Tape" onTouchTap={this.props.handleClearTape}/>
					            <Divider />
					            <MenuItem primaryText="Clear Machine" onTouchTap={this.props.handleClearMachine}/>
					          </Menu>
								</Popover>

							</ToolbarGroup>
					    </Toolbar>
				    </MuiThemeProvider>
			    </div>
		    </div>
		)
	}
}

AppToolBar.PropTypes = {
	isPaused: PropTypes.bool.isRequired,
	animationSpeedLabel: PropTypes.string.isRequired,
	animationSpeed: PropTypes.number.isRequired,

	handleRun: PropTypes.func.isRequired,
	handlePause: PropTypes.func.isRequired,
	handleLast: PropTypes.func.isRequired,
	handleNext: PropTypes.func.isRequired,
	handleRestore: PropTypes.func.isRequired,
	handleUndo: PropTypes.func.isRequired,
	handleRedo: PropTypes.func.isRequired,
	handleTest: PropTypes.func.isRequired,
	handleSave: PropTypes.func.isRequired,
	handleClearMachine: PropTypes.func.isRequired,
	handleClearTape: PropTypes.func.isRequired,
};

export default AppToolBar;