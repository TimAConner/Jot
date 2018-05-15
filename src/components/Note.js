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
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

const noteDateStyle = {
  fontSize: '0.8rem',
  position: 'absolute',
  top: '0rem',
  right: '0rem',
};

const noteContainerStyle = {
  position: 'relative',
};

const formatDate = postgresDate => {
  const date = new Date(postgresDate.replace(' ', 'T'));
  return `${date.toLocaleString([], {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour12: true,
    hourCycle: true,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

const Note = ({ noteId, keywords, date, text, viewNote, deleteNote }) => (
  <MuiThemeProvider>
    <Paper style={noteBoxStyle} zDepth={1}>
      <div className='note'>
        <div
          id={noteId}
          onClick={event => {

            // If they click anywhere but the delete button
            if(!event.target.classList.contains('delete_button')){
              viewNote(noteId)
            }
          }}
          style={noteContainerStyle}>

          <FloatingActionButton
            zDepth={1}
            style={{ zIndex: 1 }}
            backgroundColor={'red'}
            mini={true}
            onClick={() => { deleteNote(noteId) }}
            className='delete_button'
          >
            <DeleteButton className='delete_button'/>
          </FloatingActionButton>

          <h4 className='note__keywords'>{keywords}</h4>
          <p style={noteDateStyle}>
            {formatDate(date)}
          </p>
          <div className='note__text' style={noteTextStyle}>{text}</div>
          {/* Modify to show only first x amount of text?  Possibly set that in the css. */}
        </div>
      </div>
    </Paper>
  </MuiThemeProvider>
);

export default Note;