import React, { Component } from 'react';
import axios from 'axios';
// import axios from "axios";

import { Switch, Route, Redirect, BrowserRouter } from 'react-router-dom';


import Note from './components/Note';
import Login from './components/Login';
import Jot from './components/Jot';

class App extends Component {

  render() {
    return (
      <div className="App">
      

        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login} />
            <Route exact path='/' render={props => {
              if (true) { // Is logged in?
                return (
                  <Jot />
                );
              } else {
                console.log('else');
                return (
                  <Redirect to={{
                    pathname: '/login',
                    state: { from: props.location }
                  }} />
                );
              }
            }} />
          </Switch>
        </BrowserRouter>

      </div>
    );
  }
};
export default App;