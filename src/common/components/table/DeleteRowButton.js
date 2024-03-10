import React from 'react'
import IconButton from 'material-ui/IconButton'
import Delete from 'material-ui/svg-icons/action/delete-forever'

const style = {
  icon: {
    color: '#FF9800',
    hoverColor: '#F44336'
  }
}

export default class DeleteRowButton extends React.Component {
  render () {
    return (
            <IconButton
              onClick={this.props.deleteRow}
              id={this.props.id}
            >
              <Delete {...style.icon}/>
            </IconButton>
    )
  }
}
