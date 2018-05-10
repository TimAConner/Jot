import axios from 'axios';

export function mapNoteListStateToProps(state) {
  // This is what is taken out of the store!
  return {
    notes: [...state.noteList.notes],
    editor: { ...state.editor },
  }
}

export function mapNoteListDispatchToProps(dispatch) {
  return {
    viewAllNotes: () => {
      dispatch({ type: 'view_notes_pending' });
      axios.get('http://localhost:8080/notes/')
        .then(response => {
          dispatch({ type: 'view_notes_fulfilled', payload: response.data });
        })
        .catch((response) => {
          dispatch({ type: 'view_notes_failed', payload: response });
        })
    },
    setNote: note => {
      dispatch({ type: 'set_editor_note', payload: note });
    },
  }
};