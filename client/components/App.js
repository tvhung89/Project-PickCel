import React, {Component} from 'react'
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom"
import { hot } from 'react-hot-loader'

import * as types from '../actions/actionTypes'
import clientUtils from '../utils'
import config from '../../config/config'

import HomeLayout from './layouts/HomeLayout'
import DashboardLayout from './layouts/DashboardLayout'
import NotFound from './layouts/NotFound'

const PrivateRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={(props) => {
    const isCookieExist = clientUtils.get_cookie(config.access_token_key) && clientUtils.get_cookie(config.x_site_token_key)
    if (!isCookieExist) {
      localStorage.removeItem(types.USER_LOGGED_IN)
      localStorage.removeItem(types.GOOGLE_LOGGED_IN)
    }
    
    return (
      isCookieExist ? <Component {...props} /> : <Redirect to="/" />
    )
  }} />
)

const LoggedInRoute = ({ component: Component, ...rest}) => (
  <Route {...rest} render={(props) => {
    const isCookieExist = clientUtils.get_cookie(config.access_token_key) && clientUtils.get_cookie(config.x_site_token_key)
    if (!isCookieExist) {
      localStorage.removeItem(types.USER_LOGGED_IN)
      localStorage.removeItem(types.GOOGLE_LOGGED_IN)
    }

    return (
      isCookieExist ? <Redirect to="/dashboard" /> : <Component {...props} />
    )
  }} />
)

setInterval(() => {
  const isCookieExist = clientUtils.get_cookie(config.access_token_key) && clientUtils.get_cookie(config.x_site_token_key)
  if (!isCookieExist && window.location.pathname.indexOf('dashboard') > -1) window.location = '/'
}, 10000)

class App extends Component {
  render() {
    return(
        <Router>
            <Switch>
              <PrivateRoute path="/dashboard" component={DashboardLayout} />
              <LoggedInRoute path="/" component={HomeLayout} />
              <Route path="*" component={NotFound} />
            </Switch>
        </Router>
    );
  }
}

export default hot(module)(App)