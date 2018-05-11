import React from 'react';
import { connect } from "react-redux";

import { mapNoteListStateToProps, mapNoteListDispatchToProps } from '../actions/noteListActions';

import Note from './Note';
import Loader from './Loader';

class NoteList extends React.Component {


  constructor(props) {
    super(props);
    console.log('state', this.state);
    console.log('props', this.props);

    this.viewNote = this.viewNote.bind(this);
    this.deleteNote = this.deleteNote.bind(this);
  }

  viewNote(note) {
    console.log(note);
    this.props.setNote(note);
  }

  deleteNote(id) {
    this.props.deleteNote(id);
  }

  componentDidMount() {
    switch (this.props.sortBy) {
      case 'notes': {
        this.props.viewAllNotes();
        break;
      }
      case 'dates': {
        this.props.viewNotesByDates();
        break;
      }
      default: {
        this.props.viewAllNotes();
        break;
      }
    }
  }

  generateList() {
    switch (this.props.sortBy) {
      case 'notes': {
        return this.props.notes.map(({ id, Keywords: keywords, Note_Dates: [{ edit_date: date }], text }) => {
          return (<Note
            noteId={id}
            keywords={keywords.length > 0 ? keywords.map(keywordObj => keywordObj.keyword).reduce((acc, cv) => acc + ", " + cv) : []}
            date={date}
            text={text}
            viewNote={() => this.viewNote(this.props.notes.find(note => note.id === id))}
            deleteNote={() => this.deleteNote(id)}
            key={id}
          />);
        });

        break;
      }
      case 'dates': {
        return this.props.notes.map(({ note_id, id, edit_date: date, Note: { Keywords: keywords, text } }) => {
          return (<Note
            noteId={note_id}
            keywords={keywords.length > 0 ? keywords.map(keywordObj => keywordObj.keyword).reduce((acc, cv) => acc + ", " + cv) : []}
            date={date}
            text={text}
            viewNote={() => this.viewNote({
              id: note_id,
              ...this.props.notes.find(note => note.note_id === note_id).Note,
            })}
            deleteNote={() => this.deleteNote(note_id)}
            key={id}
          />);
        });

        break;
      }
      default: {
        return this.props.notes.map(({ id, Keywords: keywords, Note_Dates: [{ edit_date: date }], text }) => {
          return (<Note
            noteId={id}
            keywords={keywords.length > 0 ? keywords.map(keywordObj => keywordObj.keyword).reduce((acc, cv) => acc + ", " + cv) : []}
            date={date}
            text={text}
            viewNote={() => this.viewNote(id)}
            deleteNote={() => this.deleteNote(id)}
            key={id}
          />);
        });
      }
    }
  }

  // ote
  // :
  // {text: "This is another test with a strange word.  Lets ed…it today.  There should be another edit date now.", user_id: 1, Keywords: Array(5)}
  // edit_date
  // :
  // "2018-05-11T14:36:02.860Z"
  // id
  // :
  // 8
  // note_id
  // :
  // 2

  render() {
    return (
      <div className='noteList'>
        <h1>NoteList</h1>
        {this.props.saving ? <Loader
          text='Saving'
        /> : null}
        <input type='text' placeholder='Search...' />
        <button onClick={() => this.props.viewAllNotes()}>Sort by Note</button>
        <button onClick={() => this.props.viewNotesByDates()}>Sort by Edit Date</button>
        <button>Sort by Week</button>
        {this.generateList()}
      </div>
    );
  }
};

export default connect(mapNoteListStateToProps, mapNoteListDispatchToProps)(NoteList);