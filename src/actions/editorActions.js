import axios from 'axios';
import { backendUrl, putPostHeaders } from '../helpers';

export function mapEditorStateToProps(state) {
  return {
    editor: state.editor,
    noteLoaded: state.editor.noteLoaded,
    saving: state.editor.saving,
    focusOnNote: state.editor.focusOnNote,
    reloadSortBy: state.noteList.sortBy,
  }
}

export function mapEditoreDispatchToProps(dispatch) {
  return {
    setFocusToFalse: () => {
      dispatch({ type: 'set_focus_to_false' });
    },
    saveNote: (isSaving, id, text, keywords, reloadSortBy = 'notes') => {
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

            // Reload view notes list below
            // Todo: check for curent list type and send that request.
            console.log(reloadSortBy);

            switch (reloadSortBy) {
              case 'notes': {
                axios.get('http://localhost:8080/notes/')
                  .then(response => {
                    dispatch({ type: 'view_notes_fulfilled', payload: response.data });
                  })
                  .catch((response) => {
                    dispatch({ type: 'view_notes_failed', payload: response });
                  });

                break;
              }
              case 'date': {
                dispatch({ type: 'view_notes_by_date_pending' });
                axios.get('http://localhost:8080/notes/?dateView=true')
                  .then(response => {
                    dispatch({ type: 'view_notes_by_date_fulfilled', payload: response.data });
                  })
                  .catch((response) => {
                    dispatch({ type: 'view_notes_by_date_failed', payload: response });
                  })

                break;
              }
              case 'week': {
                dispatch({ type: 'view_notes_by_week_pending' });
                axios.get('http://localhost:8080/notes/?weekView=true')
                  .then(response => {
                    dispatch({ type: 'view_notes_by_week_fulfilled', payload: response.data });
                  })
                  .catch((response) => {
                    dispatch({ type: 'view_notes_by_week_failed', payload: response });
                  })

                break;
              }
            }

          })
          .catch((response) => {
            dispatch({ type: 'save_note_failed', payload: response });
          });
      }
    },
  }
};