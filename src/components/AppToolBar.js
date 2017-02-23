import React, { PropTypes } from 'react';
import AppBar from 'material-ui/AppBar';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

class AppToolBar extends React.Component {
	render() {
		return (
			<div className='app-bar'>
				<MuiThemeProvider>
					<AppBar
						title={"Turing Machine Simulator"}
					/>
				</MuiThemeProvider>
			</div>
		)
	}
}

AppToolBar.PropTypes = {

};

export default AppToolBar;