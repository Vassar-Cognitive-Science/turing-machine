import React, { PropTypes } from 'react';
import IconButton from 'material-ui/IconButton';
import Delete from 'material-ui/svg-icons/action/delete-forever';
import { TABLE_ROW_NO_COL_STYLE } from '../../constants/components/Table';

const style = {
  icon: {
    color: '#FF9800',
    hoverColor: '#F44336'
  }
}

class DeleteRowButton extends React.Component {

	render() {
    return (
            <IconButton  
              onTouchTap={this.props.deleteRow}
              id={this.props.id}>
              <Delete {...style.icon}/>
            </IconButton>
        )
	}
}

DeleteRowButton.PropTypes = {
	deleteRow: PropTypes.func.isRequired,
	parent: PropTypes.string.isRequired,
  id: PropTypes.string.isRequired,
}

export default DeleteRowButton;