import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import { initializeTape } from './actions/index.js';
import reducers from './reducers';
import App from './components/App';
import injectTapEventPlugin from 'react-tap-event-plugin';

injectTapEventPlugin();

const store = createStore(reducers);
store.dispatch(initializeTape(21));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('container')
);