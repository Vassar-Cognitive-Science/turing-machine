import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { initMachineAction } from './actions/index';
import { N_CELLS } from './constants/GUISettings';
import reducers from './reducers';
import App from './components/App';

injectTapEventPlugin();

const store = createStore(reducers);

store.dispatch(initMachineAction(N_CELLS));

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('container')
);