import axios from 'axios';
import { backendUrl, putPostHeaders, reloadNotes } from '../helpers';

export function mapEditorStateToProps(state) {
  return {
    editor: state.editor,
    existingNoteLoaded: state.editor.existingNoteLoaded,
    saving: state.editor.saving,
    focusOnNote: state.editor.focusOnNote,
    reloadSortBy: state.noteList.sortBy,
    options: state.user.options,
    finalSaveRequired: state.editor.finalSaveRequired,
    text: state.editor.text,
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
        let createNoteUrl = id !== null
          ? `${backendUrl}/notes/${id}`
          : `${backendUrl}/notes/`;

        console.log(createNoteUrl);

        axios.put(createNoteUrl, JSON.stringify(requestObject), putPostHeaders)
          .then(response => {
            dispatch({ type: 'save_note_fulfilled', payload: response.data });
            reloadNotes({
              sortBy: reloadSortBy,
              dispatch,
              response,
            });
          })
          .catch((response) => {
            dispatch({ type: 'save_note_failed', payload: response });
          });
      }
    },
    newNote: () => {
      dispatch({ type: 'set_new_note' });
    },
    setFinalSaveRequired: value => {
      dispatch({ type: 'final_save_required', payload: value });
    },
  }
};