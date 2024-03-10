import React from 'react';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/RaisedButton';
import Snackbar from 'material-ui/Snackbar';
import Divider from 'material-ui/Divider';
import Drawer from 'material-ui/Drawer';
import Subheader from 'material-ui/Subheader';
import { List } from 'material-ui/List';
import IconButton from 'material-ui/IconButton';
import MenuItem from 'material-ui/MenuItem';

import { ProgressCircle } from './appbar/AppBar';
import AppBar from '../containers/appbar/AppBarContainer';
import TrialItem from '../containers/appbar/TrialItemContainer';
import Tape from '../containers/tape/TapeContainer';
import DynamicRuleTable from '../containers/table/DynamicRuleTableContainer';
import { DRAWER_STYLE, APPBAR_STYLES } from '../constants/components/Appbar';

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
			trialDrawerToggle: false,
		};

		this.handleTrialDrawerToggle = () => {
			this.setState({
				trialDrawerToggle: !this.state.trialDrawerToggle
			});
		};

		this.handleTrialDrawerClose = () => {
			this.setState({
				trialDrawerToggle: false
			});
		}

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

	componentWillMount() {
		this.props.handleLoad();
	}

	render() {
		const actions = [
				      	<FlatButton
				        label="Okay"
				        primary={true}
				        keyboardFocused={true}
				        onClick={this.handleDialogClose}
				      	/>
    	];

		return (
  			<div className="app-container">
		    	<Snackbar
	          		open={this.state.saveMachineResponseOpen}
	          		message={(this.state.anythingNewWithMachine) ? snackBarMessage.successful : snackBarMessage.nothingNew}
	          		contentStyle={APPBAR_STYLES.buttons.snackBar.contentStyleGenerator(this.state.anythingNewWithMachine)}
	          		autoHideDuration={APPBAR_STYLES.buttons.snackBar.timeout}
	          		onRequestClose={this.handleSaveMachineResponseClose}
	        	/>

		        <Dialog
		          title="Something is wrong!"
		          actions={actions}
		          modal={false}
		          open={this.state.dialogOpen}
		          onRequestClose={this.handleDialogClose}
		        >
		          {this.state.errorMessage}
		        </Dialog>


				<Drawer
		          docked={false}
		          style={DRAWER_STYLE.style}
		          open={this.state.trialDrawerToggle}
		          onRequestChange={(open) => this.setState({trialDrawerToggle: open})}
		        >
			        <Subheader style={DRAWER_STYLE.subheadStyle}>{DRAWER_STYLE.subheadText}</Subheader>
			        <Divider />
			        <div style={DRAWER_STYLE.listStyle}>
			        <List>
			        	{this.props.testsById.map((obj) => {
			        		if (this.props.runningTrials.includes(obj.id))  {
			        			return (<MenuItem primaryText={obj.name} key={obj.id} rightIcon={ProgressCircle()}/>);
			        		}
			        		return (<TrialItem id={obj.id} key= {obj.id} name={obj.name} drawerCloseCallBack={this.handleTrialDrawerClose}/>)
			        	})}
			        </List>
			        </div>
			        <div style={DRAWER_STYLE.controlStyle}>
			        <Divider />
			        {(this.props.isRunningTrial) ?
						<MenuItem primaryText={DRAWER_STYLE.buttons.runTrial.runningLabel} leftIcon={ProgressCircle()} /> :
						<MenuItem primaryText={DRAWER_STYLE.buttons.runTrial.label} leftIcon={DRAWER_STYLE.buttons.runTrial.icon}
				 			onClick={this.props.handleRunAllTests}/>}

			        <MenuItem primaryText={DRAWER_STYLE.buttons.addTrial.label} leftIcon={DRAWER_STYLE.buttons.addTrial.icon}
			         onClick={this.props.handleAddTest}/>
			        <Divider />
			        <MenuItem primaryText={DRAWER_STYLE.buttons.uploadTests.label} 
			        	leftIcon={DRAWER_STYLE.buttons.uploadTests.icon} 
			        	onClick={this.props.uploadTests} />
			        <MenuItem primaryText={DRAWER_STYLE.buttons.saveTests.label} leftIcon={DRAWER_STYLE.buttons.saveTests.icon} onClick={this.props.downloadAllTests} />

			        <Divider />
			        <MenuItem primaryText={DRAWER_STYLE.buttons.deleteTests.label} leftIcon={DRAWER_STYLE.buttons.deleteTests.icon}
			         onClick={this.props.handleDeleteTests}/>
			        </div>
		        </Drawer>


  				<AppBar snackBarPopUpCallback={this.handleSaveMachineResponseOn} 
  						errorMessagePopUpCallback={this.handleDialogOpen}
  						setErrorMessageCallback={this.setErrorMessage}
  						snackBarSetAnythingNewCallback={this.setAnythingNewWithMachine}
  						trialDrawerToggleCallback={this.handleTrialDrawerToggle}
  						match={this.props.match}
  				/>
	    		<Tape 
	    			trialDrawerToggleCallback={this.handleTrialDrawerToggle}
	    		/>
	    		{
	    			(this.props.isEdittingTrial) ? 
	    			<div className='blank-background' /> : 
	    			<DynamicRuleTable />
	    		}
  			</div>
  		);
	}
}

export default App;

