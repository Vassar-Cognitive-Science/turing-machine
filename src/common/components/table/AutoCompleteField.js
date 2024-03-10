import React from 'react'
import AutoComplete from 'material-ui/AutoComplete'

const style = {
  root: {
    marginRight: '15px',
    marginLeft: '15px',
    maxWidth: '200px'
  },
  AutoComplete: {
    fullWidth: true,
    floatingLabelFixed: true,
    popoverProps: {
      canAutoPosition: true
    },
    menuStyle: {
      maxHeight: 200,
      overflowY: 'auto'
    }
  }
}

export default class AutoCompleteField extends React.Component {
  constructor (props) {
    super(props)
  }

  shouldComponentUpdate (nextProps, nextState) {
    	return this.props.searchText !== nextProps.searchText ||
    		   this.props.errorText !== nextProps.errorText ||
    		   this.props.dataSource !== nextProps.dataSource
  	}

  render () {
    return (
			<div style={{ ...style.root }}>
				<AutoComplete {...style.AutoComplete}
							  floatingLabelText={this.props.floatingLabelText}
							  dataSource={this.props.dataSource}
							  filter={this.props.filter}
							  searchText={this.props.searchText}
	                          onUpdateInput={this.props.onUpdateInput}
	                          inputStyle={{ color: this.props.fontColor }}
	                       	  errorText={this.props.errorText}
	                          id={this.props.id}
	                          openOnFocus={this.props.openOnFocus}
	        	/>
        	</div>
    )
  }
}

AutoCompleteField.defaultProps = {
  floatingLabelText: 'Text'
}
