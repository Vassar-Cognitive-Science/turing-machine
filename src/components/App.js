import React from 'react';
import AppBar from '../containers/appbar/AppBarContainer';
import Tape from '../containers/tape/TapeContainer';
import DynamicRuleTable from '../containers/table/DynamicRuleTableContainer';

class App extends React.Component {

	render() {
		return (
  			<div className="app-container">
  				<AppBar />
	    		<Tape />
	    		{(this.props.isEdittingTrial) ? <div className='blank-background'></div> : <DynamicRuleTable />}
  			</div>
  		);
	}
}

export default App;

