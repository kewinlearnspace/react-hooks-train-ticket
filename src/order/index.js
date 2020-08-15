import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import 'normalize.css/normalize.css';

import store from './store';
import App from './App.jsx';
import './index.css';

import * as serviceWorker from '../serviceWorker';
ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

if ('production' === process.env.NODE_ENV) {
  // 生产环境
  serviceWorker.register();
} else {
  serviceWorker.unregister();
}
