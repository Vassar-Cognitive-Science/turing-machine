import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import AppBar from '../containers/appbar/AppBarContainer';
import Tape from '../containers/tape/TapeContainer';
import DynamicRuleTable from '../containers/table/DynamicRuleTableContainer';
import { APPBAR_STYLES } from '../constants/components/Appbar';

const snackBarMessage = {
	successful: "Saved Successfully!",
	nothingNew: "Nothing really changes ~"
};

class App extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			saveMachineResponseOpen: false,
			anythingNewWithMachine: false,
			dialogOpen: false,
			errorMessage: "",
		};

		this.handleSaveMachineResponseOn = () => {
			this.setState({
				saveMachineResponseOpen: true,
			});
		};

		this.handleSaveMachineResponseClose = () => {
			this.setState({
				saveMachineResponseOpen: false,
			});
		};

		this.handleDialogOpen = () => {
			this.setState({
				dialogOpen: true
			});
		};

		this.handleDialogClose = () => {
			this.setState({
				dialogOpen: false
			});
		};

		this.setErrorMessage = (err) => {
			this.setState({
				errorMessage: err.toString(),
				dialogOpen: true
			});
		};

		this.setAnythingNewWithMachine = (flag) => {
			this.setState({
				anythingNewWithMachine: flag,
				saveMachineResponseOpen: true
			});
		}
	}

	render() {
		const actions = [
				      	<FlatButton
				        label="Okay"
				        primary={true}
				        keyboardFocused={true}
				        onTouchTap={this.handleDialogClose}
				      	/>
    	];

		return (
  			<div className="app-container">

  				<MuiThemeProvider>
		    	<Snackbar
	          		open={this.state.saveMachineResponseOpen}
	          		message={(this.state.anythingNewWithMachine) ? snackBarMessage.successful : snackBarMessage.nothingNew}
	          		contentStyle={APPBAR_STYLES.buttons.snackBar.contentStyleGenerator(this.state.anythingNewWithMachine)}
	          		autoHideDuration={APPBAR_STYLES.buttons.snackBar.timeout}
	          		onRequestClose={this.handleSaveMachineResponseClose}
	        	/>
        		</MuiThemeProvider>

        		<MuiThemeProvider>
		        <Dialog
		          title="Something is wrong!"
		          actions={actions}
		          modal={false}
		          open={this.state.dialogOpen}
		          onRequestClose={this.handleDialogClose}
		        >
		          {this.state.errorMessage}
		        </Dialog>
        		</MuiThemeProvider>

  				<AppBar snackBarPopUpCallback={this.handleSaveMachineResponseOn} 
  						errorMessagePopUpCallback={this.handleDialogOpen}
  						setErrorMessageCallback={this.setErrorMessage}
  						snackBarSetAnythingNewCallback={this.setAnythingNewWithMachine}/>
	    		<Tape />
	    		{(this.props.isEdittingTrial) ? <div className='blank-background'></div> : <DynamicRuleTable />}
  			</div>
  		);
	}
}

export default App;

