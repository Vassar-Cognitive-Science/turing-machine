import reducer from './reducers';
import { createStore } from 'redux';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';


let store =  createStore(reducer);