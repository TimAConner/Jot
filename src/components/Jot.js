import React from 'react';
import { connect } from "react-redux";

import { Redirect } from 'react-router-dom';

// import { mapNoteStateToProps, mapNoteDispatchToProps } from '../actions/noteActions';
import { mapUserStateToProps, mapUserDispatchToProps } from '../actions/userActions';

import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import Loader from './Loader';

class Jot extends React.Component {

  constructor(props) {
    super(props);
    this.props.isLoggedIn();
  }



  // isLoggedIn()
  // .then(user => {
  //   if (user !== false) { // Is logged in?
  //     return (
  //       <Jot />
  //     );
  //   } else {
  //     return (
  //       <Redirect to={{
  //         pathname: '/login',
  //         state: { from: props.location }
  //       }} />
  //     );
  //   }
  // });

  render() {
    return (
      <div className='Jot'>
        {/* <h1>Jot</h1> */}

        <NoteEditor />
        <NoteList />
        
        {/* LOADING START */}
        {this.props.user.isLoading ? <Loader /> : null}

        {!this.props.user.isLoading && this.props.user.user === null ? (<Redirect to={{
          pathname: '/login',
          state: { from: this.props.location }
        }} />) : null}
        {/* LOADING END */}

      
        
        {/* <button onClick={() => this.props.viewAllNotes()}>Load Notes</button> */}
      </div>
    );
  }
};

// export default connect(mapNoteStateToProps, mapNoteDispatchToProps)(Jot);
export default connect(mapUserStateToProps, mapUserDispatchToProps)(Jot);