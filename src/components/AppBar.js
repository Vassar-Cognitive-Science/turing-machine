import React, { PropTypes, Component } from 'react';
import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';
import IconButton from 'material-ui/IconButton';
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
import Hamburger from 'material-ui/svg-icons/navigation/menu';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MediaQuery from 'react-responsive';
import AppNavBar from './AppNavBar';

class AppToolBar extends Component {
	constructor(props) {
		super(props);

		this.state = {
			open: false,
		};
	}

	handleTouchTap = (event) => {
		// This prevents ghost click.
		event.preventDefault();

		this.setState({
			open: true,
			anchorEl: event.currentTarget,
		});
	};

	handleRequestClose = () => {
		this.setState({
			open: false,
		});
	};

	render() {
		return (
			<div className='app-bar'> 
				<MediaQuery minWidth={780}>
				<AppNavBar />
					<MuiThemeProvider>
					<div>
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

								<label className="speed-label">
									SPEED
								</label>
								<Slider style={{width: "7.2vw"}} sliderStyle={{bottom: -12}} axis="x"  
									min={0.1} max={3} step={0.1}
									defaultValue={1} value={this.props.animationSpeed} 
									onChange={this.props.handleSpeedChange} />
								<label className="speed-label">
									{this.props.animationSpeedLabel}
								</label>

								<ToolbarSeparator />

								<IconButton tooltip="Undo" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}><Undo /></IconButton>

								<IconButton tooltip="Redo" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}><Redo /></IconButton>

								<ToolbarSeparator />

								<IconButton tooltip="Test" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleTest}><Test /></IconButton>

								<IconButton tooltip="Save" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleSave}><Save /></IconButton>

								<ToolbarSeparator />
							</ToolbarGroup>

							<ToolbarGroup lastChild={true}>

								<IconButton  touch={true} tooltip="Clear Tape" tooltipPosition="bottom-left"
									onTouchTap={this.props.handleClearTape}><Clear /></IconButton>
							</ToolbarGroup>
					    </Toolbar>
			    	</div>
					</MuiThemeProvider>
			    	</MediaQuery>
			    <MediaQuery maxWidth={780} minWidth={550}>
			    <AppNavBar />
			    <MuiThemeProvider>
					<div>
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
								<label className="speed-label">
									SPEED: {this.props.animationSpeedLabel}
								</label>
								<Slider style={{width: "7.2vw"}} sliderStyle={{bottom: -12}} axis="x"  
									min={0.1} max={3} step={0.1}
									defaultValue={1} value={this.props.animationSpeed} 
									onChange={this.props.handleSpeedChange} />
								<ToolbarSeparator />
								<IconButton tooltip="Undo" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}><Undo /></IconButton>

								<IconButton tooltip="Redo" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}><Redo /></IconButton>
								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip="More tools" touch={true} tooltipPosition="bottom-left" 
							          onTouchTap={this.handleTouchTap}
							        ><Hamburger /></IconButton>
							        <Popover
							          open={this.state.open}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
							          targetOrigin={{horizontal: 'right', vertical: 'top'}}
							          onRequestClose={this.handleRequestClose}
							        >
							        <Menu>
							        	<MenuItem primaryText="Test" leftIcon={<Test />} onTouchTap={this.props.handleTest}/>
							        	<MenuItem primaryText="Save" leftIcon={<Save />} onTouchTap={this.props.handleSave}/>
							        	<Divider />
							        	<MenuItem primaryText="Clear Tape" leftIcon={<Clear/>} onTouchTap={this.props.handleClearTape}/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
					</MuiThemeProvider>
			    </MediaQuery>
			    <MediaQuery maxWidth={550} minWidth={400}>
			    <AppNavBar />
			    <MuiThemeProvider>
					<div>
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
								<label className="speed-label">
											SPEED: {this.props.animationSpeedLabel}
								</label>
								<Slider style={{width: "7.2vw"}} sliderStyle={{bottom: -12}} axis="x"  
									min={0.1} max={3} step={0.1}
									defaultValue={1} value={this.props.animationSpeed} 
									onChange={this.props.handleSpeedChange} />
								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip="More tools" touch={true} tooltipPosition="bottom-left" 
							          onTouchTap={this.handleTouchTap}
							        ><Hamburger /></IconButton>
							        <Popover
							          open={this.state.open}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
							          targetOrigin={{horizontal: 'right', vertical: 'top'}}
							          onRequestClose={this.handleRequestClose}
							        >
							        <Menu>
							       		<MenuItem primaryText="Undo" leftIcon={<Undo />} onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}/>
							        	<MenuItem primaryText="Redo" leftIcon={<Redo />} onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}/>
							        	<Divider />
							        	<MenuItem primaryText="Test" leftIcon={<Test />} onTouchTap={this.props.handleTest}/>
							        	<MenuItem primaryText="Save" leftIcon={<Save />} onTouchTap={this.props.handleSave}/>
							        	<Divider />
							        	<MenuItem primaryText="Clear Tape" leftIcon={<Clear/>} onTouchTap={this.props.handleClearTape}/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
					</MuiThemeProvider>
			    </MediaQuery>
			    <MediaQuery maxWidth={400}>
			    <AppNavBar titleStyle={{fontSize: 20}}/>
			    <MuiThemeProvider>
					<div>
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
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip="More tools" touch={true} tooltipPosition="bottom-left" 
							          onTouchTap={this.handleTouchTap}
							        ><Hamburger /></IconButton>
							        <Popover
							          open={this.state.open}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
							          targetOrigin={{horizontal: 'right', vertical: 'top'}}
							          onRequestClose={this.handleRequestClose}
							        >
							        <Menu>
							        	<MenuItem primaryText={"SPEED: " + this.props.animationSpeedLabel}
							        		rightIcon={<Slider style={{width: "50%", paddingBottom:12}} axis="x"  
											min={0.1} max={3} step={0.1}
											defaultValue={1} value={this.props.animationSpeed} 
											onChange={this.props.handleSpeedChange} />} />
										<Divider />
							       		<MenuItem primaryText="Undo" leftIcon={<Undo />} onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}/>
							        	<MenuItem primaryText="Redo" leftIcon={<Redo />} onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}/>
							        	<Divider />
							        	<MenuItem primaryText="Test" leftIcon={<Test />} onTouchTap={this.props.handleTest}/>
							        	<MenuItem primaryText="Save" leftIcon={<Save />} onTouchTap={this.props.handleSave}/>
							        	<Divider />
							        	<MenuItem primaryText="Clear Tape" leftIcon={<Clear/>} onTouchTap={this.props.handleClearTape}/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
					</MuiThemeProvider>
			    </MediaQuery>
		    </div>
		)
	}
}

AppToolBar.PropTypes = {
	isRunning: PropTypes.bool.isRequired,
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
	handleClearTape: PropTypes.func.isRequired,
};

export default AppToolBar;