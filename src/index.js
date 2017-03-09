import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore , applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import injectTapEventPlugin from 'react-tap-event-plugin';
import { resizeScreenAndTapeAction } from './actions/guiActions';
import { initMachineAction } from './actions/index';
import reducers from './reducers';
import App from './components/App';

injectTapEventPlugin();

const store = createStore(reducers, applyMiddleware(thunk));

window.addEventListener('resize', () => {
    store.dispatch(resizeScreenAndTapeAction(window.innerWidth));
});

store.dispatch(initMachineAction());

ReactDOM.render(
  <Provider store={store}><App /></Provider>,
  document.getElementById('container')
);