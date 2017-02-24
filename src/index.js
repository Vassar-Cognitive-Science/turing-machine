import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { initializeTapeAction } from './actions/index';
import { N_CELLS } from './constants/index';
import reducers from './reducers';
import App from './components/App';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const store = createStore(reducers);

store.dispatch(initializeTapeAction(N_CELLS));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('container')
);