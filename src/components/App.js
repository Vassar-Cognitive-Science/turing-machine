import React from 'react';
import AppToolBar from '../containers/AppToolBarContainer';
import Tape from '../containers/tape/TapeContainer';
import DynamicRuleTable from '../containers/table/DynamicRuleTableContainer';

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Paper from 'material-ui/Paper';
// import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

class App extends React.Component {
	render() {
		return (
  			<div>
  				<AppToolBar />
	    		<Tape />
	  			<DynamicRuleTable />
  			</div>
  		);
	}
}

export default App;

