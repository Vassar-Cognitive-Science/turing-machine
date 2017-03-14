import React, { PropTypes } from 'react';

import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import { List } from 'material-ui/List';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import CircularProgress from 'material-ui/CircularProgress';

/*Test Drawer*/
import Add from 'material-ui/svg-icons/content/add-circle';
import RunAllTests from 'material-ui/svg-icons/av/play-circle-filled';
import UploadTests from 'material-ui/svg-icons/file/file-upload';
import SaveTests from 'material-ui/svg-icons/file/cloud-upload';
/*Test Drawer*/

/*Toolbar*/
import Redo from 'material-ui/svg-icons/content/redo';
import Undo from 'material-ui/svg-icons/content/undo';
import Test from 'material-ui/svg-icons/action/bug-report';
import Save from 'material-ui/svg-icons/content/save';
import Clear from 'material-ui/svg-icons/content/delete-sweep';
import Hamburger from 'material-ui/svg-icons/navigation/menu';
/*Toolbar*/

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MediaQuery from 'react-responsive';
import AppNavBar from './AppNavBar';
import TrialItem from '../../containers/appbar/TrialItemContainer';
import {
	blue400 as testHeaderColor,
	pink500 as addTrialColor,
	blue600 as runAllTrialsColor,
	orange500 as uploadTestsColor,
	teal300 as saveTestsColor,
 } from 'material-ui/styles/colors';

import { DRAWER_STYLE, APPBAR_STYLES } from '../../constants/GUISettings';

const ProgressCircle = (size=30, color=testHeaderColor) => (
	<CircularProgress color={color} size={size} thickness={2.5} />
)

class AppToolBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			toolHamburger: false,
			trialDrawerToggle: false,
		};
	}

	handleTrialDrawerToggle = () => {
		this.setState({trialDrawerToggle: !this.state.trialDrawerToggle});
	}

	handleTrialDrawerClose = () => {
		this.setState({trialDrawerToggle: false});
	}

	handlePopoverTouchTap = (event) => {
		// This prevents ghost click.
		event.preventDefault();
		this.setState({
			toolHamburger: true,
			anchorEl: event.currentTarget,
		});
	};

	handlePopoverRequestClose = () => {
		this.setState({
			toolHamburger: false,
		});
	};

	render() {
		return (
			<div>
			<MuiThemeProvider>
					<Drawer
			          docked={false}
			          style={DRAWER_STYLE.style}
			          open={this.state.trialDrawerToggle}
			          onRequestChange={(open) => this.setState({trialDrawerToggle: open})}
			        >
			        <Subheader style={DRAWER_STYLE.subheadStyle}>{DRAWER_STYLE.subheadText}</Subheader>
			        <Divider />
			        <div style={DRAWER_STYLE.listStyle}>
			        <List>
			        	{this.props.testsById.map((id) => {
			        		if (this.props.runningTrials.includes(id))  {
			        			return (<MenuItem primaryText={id} key={id} rightIcon={ProgressCircle()}/>);
			        		}
			        		return (<TrialItem id={id} key={id} drawerCloseCallBack={this.handleTrialDrawerClose}/>)
			        	})}
			        </List>
			        </div>
			        <div style={DRAWER_STYLE.controlStyle}>
			        <Divider />
			        {(this.props.isRunningTrial) ?
						<MenuItem primaryText="Running All Tests..."  leftIcon={ProgressCircle()} /> :
						<MenuItem primaryText="Run Tests" leftIcon={<RunAllTests color={runAllTrialsColor}/>}
				 			onTouchTap={this.props.handleRunAllTests}/>}

			        <MenuItem primaryText="Add Test" leftIcon={<Add color={addTrialColor} />}
			         onTouchTap={this.props.handleAddTest}/>
			        <Divider />
			        <MenuItem primaryText="Upload Tests" leftIcon={<UploadTests color={uploadTestsColor} />}/>
			        <MenuItem primaryText="Save Tests" leftIcon={<SaveTests color={saveTestsColor} />}/>

			        </div>
			        </Drawer>
		    </MuiThemeProvider>


			<div className='app-bar'> 
				<MediaQuery minWidth={APPBAR_STYLES.breakPoints.desktop.minWidth}>
				<AppNavBar />
					<MuiThemeProvider>
					<div>
						<Toolbar>
							<ToolbarGroup firstChild={true}>

								<IconButton tooltip={APPBAR_STYLES.buttons.last.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.last.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleLast}>{APPBAR_STYLES.buttons.last.icon}</IconButton>

								{(this.props.isRunning)?
									((this.props.animationOn) ?
									<IconButton tooltip={APPBAR_STYLES.buttons.pause.tip} 
										 touch={true} tooltipPosition={APPBAR_STYLES.buttons.pause.tipPosition}
										onTouchTap={this.props.handlePause}>{APPBAR_STYLES.buttons.pause.icon}
										</IconButton>:
										ProgressCircle(APPBAR_STYLES.buttons.pause.progressCirlcSize, 
													   APPBAR_STYLES.buttons.pause.progressCirlcColor)):
									<IconButton tooltip={APPBAR_STYLES.buttons.play.tip} 
										touch={true} tooltipPosition={APPBAR_STYLES.buttons.play.tipPosition}
										onTouchTap={this.props.handleRun}>{APPBAR_STYLES.buttons.play.icon}</IconButton>}

								<IconButton tooltip={APPBAR_STYLES.buttons.next.tip}  touch={true} tooltipPosition={APPBAR_STYLES.buttons.next.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleNext}>{APPBAR_STYLES.buttons.next.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.restore.tip} touch={true} 
									tooltipPosition={APPBAR_STYLES.buttons.restore.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleRestore}>{APPBAR_STYLES.buttons.restore.icon}</IconButton>

								<IconButton 
									disabled={this.props.isRunning}
									tooltip={(this.props.animationOn)?
										APPBAR_STYLES.buttons.animationToggle.onTip:
										APPBAR_STYLES.buttons.animationToggle.offTip}
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.animationToggle.tipPosition}
									onTouchTap={this.props.handleToggleAnimation}>
									{(this.props.animationOn)?APPBAR_STYLES.buttons.animationToggle.onIcon:
									APPBAR_STYLES.buttons.animationToggle.offIcon}</IconButton>

								<ToolbarSeparator />

								<label style={APPBAR_STYLES.buttons.sliderInBar.sliderLabelStyle}>
									{APPBAR_STYLES.buttons.sliderInBar.label}
								</label>
								<Slider style={APPBAR_STYLES.buttons.sliderInBar.style} 
									sliderStyle={APPBAR_STYLES.buttons.sliderInBar.sliderStyle} 
									axis={APPBAR_STYLES.buttons.sliderInBar.range.axis}
									min={APPBAR_STYLES.buttons.sliderInBar.range.min} 
									max={APPBAR_STYLES.buttons.sliderInBar.range.max}
									step={APPBAR_STYLES.buttons.sliderInBar.range.step}
									defaultValue={APPBAR_STYLES.buttons.sliderInBar.range.default} 
									value={this.props.animationSpeed} 
									onChange={this.props.handleSpeedChange} />
								<label style={APPBAR_STYLES.buttons.sliderInBar.sliderLabelStyle}>
									{this.props.animationSpeedLabel}
								</label>

								<ToolbarSeparator />

								<IconButton tooltip="Undo" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}><Undo /></IconButton>

								<IconButton tooltip="Redo" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}><Redo /></IconButton>

								<ToolbarSeparator />

								<IconButton tooltip="Test" touch={true} tooltipPosition="bottom-right"
									onTouchTap={this.handleTrialDrawerToggle}><Test /></IconButton>

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
			    <MediaQuery maxWidth={APPBAR_STYLES.breakPoints.ipad.maxWidth} 
			    			minWidth={APPBAR_STYLES.breakPoints.ipad.minWidth}>
			    <AppNavBar />
			    <MuiThemeProvider>
					<div>
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.last.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.last.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleLast}>{APPBAR_STYLES.buttons.last.icon}</IconButton>

								{(this.props.isRunning)?
									((this.props.animationOn) ?
									<IconButton tooltip={APPBAR_STYLES.buttons.pause.tip} 
										 touch={true} tooltipPosition={APPBAR_STYLES.buttons.pause.tipPosition}
										onTouchTap={this.props.handlePause}>{APPBAR_STYLES.buttons.pause.icon}
										</IconButton>:
										ProgressCircle(APPBAR_STYLES.buttons.pause.progressCirlcSize, 
													   APPBAR_STYLES.buttons.pause.progressCirlcColor)):
									<IconButton tooltip={APPBAR_STYLES.buttons.play.tip} 
										touch={true} tooltipPosition={APPBAR_STYLES.buttons.play.tipPosition}
										onTouchTap={this.props.handleRun}>{APPBAR_STYLES.buttons.play.icon}</IconButton>}

								<IconButton tooltip={APPBAR_STYLES.buttons.next.tip}  touch={true} tooltipPosition={APPBAR_STYLES.buttons.next.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleNext}>{APPBAR_STYLES.buttons.next.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.restore.tip} touch={true} 
									tooltipPosition={APPBAR_STYLES.buttons.restore.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleRestore}>{APPBAR_STYLES.buttons.restore.icon}</IconButton>

								<IconButton 
									disabled={this.props.isRunning}
									tooltip={(this.props.animationOn)?
										APPBAR_STYLES.buttons.animationToggle.onTip:
										APPBAR_STYLES.buttons.animationToggle.offTip}
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.animationToggle.tipPosition}
									onTouchTap={this.props.handleToggleAnimation}>
									{(this.props.animationOn)?APPBAR_STYLES.buttons.animationToggle.onIcon:
									APPBAR_STYLES.buttons.animationToggle.offIcon}</IconButton>

								<ToolbarSeparator />
								<label style={APPBAR_STYLES.buttons.sliderInBar.sliderLabelStyle}>
									{APPBAR_STYLES.buttons.sliderInBar.label}: {this.props.animationSpeedLabel}
								</label>
								<Slider style={APPBAR_STYLES.buttons.sliderInBar.style} 
									sliderStyle={APPBAR_STYLES.buttons.sliderInBar.sliderStyle} 
									axis={APPBAR_STYLES.buttons.sliderInBar.range.axis}
									min={APPBAR_STYLES.buttons.sliderInBar.range.min} 
									max={APPBAR_STYLES.buttons.sliderInBar.range.max}
									step={APPBAR_STYLES.buttons.sliderInBar.range.step}
									defaultValue={APPBAR_STYLES.buttons.sliderInBar.range.default} 
									value={this.props.animationSpeed} 
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
							          onTouchTap={this.handlePopoverTouchTap}
							        ><Hamburger /></IconButton>
							        <Popover
							          open={this.state.toolHamburger}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
							          targetOrigin={{horizontal: 'right', vertical: 'top'}}
							          onRequestClose={this.handlePopoverRequestClose}
							        >
							        <Menu>
							        	<MenuItem primaryText="Test" leftIcon={<Test />} onTouchTap={() => { this.handleTrialDrawerToggle(); this.handlePopoverRequestClose()}}/>
							        	<MenuItem primaryText="Save" leftIcon={<Save />} onTouchTap={() => { this.props.handleSave(); this.handlePopoverRequestClose()}}/>
							        	<Divider />
							        	<MenuItem primaryText="Clear Tape" leftIcon={<Clear/>} onTouchTap={() => { this.props.handleClearTape(); this.handlePopoverRequestClose()}}/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
					</MuiThemeProvider>
			    </MediaQuery>
			    <MediaQuery maxWidth={APPBAR_STYLES.breakPoints.bigPhone.maxWidth} 
			    			minWidth={APPBAR_STYLES.breakPoints.bigPhone.minWidth}>
			    <AppNavBar />
			    <MuiThemeProvider>
					<div>
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.last.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.last.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleLast}>{APPBAR_STYLES.buttons.last.icon}</IconButton>

								{(this.props.isRunning)?
									((this.props.animationOn) ?
									<IconButton tooltip={APPBAR_STYLES.buttons.pause.tip} 
										 touch={true} tooltipPosition={APPBAR_STYLES.buttons.pause.tipPosition}
										onTouchTap={this.props.handlePause}>{APPBAR_STYLES.buttons.pause.icon}
										</IconButton>:
										ProgressCircle(APPBAR_STYLES.buttons.pause.progressCirlcSize, 
													   APPBAR_STYLES.buttons.pause.progressCirlcColor)):
									<IconButton tooltip={APPBAR_STYLES.buttons.play.tip} 
										touch={true} tooltipPosition={APPBAR_STYLES.buttons.play.tipPosition}
										onTouchTap={this.props.handleRun}>{APPBAR_STYLES.buttons.play.icon}</IconButton>}

								<IconButton tooltip={APPBAR_STYLES.buttons.next.tip}  touch={true} tooltipPosition={APPBAR_STYLES.buttons.next.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleNext}>{APPBAR_STYLES.buttons.next.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.restore.tip} touch={true} 
									tooltipPosition={APPBAR_STYLES.buttons.restore.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleRestore}>{APPBAR_STYLES.buttons.restore.icon}</IconButton>

								<IconButton 
									disabled={this.props.isRunning}
									tooltip={(this.props.animationOn)?
										APPBAR_STYLES.buttons.animationToggle.onTip:
										APPBAR_STYLES.buttons.animationToggle.offTip}
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.animationToggle.tipPosition}
									onTouchTap={this.props.handleToggleAnimation}>
									{(this.props.animationOn)?APPBAR_STYLES.buttons.animationToggle.onIcon:
									APPBAR_STYLES.buttons.animationToggle.offIcon}</IconButton>

								<ToolbarSeparator />
								<label style={APPBAR_STYLES.buttons.sliderInBar.sliderLabelStyle}>
									{APPBAR_STYLES.buttons.sliderInBar.label}: {this.props.animationSpeedLabel}
								</label>
								<Slider style={APPBAR_STYLES.buttons.sliderInBar.style} 
									sliderStyle={APPBAR_STYLES.buttons.sliderInBar.sliderStyle} 
									axis={APPBAR_STYLES.buttons.sliderInBar.range.axis}
									min={APPBAR_STYLES.buttons.sliderInBar.range.min} 
									max={APPBAR_STYLES.buttons.sliderInBar.range.max}
									step={APPBAR_STYLES.buttons.sliderInBar.range.step}
									defaultValue={APPBAR_STYLES.buttons.sliderInBar.range.default} 
									value={this.props.animationSpeed} 
									onChange={this.props.handleSpeedChange} />
								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip="More tools" touch={true} tooltipPosition="bottom-left" 
							          onTouchTap={this.handlePopoverTouchTap}
							        ><Hamburger /></IconButton>
							        <Popover
							          open={this.state.toolHamburger}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
							          targetOrigin={{horizontal: 'right', vertical: 'top'}}
							          onRequestClose={this.handlePopoverRequestClose}
							        >
							        <Menu>
							       		<MenuItem primaryText="Undo" leftIcon={<Undo />} onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}/>
							        	<MenuItem primaryText="Redo" leftIcon={<Redo />} onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}/>
							        	<Divider />
							        	<MenuItem primaryText="Test" leftIcon={<Test />} onTouchTap={() => { this.handleTrialDrawerToggle(); this.handlePopoverRequestClose()}}/>
							        	<MenuItem primaryText="Save" leftIcon={<Save />} onTouchTap={() => { this.props.handleSave(); this.handlePopoverRequestClose()}}/>
							        	<Divider />
							        	<MenuItem primaryText="Clear Tape" leftIcon={<Clear/>} onTouchTap={() => { this.props.handleClearTape(); this.handlePopoverRequestClose()}}/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
					</MuiThemeProvider>
			    </MediaQuery>
			    <MediaQuery maxWidth={APPBAR_STYLES.breakPoints.smallPhone.maxWidth}>
			    <AppNavBar titleStyle={APPBAR_STYLES.breakPoints.smallPhone.titleStyle}/>
			    <MuiThemeProvider>
					<div>
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.last.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.last.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleLast}>{APPBAR_STYLES.buttons.last.icon}</IconButton>

								{(this.props.isRunning)?
									((this.props.animationOn) ?
									<IconButton tooltip={APPBAR_STYLES.buttons.pause.tip} 
										 touch={true} tooltipPosition={APPBAR_STYLES.buttons.pause.tipPosition}
										onTouchTap={this.props.handlePause}>{APPBAR_STYLES.buttons.pause.icon}
										</IconButton>:
										ProgressCircle(APPBAR_STYLES.buttons.pause.progressCirlcSize, 
													   APPBAR_STYLES.buttons.pause.progressCirlcColor)):
									<IconButton tooltip={APPBAR_STYLES.buttons.play.tip} 
										touch={true} tooltipPosition={APPBAR_STYLES.buttons.play.tipPosition}
										onTouchTap={this.props.handleRun}>{APPBAR_STYLES.buttons.play.icon}</IconButton>}

								<IconButton tooltip={APPBAR_STYLES.buttons.next.tip}  touch={true} tooltipPosition={APPBAR_STYLES.buttons.next.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleNext}>{APPBAR_STYLES.buttons.next.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.restore.tip} touch={true} 
									tooltipPosition={APPBAR_STYLES.buttons.restore.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onTouchTap={this.props.handleRestore}>{APPBAR_STYLES.buttons.restore.icon}</IconButton>

								<IconButton 
									disabled={this.props.isRunning}
									tooltip={(this.props.animationOn)?
										APPBAR_STYLES.buttons.animationToggle.onTip:
										APPBAR_STYLES.buttons.animationToggle.offTip}
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.animationToggle.tipPosition}
									onTouchTap={this.props.handleToggleAnimation}>
									{(this.props.animationOn)?APPBAR_STYLES.buttons.animationToggle.onIcon:
									APPBAR_STYLES.buttons.animationToggle.offIcon}</IconButton>
								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip="More tools" touch={true} tooltipPosition="bottom-left" 
							          onTouchTap={this.handlePopoverTouchTap}
							        ><Hamburger /></IconButton>
							        <Popover
							          open={this.state.toolHamburger}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={{horizontal: 'right', vertical: 'bottom'}}
							          targetOrigin={{horizontal: 'right', vertical: 'top'}}
							          onRequestClose={this.handlePopoverRequestClose}
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
							        	<MenuItem primaryText="Test" leftIcon={<Test />} onTouchTap={() => { this.handleTrialDrawerToggle(); this.handlePopoverRequestClose()}}/>
							        	<MenuItem primaryText="Save" leftIcon={<Save />} onTouchTap={() => { this.props.handleSave(); this.handlePopoverRequestClose()}}/>
							        	<Divider />
							        	<MenuItem primaryText="Clear Tape" leftIcon={<Clear/>} onTouchTap={() => { this.props.handleClearTape(); this.handlePopoverRequestClose()}}/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
					</MuiThemeProvider>
			    </MediaQuery>
		    </div>
		    </div>
		)
	}
}

AppToolBar.PropTypes = {
	isRunning: PropTypes.bool.isRequired,
	animationSpeedLabel: PropTypes.string.isRequired,
	animationSpeed: PropTypes.number.isRequired,
	runningTrials: PropTypes.array.isRequired,
	isRunningTrial: PropTypes.bool.isRequired,
	animationOn: PropTypes.bool.isRequired,
	redoAble: PropTypes.bool.isRequired,
	undoAble: PropTypes.bool.isRequired,
	lastStepAble: PropTypes.bool.isRequired,
	testsById: PropTypes.array.isRequired,

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
	handleToggleAnimation: PropTypes.func.isRequired,
	handleAddTest: PropTypes.func.isRequired,
	handleRunAllTests: PropTypes.func.isRequired,
};

export default AppToolBar;