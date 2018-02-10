import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';

import App from '../common/containers/AppContainer';
import PageNotFound from '../common/components/PageNotFound';
import rootReducer from '../common/reducers';
import { resizeScreenAndTapeAction } from '../common/actions/guiActions';
import { initMachineAction, loadMachineAction } from '../common/actions/machineActions';

const preloadedState = window.__PRELOADED_STATE__;

const store = createStore(rootReducer, applyMiddleware(thunk));

window.addEventListener('resize', () => {
	store.dispatch(resizeScreenAndTapeAction(window.innerWidth, false));
});

window.addEventListener('beforeunload', (e) => {
	let state = store.getState();
	if (state.anyChangeInTrial || state.anyChangeInNormal) {
		e.returnValue = true;
		return true;
	}
});

if (preloadedState) {
	store.dispatch(loadMachineAction(preloadedState));
} else {
	store.dispatch(initMachineAction());
}

ReactDOM.render(
  <Provider store={store}>
  	<MuiThemeProvider>
	  	<Router history={createBrowserHistory()}>
			<div>
				<Route exact path="/" component={App} />
				<Route exact path="/:id" component={App} />
				<Route exact path="/error/404" component={PageNotFound} />
			</div>
	  	</Router>
  	</MuiThemeProvider>
  </Provider>,
  document.getElementById('container')
);

