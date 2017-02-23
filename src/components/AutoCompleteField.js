import React, { PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AutoCompleteField extends React.Component {
	render() {
		return (
			<MuiThemeProvider>
				<AutoComplete dataSource={this.props.dataSource} 
							  filter={this.props.filter}
                              onUpdateInput={this.props.onChange}
                              textFieldStyle={this.props.style}
                           	  onBlur={this.props.onBlur}
                           	  errorText={this.props.errorText}
                              id={this.props.id}
            	/>
            </MuiThemeProvider>
		)
	}
}

AutoCompleteField.PropTypes = {
	parent: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	onBlur: PropTypes.func.isRequired,
	fieldType: PropTypes.string.isRequired,
	filter: PropTypes.func.isRequired
}

export default AutoCompleteField;