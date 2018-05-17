// React
import React from 'react';

// Material UI Components
import Paper from 'material-ui/Paper';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import DeleteIcon from 'material-ui/svg-icons/content/remove';

// Helpers
import { formatDate } from '../helpers';

// CSS
import { noteBoxStyle, noteTextStyle, noteDateStyle, noteContainerStyle, noteKeywordClass } from '../jss/Note';

const Note = ({ noteId, keywords, date, text, viewNote, deleteNote }) => (
  <Paper style={noteBoxStyle} zDepth={1}>
    <div className='note'>
      <div
        id={noteId}
        onClick={event => {

          // If they click anywhere but the delete button
          if (!event.target.closest('.delete_button')) {
            viewNote(noteId)
          }
        }}
        style={noteContainerStyle}>

        <FloatingActionButton
          zDepth={1}
          style={{ zIndex: 1 }}
          backgroundColor={'#F78888'}
          mini={true}
          onClick={() => { deleteNote(noteId) }}
          className='delete_button'
        >
          <DeleteIcon className='delete_button' />
        </FloatingActionButton>

        <h4 style={noteKeywordClass}>{keywords}</h4>
        <p style={noteDateStyle}>
          {formatDate(date)}
        </p>
        <div className='note__text' style={noteTextStyle}>{text}</div>
        {/* Modify to show only first x amount of text?  Possibly set that in the css. */}
      </div>
    </div>
  </Paper>
);

export default Note;