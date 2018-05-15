// React
import React from 'react';

// Material UI Components
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DeleteButton from 'material-ui/svg-icons/content/remove';


const noteBoxStyle = {
  margin: '1rem',
  padding: '0.5rem 1rem 0.5rem',
  textAlign: 'left',
};

const noteTextStyle = {
  'whiteSpace': 'nowrap',
  'overflow': 'hidden',
  'textOverflow': 'ellipsis',
};

const Note = ({ noteId, keywords, date, text, viewNote, deleteNote }) => (
  <MuiThemeProvider>
    <Paper style={noteBoxStyle} zDepth={1}>
      <div className='note'>
        <FloatingActionButton
          backgroundColor={'red'}
          mini={true}
          onClick={() => deleteNote(noteId)}
        >
          <DeleteButton />
        </FloatingActionButton>
        <div id={noteId} onClick={() => viewNote(noteId)}>
          <h4 className='note__keywords'>{keywords}</h4>
          <p className='note__date'>{date}</p>
          <div className='note__text' style={noteTextStyle}>{text}</div>
          {/* Modify to show only first x amount of text?  Possibly set that in the css. */}
        </div>
      </div>
    </Paper>
  </MuiThemeProvider>
);

export default Note;