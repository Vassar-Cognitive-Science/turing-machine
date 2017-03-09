import React, { PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AutoCompleteField extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
    	return this.props.searchText !== nextProps.searchText ||
    		   this.props.errorText !== nextProps.errorText;
  	}
	render() {
		return (
			<MuiThemeProvider>
				<AutoComplete dataSource={this.props.dataSource} 
							  filter={this.props.filter}
							  searchText={this.props.searchText}
                              onUpdateInput={this.props.onUpdateInput}
                              inputStyle={{color: this.props.fontColor}}
                              textFieldStyle={this.props.styles}
                           	  errorText={this.props.errorText}
                              id={this.props.id}
                              maxLength={this.props.maxLength}
                              openOnFocus={this.props.openOnFocus}
                              style={{width: "13vw"}}
            	/>
            </MuiThemeProvider>
		)
	}
}

AutoCompleteField.PropTypes = {
	parent: PropTypes.string.isRequired,
	id: PropTypes.string.isRequired,
	fieldType: PropTypes.string.isRequired,
	filter: PropTypes.func.isRequired,
	onUpdateInput: PropTypes.func.isRequired,
	styles: PropTypes.object.isRequired,
	maxLength: PropTypes.number.isRequired,
	openOnFocus: PropTypes.bool.isRequired,
}

export default AutoCompleteField;