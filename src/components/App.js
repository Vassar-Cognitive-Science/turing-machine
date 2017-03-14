import React from 'react';
import AppBar from '../containers/appbar/AppBarContainer';
import Tape from '../containers/tape/TapeContainer';
import DynamicRuleTable from '../containers/table/DynamicRuleTableContainer';
import EditTapeInfoPanel from '../containers/appbar/EditTapeInfoPanelContainer';

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

