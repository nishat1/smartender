import React from 'react'
import { Route, HashRouter, Switch } from 'react-router-dom'
import Main from './components/Main'
import SignIn from './components/SignIn'
import ScrollToTop from './components/ScrollTop'

export default props => (
    <HashRouter>
      <ScrollToTop>
        <Switch>
          <Route exact path='/home' component={ Main } />
          <Route exact path='/' component={ SignIn } />
        </Switch>
      </ScrollToTop>
    </HashRouter>
  )