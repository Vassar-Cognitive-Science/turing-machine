import React from 'react';
import AppBar from '../containers/AppBarContainer';
import Tape from '../containers/tape/TapeContainer';
import DynamicRuleTable from '../containers/table/DynamicRuleTableContainer';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Paper from 'material-ui/Paper';
// import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

class App extends React.Component {
	render() {
		return (
  			<div className="app-container">
  				<AppBar />
	    		<Tape />
	  			<DynamicRuleTable />
  			</div>
  		);
	}
}

export default App;

