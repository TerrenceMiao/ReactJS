import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { createStore } from 'redux';

import { EnthusiasmAction } from './actions/index';
import { enthusiasmReducer } from './reducers/index';
import { IStoreState } from './types/index';

import Hello from './containers/Hello';

import './index.css';

const store = createStore<IStoreState, EnthusiasmAction, null, null>(enthusiasmReducer, 
    { enthusiasmLevel: 1, languageName: 'TypeScript' }, 
    (window as any).__REDUX_DEVTOOLS_EXTENSION__ && (window as any).__REDUX_DEVTOOLS_EXTENSION__()
);

ReactDOM.render(
    <Provider store={store}>
        <Hello />
    </Provider>,
    document.getElementById('root') as HTMLElement
);