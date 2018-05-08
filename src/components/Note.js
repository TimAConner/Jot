import React from 'react';

const Note = ({ noteId, keywords, date, text, viewNote, deleteNote}) => (
  <div className='note' id={noteId} onClick={() => viewNote(noteId)}>
    <button className='note__delete' onClick={() => deleteNote(noteId)}>Delete</button>
    <h2 className='note__keywords'>{keywords}</h2>
    <h3 className='note__date'>{date}</h3>
    <p className='note__text'>{text}</p>
  </div>
)
export default Note;