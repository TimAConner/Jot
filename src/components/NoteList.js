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

  viewNote(id) {
    console.log('View', id);
    this.props.setNote(this.props.notes.find(note => note.id === id));
  }
  deleteNote(id) {
    console.log("Delete", id);
    this.props.deleteNote(id);
  }

  componentDidMount(){
    this.props.viewAllNotes();
  }

  render() {
    console.log(this.props);
    return (
      <div className="noteList">
        <h1>NoteList</h1>
        {this.props.saving ? <Loader
          text="Saving"
        /> : null}
        <button >Sort by Keyword</button>
        <button>Sort by Edit Date</button>
        <button>Sort by Week</button>
        {this.props.notes.map(({ id, Keywords: keywords, Note_Dates: [{ edit_date: date }], text }) => {
          return (<Note
            noteId={id}
            keywords={keywords.length > 0 ? keywords.map(keywordObj => keywordObj.keyword).reduce((acc, cv) => acc + ", " + cv) : []}
            date={date}
            text={text}
            viewNote={this.viewNote}
            deleteNote={this.deleteNote}
            key={id}
          />);
        })}
      </div>
    );
  }
};

export default connect(mapNoteListStateToProps, mapNoteListDispatchToProps)(NoteList);