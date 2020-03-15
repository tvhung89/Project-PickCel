import 'babel-polyfill';
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'
import {BrowserRouter as Router} from 'react-router-dom'
import {createBrowserHistory} from 'history'

import configureStore from './store/configureStore'
import App from './components/App'

const store = configureStore();
const customHistory = createBrowserHistory()

render(
    <Provider store={store}>
        <Router history={customHistory}>
            <App />
        </Router>
    </Provider>, 
    document.getElementById('root')
)