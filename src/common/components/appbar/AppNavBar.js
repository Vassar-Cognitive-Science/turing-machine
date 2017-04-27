import React, { Component } from 'react';
import {
	grey50,
	cyan500
} from 'material-ui/styles/colors';

class AppNavBar extends Component {
	render() {
		return (
		<div style={{backgroundColor: cyan500, width: "100%", height: 50}}>
			<p style={{color: grey50, fontSize: 24, paddingTop: 7, paddingLeft: 10}}>
				Turing Machine Simulator
			</p>
		</div>
		)
	}
}

export default AppNavBar;