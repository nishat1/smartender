import React, { Component } from 'react';
import './App.css';
import { Route, HashRouter, Switch } from 'react-router-dom';
import Main from './components/Main';
import SignIn from './components/SignIn';
import ScrollToTop from './components/ScrollTop';
import PathError from './components/PathError';

// import Routes from './routes'

class App extends Component {

  state = {
    authenticated: false
  }

  authenticateUser = (bool) => {
    this.setState({ authenticated: bool });
  }

  render() {
    return (
      <HashRouter>
        <ScrollToTop>
          <Switch>
            {this.state.authenticated && <Route 
              exact 
              path='/home' 
              render={(routeProps) => (
                <Main {...routeProps} 
                  // authenticated={this.state.authenticated} -- add props if ever required to pass
                />
              )} /> }
            <Route 
              exact 
              path='/' 
              render={(routeProps) => (
                <SignIn {...routeProps} 
                  authenticateUser={this.authenticateUser} />
              )} />
            <Route 
              component={ PathError } />
          </Switch>
        </ScrollToTop>
      </HashRouter>
    );
  }
}

export default App;
