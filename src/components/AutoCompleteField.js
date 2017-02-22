import React, { PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AutoCompleteField extends React.Component {
	state = {
    dataSource: [],
    };

    handleUpdateInput = (value) => {
      this.setState({
        dataSource: [
          value,
          value + value,
          value + value + value,
        ],
      });
    };

	render() {
		return (
			<MuiThemeProvider>
				<AutoComplete dataSource={this.state.dataSource} 
                          onUpdateInput={this.handleUpdateInput}
                          disabled={!this.props.editable} 
                          hintText={""} 
                          id={this.props.id}
            />
            </MuiThemeProvider>
		)
	}
}

AutoCompleteField.PropTypes = {
	parent: PropTypes.string.isRequired,
	editable: PropTypes.bool.isRequired,
	id: PropTypes.string.isRequired
}

export default AutoCompleteField;