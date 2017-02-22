import React from 'react';
import Tape from '../containers/TapeContainer';
import DynamicRuleTable from '../containers/DynamicRuleTableContainer';

class App extends React.Component {
	render() {
		return (
  			<div>
	  			<div>
	    			<Tape />
	  			</div>
	  			<div>
	  				<DynamicRuleTable />
	  			</div>
  			</div>
  		);
	}
}

export default App;

