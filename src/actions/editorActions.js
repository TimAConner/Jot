import axios from 'axios';
import { backendUrl, putPostHeaders } from '../helpers';

export function mapEditorStateToProps(state) {
  return {
    editor: state.editor,
    noteLoaded: state.editor.noteLoaded,
    saving: state.editor.saving,
  }
}

export function mapEditoreDispatchToProps(dispatch) {
  return {
    saveNote: (isSaving, id, text, keywords) => {
      if (!isSaving) {
        dispatch({ type: 'save_note_pending' });
        
        const requestObject = {
          text,
        };

        // Only add in a keywords field if there are keywords
        if (keywords.length > 0) {
          requestObject.keywords = keywords;
        }

        // If no id provided, post note as a new note.
        // If id provided, post note to that existing note.
        let createNoteUrl = typeof id !== "undefined"
          ? `${backendUrl}/notes/${id}`
          : `${backendUrl}/notes/`;

        axios.put(createNoteUrl, JSON.stringify(requestObject), putPostHeaders)
          .then(response => {
            dispatch({ type: 'save_note_fulfilled', payload: response.data });

            dispatch({ type: 'view_notes_pending' });
            axios.get('http://localhost:8080/notes/')
              .then(response => {
                dispatch({ type: 'view_notes_fulfilled', payload: response.data });
              })
              .catch((response) => {
                dispatch({ type: 'view_notes_failed', payload: response });
              })

          })
          .catch((response) => {
            dispatch({ type: 'save_note_failed', payload: response });
          });
      }
    },
  }
};