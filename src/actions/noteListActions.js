import axios from 'axios';

export function mapNoteListStateToProps(state) {
  // This is what is taken out of the store!
  return {
    notes: [...state.noteList.notes],
    editor: { ...state.editor },
  }
}

export function mapNoteListDispatchToProps(dispatch) {
  const header = new Headers({ 'Content-Type': 'application/json' });
  return {
    viewAllNotes: () => {
      dispatch({ type: "view_notes_pending" });
      axios.get("http://localhost:8080/notes/",
        { header })
        .then(response => {
          console.log('resonse', response);
          dispatch({ type: "view_notes_fulfilled", payload: response.notes });
        })
        .catch((response) => {
          dispatch({ type: 'view_notes_failed', payload: response });
        })
    },
    setNote: noteId => {
      dispatch({ type: "set_editor_note", payload: noteId });
    },
  }
};