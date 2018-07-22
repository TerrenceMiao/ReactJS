import * as React from 'react';
import * as ReactDOM from 'react-dom';

import Hello from './containers/Hello';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { EnthusiasmAction } from './actions/index';
import { enthusiasm } from './reducers/index';
import { IStoreState } from './types/index';

import './index.css';

const store = createStore<IStoreState, EnthusiasmAction, null, null>(enthusiasm, {
  enthusiasmLevel: 1,
  languageName: 'TypeScript',
});

ReactDOM.render(
  <Provider store={store}>
    <Hello />
  </Provider>,
  document.getElementById('root') as HTMLElement
);