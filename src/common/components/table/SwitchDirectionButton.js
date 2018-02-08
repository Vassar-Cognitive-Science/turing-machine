import React, { PropTypes } from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import { DIRECTION_BUTTON_STYLE } from '../../constants/components/Table';

class SwitchDirectionButton extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.value !== nextProps.value;
  }

	render() {
    let items = [
        <MenuItem key={`toggle-${this.props.id}}-1`} value={true}  primaryText="Left"/>,
        <MenuItem key={`toggle-${this.props.id}}-2`} value={false}  primaryText="Right"/>
    ];

    return (
          <div style={{marginRight: '15px', marginLeft: '15px', maxWidth: '200px'}}>
            <SelectField
              value={this.props.value}
              fullWidth
              floatingLabelFixed
              floatingLabelText={this.props.floatingLabelText}
              onChange={(event, index, value) => { this.props.switchDirection(value); }}
            >
              {items}
            </SelectField>
          </div>
        )
	  }
}

SwitchDirectionButton.PropTypes = {
	switchDirection: PropTypes.func.isRequired,
	parent: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired,
  id: PropTypes.string.isRequired,
}

SwitchDirectionButton.defaultProps = {
  floatingLabelText: "Direction"
}

export default SwitchDirectionButton;