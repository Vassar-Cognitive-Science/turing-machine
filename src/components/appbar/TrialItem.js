import React, { PropTypes } from 'react';
import Popover from 'material-ui/Popover';
import IconButton from 'material-ui/IconButton';
import { ListItem } from 'material-ui/List';
import Menu from 'material-ui/Menu';
import MenuItem from 'material-ui/MenuItem';
import Divider from 'material-ui/Divider';

import Delete from 'material-ui/svg-icons/action/delete-forever';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import Pass from 'material-ui/svg-icons/action/done';
import Fail from 'material-ui/svg-icons/content/clear';
import Load from 'material-ui/svg-icons/content/send';
import Traceback from 'material-ui/svg-icons/action/zoom-in';
import Run from 'material-ui/svg-icons/av/play-circle-outline';
import Edit from 'material-ui/svg-icons/content/create';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import {
	red500 as failColor,
	lightGreenA700 as passColor,
	blue600 as runButtonColor,
	orange500 as editButtonColor,
	red900 as deleteButtonColor,
	grey400 as successFeedbackColor,
	cyan400 as loadColor,
	grey900 as tracebackColor,
} from 'material-ui/styles/colors';

import { STATUS_CODE_WAITING, STATUS_CODE_PASS, STATUS_CODE_FAIL } from '../../reducers/trial';

const iconButtonSelector = (statusCode, callBack) => {
	switch(statusCode) {
		case STATUS_CODE_PASS:
			return <IconButton touch={true} tooltip="Accepted" tooltipStyles={{fontSize: 14}} 
			tooltipPosition="bottom-left" onTouchTap={callBack}><Pass color={passColor} /></IconButton>;
		case STATUS_CODE_FAIL:
			return <IconButton touch={true} tooltip="Wrong" tooltipStyles={{fontSize: 14}} 
			tooltipPosition="bottom-left" onTouchTap={callBack}><Fail color={failColor} /></IconButton>;
		case STATUS_CODE_WAITING:
		default:
			return <IconButton touch={true} tooltip="Options" tooltipStyles={{fontSize: 14}} 
			tooltipPosition="bottom-left" onTouchTap={callBack}><MoreVertIcon /></IconButton>;
	}
}

const processFeedback = (feedback, statusCode) => (
	<p style={{fontSize: 10, color: (statusCode === STATUS_CODE_PASS) ? successFeedbackColor : failColor }}>{feedback}</p>
)

class TrialItem extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			optionMenu: false,
		};
	}

	handlePopoverTouchTap = (event) => {
		// This prevents ghost click.
		event.preventDefault();
		this.setState({
			optionMenu: true,
			anchorEl: event.currentTarget,
		});
	};

	handlePopoverRequestClose = () => {
		this.setState({
			optionMenu: false,
		});
	};

	render() {
		return (
			<div>
			<MuiThemeProvider>
			<ListItem 
				  innerDivStyle={{paddingBottom: 10}}
				  primaryText={this.props.id}
				  secondaryText={(this.props.statusCode !== STATUS_CODE_PASS && this.props.statusCode !== STATUS_CODE_FAIL) ? 
							  	null : 
							  	processFeedback(this.props.feedback, this.props.statusCode)}
				  rightIconButton={iconButtonSelector(this.props.statusCode, this.handlePopoverTouchTap)}
			/>
	        </MuiThemeProvider>
	        <MuiThemeProvider>
	        <Popover
	          open={this.state.optionMenu}
	          anchorEl={this.state.anchorEl}
	          anchorOrigin={{horizontal: 'left', vertical: 'bottom'}}
	          targetOrigin={{horizontal: 'left', vertical: 'top'}}
	          onRequestClose={this.handlePopoverRequestClose}
	        >
	          <Menu>
	            <MenuItem primaryText="Run" leftIcon={<Run color={runButtonColor}/>} onTouchTap={this.props.runTrial} />
	            <MenuItem primaryText="Edit" leftIcon={<Edit color={editButtonColor}/>} onTouchTap={this.props.editTrial} />
	            <Divider />
	            <MenuItem primaryText="Load" leftIcon={<Load color={loadColor}/>} onTouchTap={this.props.runTrial} />
	            {(this.props.statusCode === STATUS_CODE_FAIL)?
	            	<MenuItem primaryText="Traceback" leftIcon={<Traceback color={tracebackColor}/>} onTouchTap={this.props.editTrial} />:null}
	            <Divider />
	            <MenuItem primaryText="Delete" leftIcon={<Delete color={deleteButtonColor}/>} onTouchTap={this.props.deleteTrial}/>
	          </Menu>
	        </Popover>
	        </MuiThemeProvider>
	        </div>	
		)
	}
}


TrialItem.PropTypes = {
	id: PropTypes.string.isRequried,
	status: PropTypes.string.isRequried,
	steps: PropTypes.number.isRequried,
}

export default TrialItem;