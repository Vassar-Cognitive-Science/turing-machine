import React, { PropTypes } from 'react'
import Popover from 'material-ui/Popover'
import IconButton from 'material-ui/IconButton'
import { ListItem } from 'material-ui/List'
import Menu from 'material-ui/Menu'
import MenuItem from 'material-ui/MenuItem'
import Divider from 'material-ui/Divider'

import Delete from 'material-ui/svg-icons/action/delete-forever'
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert'
import Pass from 'material-ui/svg-icons/action/done'
import Fail from 'material-ui/svg-icons/content/clear'
import Load from 'material-ui/svg-icons/content/send'
import Timeout from 'material-ui/svg-icons/device/access-alarms'
import Run from 'material-ui/svg-icons/av/play-circle-outline'
import Edit from 'material-ui/svg-icons/content/create'
import Download from 'material-ui/svg-icons/file/file-download'

import {
  red500 as failColor,
  lightGreenA700 as passColor,
  blue600 as runButtonColor,
  orange500 as editButtonColor,
  red900 as deleteButtonColor,
  grey400 as successFeedbackColor,
  cyan400 as loadColor,
  teal300 as downloadColor
} from 'material-ui/styles/colors'

import { STATUS_CODE_WAITING, STATUS_CODE_PASS, STATUS_CODE_FAIL, STATUS_CODE_TIMEOUT } from '../../reducers/trial'

const iconButtonSelector = (statusCode, callBack) => {
  switch (statusCode) {
    case STATUS_CODE_PASS:
      return <IconButton touch={true} tooltip="Accepted" tooltipStyles={{ fontSize: 14 }}
			tooltipPosition="bottom-left" onClick={callBack}><Pass color={passColor} /></IconButton>
    case STATUS_CODE_FAIL:
      return <IconButton touch={true} tooltip="Wrong" tooltipStyles={{ fontSize: 14 }}
			tooltipPosition="bottom-left" onClick={callBack}><Fail color={failColor} /></IconButton>
    case STATUS_CODE_TIMEOUT:
      return <IconButton touch={true} tooltip="Time Out" tooltipStyles={{ fontSize: 14 }}
			tooltipPosition="bottom-left" onClick={callBack}><Timeout color={failColor} /></IconButton>
    case STATUS_CODE_WAITING:
    default:
      return <IconButton touch={true} tooltip="Options" tooltipStyles={{ fontSize: 14 }}
			tooltipPosition="bottom-left" onClick={callBack}><MoreVertIcon /></IconButton>
  }
}

const processFeedback = (feedback, statusCode) => (
	<p style={{ fontSize: 10, color: (statusCode === STATUS_CODE_PASS) ? successFeedbackColor : failColor }}>{feedback}</p>
)

class TrialItem extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      optionMenu: false
    }

    this.handlePopoverTouchTap = (event) => {
      // This prevents ghost click.
      event.preventDefault()
      this.setState({
        optionMenu: true,
        anchorEl: event.currentTarget
      })
    }

    this.handlePopoverRequestClose = () => {
      this.setState({
        optionMenu: false
      })
    }
  }

  render () {
    return (
			<div>
				<ListItem
					  innerDivStyle={{ paddingBottom: 10 }}
					  primaryText={this.props.name}
					  secondaryText={(this.props.statusCode !== STATUS_CODE_PASS &&
					  				  this.props.statusCode !== STATUS_CODE_FAIL &&
					  				  this.props.statusCode !== STATUS_CODE_TIMEOUT)
								  	? null
								  	: processFeedback(this.props.feedback, this.props.statusCode)}
					  rightIconButton={iconButtonSelector(this.props.statusCode, this.handlePopoverTouchTap)}
				/>
		        <Popover
		          open={this.state.optionMenu}
		          anchorEl={this.state.anchorEl}
		          anchorOrigin={{ horizontal: 'left', vertical: 'bottom' }}
		          targetOrigin={{ horizontal: 'left', vertical: 'top' }}
		          onRequestClose={this.handlePopoverRequestClose}
		        >
		          <Menu>
		            <MenuItem primaryText="Run" leftIcon={<Run color={runButtonColor}/>} onClick={() => { this.props.runTrial(); this.handlePopoverRequestClose() }} />
		            <MenuItem primaryText="Edit" leftIcon={<Edit color={editButtonColor}/>} onClick={() => { this.props.editTrial(); this.handlePopoverRequestClose() }} />
		            <Divider />
		            <MenuItem primaryText="Load" leftIcon={<Load color={loadColor}/>} onClick={() => { this.props.loadTrial(); this.handlePopoverRequestClose() }} />
		            <MenuItem primaryText="Download" leftIcon={<Download color={downloadColor}/>} onClick={() => { this.props.downloadTrial(); this.handlePopoverRequestClose() }} />

		            <Divider />
		            <MenuItem primaryText="Delete" leftIcon={<Delete color={deleteButtonColor}/>} onClick={() => { this.props.deleteTrial(); this.handlePopoverRequestClose() }}/>
		          </Menu>
		        </Popover>
	        </div>
    )
  }
}

TrialItem.PropTypes = {
  id: PropTypes.string.isRequried,

  steps: PropTypes.number.isRequried,
  statusCode: PropTypes.number.isRequried,
  feedback: PropTypes.string.isRequried,

  deleteTrial: PropTypes.func.isRequired,
  runTrial: PropTypes.func.isRequired,
  loadTrial: PropTypes.func.isRequired
}

export default TrialItem
