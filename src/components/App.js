import React from 'react';
import AppBar from '../containers/appbar/AppBarContainer';
import Tape from '../containers/tape/TapeContainer';
import DynamicRuleTable from '../containers/table/DynamicRuleTableContainer';
import EditTapeInfoPanel from './appbar/EditTapeInfoPanel';
import AppNavBar from './appbar/AppNavBar'

// import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
// import Paper from 'material-ui/Paper';
// import {BottomNavigation, BottomNavigationItem} from 'material-ui/BottomNavigation';

  			// <div className="app-container">
  			// 	<AppBar />
	    // 		<Tape />
	  		// 	<DynamicRuleTable />
  			// </div>

class App extends React.Component {

	render() {
		return (
  			<div className="app-container">
  				<AppBar />
	    		<Tape />
	    		{(this.props.isEdittingTrial) ? <EditTapeInfoPanel /> : <DynamicRuleTable />}
  			</div>
  		);
	}
}

export default App;

