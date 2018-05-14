import React from 'react';
import { connect } from "react-redux";

import { Redirect } from 'react-router-dom';

// import { mapNoteStateToProps, mapNoteDispatchToProps } from '../actions/noteActions';
import { mapUserStateToProps, mapUserDispatchToProps } from '../actions/userActions';

import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import Option from './Option';
import Loader from './Loader';

class Jot extends React.Component {

  constructor(props) {
    super(props);
    this.props.authenticate();
  }

  logout() {
    localStorage.removeItem('jotToken');
    this.props.authenticate();
  }

  render() {
    return (
      <div className='Jot'>
      
        <NoteEditor />
        <NoteList />
        <Option />

        {/* Show loading screen while loading */}
        {this.props.user.isLoading ? <Loader /> : null}

        {/* Reroute to login if not logged in */}
        {!this.props.user.isLoading && this.props.user.user === null ? (<Redirect to={{
          pathname: '/login',
          state: { from: this.props.location }
        }} />) : null}

      
        <button onClick={() => this.logout()}>Logout</button>
        
        {/* <button onClick={() => this.props.viewAllNotes()}>Load Notes</button> */}
      </div>
    );
  }
};

// export default connect(mapNoteStateToProps, mapNoteDispatchToProps)(Jot);
export default connect(mapUserStateToProps, mapUserDispatchToProps)(Jot);