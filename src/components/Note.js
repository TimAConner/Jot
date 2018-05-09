import React from 'react';

const Note = ({ noteId, keywords, date, text, viewNote, deleteNote}) => (
  <div className='note' id={noteId} onClick={() => viewNote(noteId)}>
    <h2 className='note__keywords'>{keywords}</h2>
    <p className='note__date'>{date}</p>
    <p className='note__text'>{text}</p> 
    <button className='note__delete' onClick={() => deleteNote(noteId)}>Delete</button>
    {/* Modify to show only first x amount of text?  Possibly set that in the css. */}
  </div>
);

export default Note;