import React from 'react';
import { connect } from "react-redux";

import { mapNoteStateToProps, mapDispatchToProps } from '../actions/noteActions';

import Note from './Note';

class Jot extends React.Component {
  viewNote(id) {
    console.log("View", id);
  }
  deleteNote(id) {
    console.log("Delete", id);
  }

  constructor(props) {
    super(props); 

    this.viewNote = this.viewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }


  render() {
    return (
      <div className='Jot'>
        <h1>Jot</h1>

        {console.log(this.props)}
        {this.props.notes.notes.map(({ noteId, keywords, date, text }) => <Note
          noteId={noteId}
          keywords={keywords}
          date={date}
          text={text}
          viewNote={this.viewNote}
          deleteNote={this.deleteNote}
          key={noteId}
        />)}
        <button onClick={() => this.props.viewAllNotes()}>Load Notes</button>
      </div>
    );
  }
};

export default connect(mapNoteStateToProps, mapDispatchToProps)(Jot);