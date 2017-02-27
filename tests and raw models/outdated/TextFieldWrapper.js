import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class TextFieldWrapper extends React.Component {
	render() {
		return (
			<MuiThemeProvider>
				<TextField    onChange={this.props.onChange}
                              inputStyle={this.props.styles}
                           	  onBlur={this.props.onBlur}
                           	  errorText={this.props.errorText}
                              id={this.props.id}
                              maxLength={this.props.maxLength}
            	/>
            </MuiThemeProvider>
		)
	}
}

TextFieldWrapper.PropTypes = {
	parent: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	onChange: PropTypes.func.isRequired,
	onBlur: PropTypes.func.isRequired,
	fieldType: PropTypes.string.isRequired
}

export default TextFieldWrapper;