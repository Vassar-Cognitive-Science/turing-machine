import React from 'react'
import MenuItem from 'material-ui/MenuItem'
import SelectField from 'material-ui/SelectField'

const style = {
  root: {
    marginRight: '15px',
    marginLeft: '15px',
    maxWidth: '200px'
  }
}

class SwitchDirectionButton extends React.Component {
  constructor (props) {
    super(props)
  }

  render () {
    const items = [
        <MenuItem key={`toggle-${this.props.id}}-1`} value={true} primaryText="Left"/>,
        <MenuItem key={`toggle-${this.props.id}}-2`} value={false} primaryText="Right"/>
    ]

    return (
          <div style={{ ...style.root }}>
            <SelectField
              value={this.props.value}
              fullWidth
              floatingLabelFixed
              floatingLabelText={this.props.floatingLabelText}
              onChange={(event, index, value) => { this.props.switchDirection(value) }}
            >
              {items}
            </SelectField>
          </div>
    )
	  }
}

SwitchDirectionButton.defaultProps = {
  floatingLabelText: 'Direction'
}

export default SwitchDirectionButton
