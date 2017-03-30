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

import { DRAWER_STYLE, APPBAR_STYLES } from '../../constants/components/Appbar';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import MediaQuery from 'react-responsive';
import AppNavBar from './AppNavBar';
import TrialItem from '../../containers/appbar/TrialItemContainer';
import { blue400 as waitingColor } from 'material-ui/styles/colors';


const ProgressCircle = (size=30, color=waitingColor) => (
	<CircularProgress color={color} size={size} thickness={2.5} />
)


class AppToolBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			toolHamburger: false,
			trialDrawerToggle: false,
		};

		this.handleTrialDrawerToggle = () => {
			this.setState({
				trialDrawerToggle: !this.state.trialDrawerToggle
			});
		}

		this.handleTrialDrawerClose = () => {
			this.setState({
				trialDrawerToggle: false
			});
		}

		this.handlePopoverTouchTap = (event) => {
			// This prevents ghost click.
			event.preventDefault();
			this.setState({
				toolHamburger: true,
				anchorEl: event.currentTarget,
			});
		};

		this.handlePopoverRequestClose = () => {
			this.setState({
				toolHamburger: false,
			});
		};

	}

	

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
						<MenuItem primaryText={DRAWER_STYLE.buttons.runTrial.runningLabel} leftIcon={ProgressCircle()} /> :
						<MenuItem primaryText={DRAWER_STYLE.buttons.runTrial.label} leftIcon={DRAWER_STYLE.buttons.runTrial.icon}
				 			onTouchTap={this.props.handleRunAllTests}/>}

			        <MenuItem primaryText={DRAWER_STYLE.buttons.addTrial.label} leftIcon={DRAWER_STYLE.buttons.addTrial.icon}
			         onTouchTap={this.props.handleAddTest}/>
			        <Divider />
			        <MenuItem primaryText={DRAWER_STYLE.buttons.uploadTests.label} 
			        	leftIcon={DRAWER_STYLE.buttons.uploadTests.icon} 
			        	onTouchTap={this.props.uploadTests} />
			        <MenuItem primaryText={DRAWER_STYLE.buttons.saveTests.label} leftIcon={DRAWER_STYLE.buttons.saveTests.icon} onTouchTap={this.props.downloadAllTests} />

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

								<IconButton  tooltip={APPBAR_STYLES.buttons.clearTape.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.clearTape.tipPosition}
									onTouchTap={this.props.handleClearTape}>{APPBAR_STYLES.buttons.clearTape.icon}</IconButton>

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

								<IconButton tooltip={APPBAR_STYLES.buttons.undo.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.undo.tipPosition}
									onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}>{APPBAR_STYLES.buttons.undo.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.redo.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.redo.tipPosition}
									onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}>{APPBAR_STYLES.buttons.redo.icon}</IconButton>

								<ToolbarSeparator />

								<IconButton tooltip={APPBAR_STYLES.buttons.test.tip} 
									disabled={this.props.isEdittingTrial}
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.test.tipPosition}
									onTouchTap={this.handleTrialDrawerToggle}>{APPBAR_STYLES.buttons.test.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.save.tip} 
									disabled={this.props.isEdittingTrial}
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.save.tipPosition}
									onTouchTap={this.props.handleSave}>
									{APPBAR_STYLES.buttons.save.icon}</IconButton>

								<ToolbarSeparator />
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

								<IconButton  tooltip={APPBAR_STYLES.buttons.clearTape.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.clearTape.tipPosition}
									onTouchTap={this.props.handleClearTape}>{APPBAR_STYLES.buttons.clearTape.icon}</IconButton>

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
								<IconButton tooltip={APPBAR_STYLES.buttons.undo.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.undo.tipPosition}
									onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}>{APPBAR_STYLES.buttons.undo.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.redo.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.redo.tipPosition}
									onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}>{APPBAR_STYLES.buttons.redo.icon}</IconButton>

								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.moreTools.tip}  
											touch={true} tooltipPosition={APPBAR_STYLES.buttons.moreTools.tipPosition}
							       		    onTouchTap={this.handlePopoverTouchTap}
							        		>{APPBAR_STYLES.buttons.moreTools.icon}</IconButton>
							        <Popover
							          open={this.state.toolHamburger}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={APPBAR_STYLES.buttons.moreToolsPopover.anchorOrigin}
							          targetOrigin={APPBAR_STYLES.buttons.moreToolsPopover.targetOrigin}
							          onRequestClose={this.handlePopoverRequestClose}
							        >
							        <Menu>
							        	<Divider />
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.test.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.test.icon}  
										disabled={this.props.isEdittingTrial}
							        	onTouchTap={() => { this.handleTrialDrawerToggle(); this.handlePopoverRequestClose()}}
							        	/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.save.tip} 
							        	leftIcon={APPBAR_STYLES.buttons.save.icon} 
										disabled={this.props.isEdittingTrial}
							        	onTouchTap={() => { this.props.handleSave(); this.handleSaveMachineResponseOn(); this.handlePopoverRequestClose()}}
							        	/>
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

								<IconButton  tooltip={APPBAR_STYLES.buttons.clearTape.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.clearTape.tipPosition}
									onTouchTap={this.props.handleClearTape}>{APPBAR_STYLES.buttons.clearTape.icon}</IconButton>

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
								<IconButton tooltip={APPBAR_STYLES.buttons.moreTools.tip}  
											touch={true} tooltipPosition={APPBAR_STYLES.buttons.moreTools.tipPosition}
							       		    onTouchTap={this.handlePopoverTouchTap}
							        		>{APPBAR_STYLES.buttons.moreTools.icon}</IconButton>
							        <Popover
							          open={this.state.toolHamburger}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={APPBAR_STYLES.buttons.moreToolsPopover.anchorOrigin}
							          targetOrigin={APPBAR_STYLES.buttons.moreToolsPopover.targetOrigin}
							          onRequestClose={this.handlePopoverRequestClose}
							        >
							        <Menu>
							       		<MenuItem 
							       		primaryText={APPBAR_STYLES.buttons.undo.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.undo.icon} 
							       		onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}
							       		/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.redo.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.redo.icon} 
							        	onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}
							        	/>
							        	<Divider />
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.test.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.test.icon} 
							        	disabled={this.props.isEdittingTrial}
							        	onTouchTap={() => { this.handleTrialDrawerToggle(); this.handlePopoverRequestClose()}}
							        	/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.save.tip} 
							        	leftIcon={APPBAR_STYLES.buttons.save.icon} 
							        	disabled={this.props.isEdittingTrial}
							        	onTouchTap={() => { this.props.handleSave(); this.handleSaveMachineResponseOn(); this.handlePopoverRequestClose()}}
							        	/>
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

								<IconButton  tooltip={APPBAR_STYLES.buttons.clearTape.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.clearTape.tipPosition}
									onTouchTap={this.props.handleClearTape}>{APPBAR_STYLES.buttons.clearTape.icon}</IconButton>

								
								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.moreTools.tip}  
											touch={true} tooltipPosition={APPBAR_STYLES.buttons.moreTools.tipPosition}
							       		    onTouchTap={this.handlePopoverTouchTap}
							        		>{APPBAR_STYLES.buttons.moreTools.icon}</IconButton>
							        <Popover
							          open={this.state.toolHamburger}
							          anchorEl={this.state.anchorEl}
							          anchorOrigin={APPBAR_STYLES.buttons.moreToolsPopover.anchorOrigin}
							          targetOrigin={APPBAR_STYLES.buttons.moreToolsPopover.targetOrigin}
							          onRequestClose={this.handlePopoverRequestClose}
							        >
							        <Menu>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.sliderInMenu.label + this.props.animationSpeedLabel}
							        		rightIcon={
							        			<Slider style={APPBAR_STYLES.buttons.sliderInMenu.sliderStyle} 
							        			axis={APPBAR_STYLES.buttons.sliderInMenu.range.axis}
												min={APPBAR_STYLES.buttons.sliderInMenu.range.min} 
												max={APPBAR_STYLES.buttons.sliderInMenu.range.max} 
												step={APPBAR_STYLES.buttons.sliderInMenu.range.step}
												defaultValue={APPBAR_STYLES.buttons.sliderInMenu.range.default} 
												value={this.props.animationSpeed} 
												onChange={this.props.handleSpeedChange} />} />
										<Divider />
							       		<MenuItem 
							       		primaryText={APPBAR_STYLES.buttons.undo.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.undo.icon} 
							       		onTouchTap={this.props.handleUndo} disabled={!this.props.undoAble}
							       		/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.redo.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.redo.icon} 
							        	onTouchTap={this.props.handleRedo} disabled={!this.props.redoAble}
							        	/>
							        	<Divider />
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.test.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.test.icon} 
							        	disabled={this.props.isEdittingTrial}
							        	onTouchTap={() => { this.handleTrialDrawerToggle(); this.handlePopoverRequestClose()}}
							        	/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.save.tip} 
							        	leftIcon={APPBAR_STYLES.buttons.save.icon} 
							        	disabled={this.props.isEdittingTrial}
							        	onTouchTap={() => { this.props.handleSave(); this.handleSaveMachineResponseOn(); this.handlePopoverRequestClose()}}
							        	/>
							        	<Divider />
							        	<MenuItem 
							        	disabled={this.props.isRunning}
							        	primaryText={(this.props.animationOn)?
														APPBAR_STYLES.buttons.animationToggle.onTip:
														APPBAR_STYLES.buttons.animationToggle.offTip}
							        	leftIcon={(this.props.animationOn)?
							        				APPBAR_STYLES.buttons.animationToggle.onIcon:
													APPBAR_STYLES.buttons.animationToggle.offIcon}
							        	onTouchTap={this.props.handleToggleAnimation}
							        	/>
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