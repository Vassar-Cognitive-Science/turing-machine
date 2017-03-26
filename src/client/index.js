import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/createBrowserHistory';

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

if (preloadedState) {
	store.dispatch(loadMachineAction(preloadedState));
} else {
	store.dispatch(initMachineAction());
}

injectTapEventPlugin();
ReactDOM.render(
  <Provider store={store}>
  	<Router history={createBrowserHistory()}>
		<div>
			<Route exact path="/" component={App} />
			<Route path="/saves/*" component={App} />
			<Route path="/404" component={PageNotFound} />
		</div>
  	</Router>
  </Provider>,
  document.getElementById('container')
);

