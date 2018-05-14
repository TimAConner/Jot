import React, { Component } from 'react';
// import axios from "axios";

import { Switch, Route, BrowserRouter } from 'react-router-dom';

// import { isLoggedIn } from './helpers';

// import Note from './components/Note';
import Login from './components/Login';
import Jot from './components/Jot';
import NoteEditor from './components/NoteEditor';

class App extends Component {

  render() {
    return (
      <div className="App">
        <BrowserRouter>
          <Switch>
            <Route path='/login' component={Login} />
            <Route path='/noteEditor' component={NoteEditor} />
            <Route exact path='/'component={Jot}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
};
export default App;