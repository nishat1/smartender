import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';

import Routes from './routes'

class App extends Component {

  render() {
    return (
      <div>
        {/* Add components here */}
        {/* <Main /> */}
        <Routes />
      </div>
    );
  }
}

export default App;
