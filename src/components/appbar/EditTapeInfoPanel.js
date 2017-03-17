import React, { PropTypes } from 'react';
import { Card } from 'material-ui/Card';
import Divider from 'material-ui/Divider';
import { List, ListItem } from 'material-ui/List';
import FlatButton from 'material-ui/FlatButton';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

let test = [1,2,3,4,5,6, "#"];

class EditTapeInfoPanel extends React.Component {

	render() {
		return (
			<div className="card-of-edit-tape-info-pane">
         		<MuiThemeProvider>
					<Card>
						<List>
						<ListItem disabled={true} primaryText="File Preview:" />
						<Divider />
	               		<ListItem disabled={true} primaryText="Head state:" />
	               		<ListItem disabled={true} primaryText="Tape pointer:"  />
	               		<ListItem disabled={true} primaryText="Anchor cell:"  />
	               		<ListItem disabled={true} primaryText={"Tape Cells: " + test}  />
	               		</List>
              			<FlatButton label="Save" primary={true} style={{float: "right"}} onTouchTap={this.props.saveEdit}/>
              			<FlatButton label="Cancel" secondary={true} style={{float: "right"}} onTouchTap={this.props.cancelEdit}/>
					</Card>
				</MuiThemeProvider>
			</div>
		)
	}
}


export default EditTapeInfoPanel;