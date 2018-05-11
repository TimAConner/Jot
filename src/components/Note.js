import React from 'react';

const Note = ({ noteId, keywords, date, text, viewNote, deleteNote }) => (
  <div className='note'>
    <div id={noteId} onClick={() => viewNote(noteId)}>
      <h2 className='note__keywords'>{keywords}</h2>
      <p className='note__date'>{date}</p>
      <div className='note__text'>{text}</div>
      {/* Modify to show only first x amount of text?  Possibly set that in the css. */}
    </div>
    <button className='note__delete' onClick={() => deleteNote(noteId)}>Delete</button>
  </div>
);

export default Note;