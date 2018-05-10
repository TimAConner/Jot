import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { Provider } from "react-redux";

import logger from "redux-logger";
import thunk from "redux-thunk";
import promise from "redux-promise-middleware";

import registerServiceWorker from './registerServiceWorker';
import { createStore, applyMiddleware } from 'redux';

import reducer from "./reducers"

const middleware = applyMiddleware(promise(), thunk, logger);

let store = createStore(reducer, middleware);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>
  ,
  document.getElementById('root'));
registerServiceWorker();
