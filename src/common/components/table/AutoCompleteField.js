import React, { PropTypes } from 'react';
import AutoComplete from 'material-ui/AutoComplete';

import { TABLE_AUTO_COMPLETE_STYLE } from '../../constants/components/Table';

export default class AutoCompleteField extends React.Component {
	shouldComponentUpdate(nextProps, nextState) {
    	return this.props.searchText !== nextProps.searchText ||
    		   this.props.errorText !== nextProps.errorText ||
    		   this.props.dataSource !== nextProps.dataSource;
  	}

	render() {
		return (
			<div style={{marginRight: '15px', marginLeft: '15px', maxWidth: '200px'}}>
				<AutoComplete className="Table-textfield"
						      fullWidth
							  floatingLabelText={this.props.floatingLabelText}
							  floatingLabelFixed
							  dataSource={this.props.dataSource} 
							  filter={this.props.filter}
							  searchText={this.props.searchText}
	                          onUpdateInput={this.props.onUpdateInput}
	                          inputStyle={{color: this.props.fontColor}}
	                          textFieldStyle={this.props.styles}
	                       	  errorText={this.props.errorText}
	                          id={this.props.id}
	                          openOnFocus={this.props.openOnFocus}
	                          popoverProps={TABLE_AUTO_COMPLETE_STYLE.popoverProps}
	                          menuStyle={TABLE_AUTO_COMPLETE_STYLE.menuStyle}
	        	/>
        	</div>
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
	openOnFocus: PropTypes.bool.isRequired,
}

AutoCompleteField.defaultProps = {
	floatingLabelText: "Text"
}