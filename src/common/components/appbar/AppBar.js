import React, { PropTypes } from 'react';

import { Toolbar, ToolbarGroup, ToolbarSeparator } from 'material-ui/Toolbar';
import Popover from 'material-ui/Popover';
import Menu from 'material-ui/Menu';
import Divider from 'material-ui/Divider';
import Slider from 'material-ui/Slider';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';
import { List } from 'material-ui/List';

import CircularProgress from 'material-ui/CircularProgress';

import { DRAWER_STYLE, APPBAR_STYLES } from '../../constants/components/Appbar';

import MediaQuery from 'react-responsive';
import AppNavBar from './AppNavBar';

import { blue400 as waitingColor } from 'material-ui/styles/colors';

export const ProgressCircle = (size=30, color=waitingColor) => (
	<CircularProgress color={color} size={size} thickness={2.5} />
)

class AppToolBar extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			toolHamburger: false,
		};

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
			<div className='app-bar'> 
				<MediaQuery minWidth={APPBAR_STYLES.breakPoints.desktop.minWidth}>
				<AppNavBar />
					<div>
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.last.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.last.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleLast}>{APPBAR_STYLES.buttons.last.icon}</IconButton>

								{(this.props.isRunning)?
									((this.props.animationOn) ?
									<IconButton tooltip={APPBAR_STYLES.buttons.pause.tip} 
										 touch={true} tooltipPosition={APPBAR_STYLES.buttons.pause.tipPosition}
										onClick={this.props.handlePause}>{APPBAR_STYLES.buttons.pause.icon}
										</IconButton>:
										ProgressCircle(APPBAR_STYLES.buttons.pause.progressCirlcSize, 
													   APPBAR_STYLES.buttons.pause.progressCirlcColor)):
									<IconButton tooltip={APPBAR_STYLES.buttons.play.tip} 
										touch={true} tooltipPosition={APPBAR_STYLES.buttons.play.tipPosition}
										onClick={this.props.handleRun}>{APPBAR_STYLES.buttons.play.icon}</IconButton>}

								<IconButton tooltip={APPBAR_STYLES.buttons.next.tip}  touch={true} tooltipPosition={APPBAR_STYLES.buttons.next.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleNext}>{APPBAR_STYLES.buttons.next.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.restore.tip} touch={true} 
									tooltipPosition={APPBAR_STYLES.buttons.restore.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleRestore}>{APPBAR_STYLES.buttons.restore.icon}</IconButton>

								<IconButton  tooltip={APPBAR_STYLES.buttons.clearTape.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.clearTape.tipPosition}
									onClick={this.props.handleClearTape}>{APPBAR_STYLES.buttons.clearTape.icon}</IconButton>

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
									onClick={this.props.handleToggleAnimation}>
									{(this.props.animationOn)?APPBAR_STYLES.buttons.animationToggle.onIcon:
									APPBAR_STYLES.buttons.animationToggle.offIcon}</IconButton>
								<ToolbarSeparator />

								<IconButton tooltip={APPBAR_STYLES.buttons.undo.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.undo.tipPosition}
									onClick={this.props.handleUndo} disabled={!this.props.undoAble}>{APPBAR_STYLES.buttons.undo.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.redo.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.redo.tipPosition}
									onClick={this.props.handleRedo} disabled={!this.props.redoAble}>{APPBAR_STYLES.buttons.redo.icon}</IconButton>

								<ToolbarSeparator />

								<IconButton tooltip={APPBAR_STYLES.buttons.test.tip} 
									disabled={this.props.isEdittingTrial}
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.test.tipPosition}
									onClick={this.props.trialDrawerToggleCallback}>{APPBAR_STYLES.buttons.test.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.save.tip} 
									disabled={this.props.isEdittingTrial}
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.save.tipPosition}
									onClick={this.props.handleSave}>
									{APPBAR_STYLES.buttons.save.icon}</IconButton>

								<ToolbarSeparator />
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
			    	</MediaQuery>
			    <MediaQuery maxWidth={APPBAR_STYLES.breakPoints.ipad.maxWidth} 
			    			minWidth={APPBAR_STYLES.breakPoints.ipad.minWidth}>
			    <AppNavBar />
					<div>
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.last.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.last.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleLast}>{APPBAR_STYLES.buttons.last.icon}</IconButton>

								{(this.props.isRunning)?
									((this.props.animationOn) ?
									<IconButton tooltip={APPBAR_STYLES.buttons.pause.tip} 
										 touch={true} tooltipPosition={APPBAR_STYLES.buttons.pause.tipPosition}
										onClick={this.props.handlePause}>{APPBAR_STYLES.buttons.pause.icon}
										</IconButton>:
										ProgressCircle(APPBAR_STYLES.buttons.pause.progressCirlcSize, 
													   APPBAR_STYLES.buttons.pause.progressCirlcColor)):
									<IconButton tooltip={APPBAR_STYLES.buttons.play.tip} 
										touch={true} tooltipPosition={APPBAR_STYLES.buttons.play.tipPosition}
										onClick={this.props.handleRun}>{APPBAR_STYLES.buttons.play.icon}</IconButton>}

								<IconButton tooltip={APPBAR_STYLES.buttons.next.tip}  touch={true} tooltipPosition={APPBAR_STYLES.buttons.next.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleNext}>{APPBAR_STYLES.buttons.next.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.restore.tip} touch={true} 
									tooltipPosition={APPBAR_STYLES.buttons.restore.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleRestore}>{APPBAR_STYLES.buttons.restore.icon}</IconButton>

								<IconButton  tooltip={APPBAR_STYLES.buttons.clearTape.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.clearTape.tipPosition}
									onClick={this.props.handleClearTape}>{APPBAR_STYLES.buttons.clearTape.icon}</IconButton>

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
									onClick={this.props.handleToggleAnimation}>
									{(this.props.animationOn)?APPBAR_STYLES.buttons.animationToggle.onIcon:
									APPBAR_STYLES.buttons.animationToggle.offIcon}</IconButton>

								<ToolbarSeparator />
								<IconButton tooltip={APPBAR_STYLES.buttons.undo.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.undo.tipPosition}
									onClick={this.props.handleUndo} disabled={!this.props.undoAble}>{APPBAR_STYLES.buttons.undo.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.redo.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.redo.tipPosition}
									onClick={this.props.handleRedo} disabled={!this.props.redoAble}>{APPBAR_STYLES.buttons.redo.icon}</IconButton>

								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.moreTools.tip}  
											touch={true} tooltipPosition={APPBAR_STYLES.buttons.moreTools.tipPosition}
							       		    onClick={this.handlePopoverTouchTap}
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
							        	onClick={() => { this.props.trialDrawerToggleCallback(); this.handlePopoverRequestClose()}}
							        	/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.save.tip} 
							        	leftIcon={APPBAR_STYLES.buttons.save.icon} 
										disabled={this.props.isEdittingTrial}
							        	onClick={() => { this.props.handleSave(); this.handleSaveMachineResponseOn(); this.handlePopoverRequestClose()}}
							        	/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
			    </MediaQuery>
			    <MediaQuery maxWidth={APPBAR_STYLES.breakPoints.bigPhone.maxWidth} 
			    			minWidth={APPBAR_STYLES.breakPoints.bigPhone.minWidth}>
			    <AppNavBar />
					<div>
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.last.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.last.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleLast}>{APPBAR_STYLES.buttons.last.icon}</IconButton>

								{(this.props.isRunning)?
									((this.props.animationOn) ?
									<IconButton tooltip={APPBAR_STYLES.buttons.pause.tip} 
										 touch={true} tooltipPosition={APPBAR_STYLES.buttons.pause.tipPosition}
										onClick={this.props.handlePause}>{APPBAR_STYLES.buttons.pause.icon}
										</IconButton>:
										ProgressCircle(APPBAR_STYLES.buttons.pause.progressCirlcSize, 
													   APPBAR_STYLES.buttons.pause.progressCirlcColor)):
									<IconButton tooltip={APPBAR_STYLES.buttons.play.tip} 
										touch={true} tooltipPosition={APPBAR_STYLES.buttons.play.tipPosition}
										onClick={this.props.handleRun}>{APPBAR_STYLES.buttons.play.icon}</IconButton>}

								<IconButton tooltip={APPBAR_STYLES.buttons.next.tip}  touch={true} tooltipPosition={APPBAR_STYLES.buttons.next.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleNext}>{APPBAR_STYLES.buttons.next.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.restore.tip} touch={true} 
									tooltipPosition={APPBAR_STYLES.buttons.restore.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleRestore}>{APPBAR_STYLES.buttons.restore.icon}</IconButton>

								<IconButton  tooltip={APPBAR_STYLES.buttons.clearTape.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.clearTape.tipPosition}
									onClick={this.props.handleClearTape}>{APPBAR_STYLES.buttons.clearTape.icon}</IconButton>

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
									onClick={this.props.handleToggleAnimation}>
									{(this.props.animationOn)?APPBAR_STYLES.buttons.animationToggle.onIcon:
									APPBAR_STYLES.buttons.animationToggle.offIcon}</IconButton>
								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.moreTools.tip}  
											touch={true} tooltipPosition={APPBAR_STYLES.buttons.moreTools.tipPosition}
							       		    onClick={this.handlePopoverTouchTap}
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
							       		onClick={this.props.handleUndo} disabled={!this.props.undoAble}
							       		/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.redo.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.redo.icon} 
							        	onClick={this.props.handleRedo} disabled={!this.props.redoAble}
							        	/>
							        	<Divider />
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.test.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.test.icon} 
							        	disabled={this.props.isEdittingTrial}
							        	onClick={() => { this.props.trialDrawerToggleCallback(); this.handlePopoverRequestClose()}}
							        	/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.save.tip} 
							        	leftIcon={APPBAR_STYLES.buttons.save.icon} 
							        	disabled={this.props.isEdittingTrial}
							        	onClick={() => { this.props.handleSave(); this.handleSaveMachineResponseOn(); this.handlePopoverRequestClose()}}
							        	/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
			    </MediaQuery>
			    <MediaQuery maxWidth={APPBAR_STYLES.breakPoints.smallPhone.maxWidth}>
			    <AppNavBar titleStyle={APPBAR_STYLES.breakPoints.smallPhone.titleStyle}/>
					<div>
						<Toolbar>
							<ToolbarGroup firstChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.last.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.last.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleLast}>{APPBAR_STYLES.buttons.last.icon}</IconButton>

								{(this.props.isRunning)?
									((this.props.animationOn) ?
									<IconButton tooltip={APPBAR_STYLES.buttons.pause.tip} 
										 touch={true} tooltipPosition={APPBAR_STYLES.buttons.pause.tipPosition}
										onClick={this.props.handlePause}>{APPBAR_STYLES.buttons.pause.icon}
										</IconButton>:
										ProgressCircle(APPBAR_STYLES.buttons.pause.progressCirlcSize, 
													   APPBAR_STYLES.buttons.pause.progressCirlcColor)):
									<IconButton tooltip={APPBAR_STYLES.buttons.play.tip} 
										touch={true} tooltipPosition={APPBAR_STYLES.buttons.play.tipPosition}
										onClick={this.props.handleRun}>{APPBAR_STYLES.buttons.play.icon}</IconButton>}

								<IconButton tooltip={APPBAR_STYLES.buttons.next.tip}  touch={true} tooltipPosition={APPBAR_STYLES.buttons.next.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleNext}>{APPBAR_STYLES.buttons.next.icon}</IconButton>

								<IconButton tooltip={APPBAR_STYLES.buttons.restore.tip} touch={true} 
									tooltipPosition={APPBAR_STYLES.buttons.restore.tipPosition}
									disabled={this.props.isRunning && !this.props.animationOn}
									onClick={this.props.handleRestore}>{APPBAR_STYLES.buttons.restore.icon}</IconButton>

								<IconButton  tooltip={APPBAR_STYLES.buttons.clearTape.tip} 
									touch={true} tooltipPosition={APPBAR_STYLES.buttons.clearTape.tipPosition}
									onClick={this.props.handleClearTape}>{APPBAR_STYLES.buttons.clearTape.icon}</IconButton>

								
								<ToolbarSeparator />
							</ToolbarGroup>
							<ToolbarGroup lastChild={true}>
								<IconButton tooltip={APPBAR_STYLES.buttons.moreTools.tip}  
											touch={true} tooltipPosition={APPBAR_STYLES.buttons.moreTools.tipPosition}
							       		    onClick={this.handlePopoverTouchTap}
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
							       		onClick={this.props.handleUndo} disabled={!this.props.undoAble}
							       		/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.redo.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.redo.icon} 
							        	onClick={this.props.handleRedo} disabled={!this.props.redoAble}
							        	/>
							        	<Divider />
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.test.tip}  
							        	leftIcon={APPBAR_STYLES.buttons.test.icon} 
							        	disabled={this.props.isEdittingTrial}
							        	onClick={() => { this.props.trialDrawerToggleCallback(); this.handlePopoverRequestClose()}}
							        	/>
							        	<MenuItem 
							        	primaryText={APPBAR_STYLES.buttons.save.tip} 
							        	leftIcon={APPBAR_STYLES.buttons.save.icon} 
							        	disabled={this.props.isEdittingTrial}
							        	onClick={() => { this.props.handleSave(); this.handleSaveMachineResponseOn(); this.handlePopoverRequestClose()}}
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
							        	onClick={this.props.handleToggleAnimation}
							        	/>
							        </Menu>
							        </Popover>
							</ToolbarGroup>

					    </Toolbar>
			    	</div>
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
};

export default AppToolBar;