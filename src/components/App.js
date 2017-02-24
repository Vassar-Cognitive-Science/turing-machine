import React from 'react';
import AppToolBar from '../containers/AppToolBarContainer';
import Tape from '../containers/TapeContainer';
import DynamicRuleTable from '../containers/DynamicRuleTableContainer';
import Paper from 'material-ui/Paper';
import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class App extends React.Component {
	render() {
		return (
  			<div>
  				<AppToolBar />
	    		<Tape />
	  			<DynamicRuleTable />
	  			<footer className='footer'></footer>
  			</div>
  		);
	}
}

export default App;

