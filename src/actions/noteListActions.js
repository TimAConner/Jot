import axios from 'axios';

export function mapNoteListStateToProps(state) {
  // This is what is taken out of the store!
  return {
    notes: [...state.noteList.notes],
    editor: { ...state.editor },
    saving: state.noteList.saving,
    sortBy: state.noteList.sortBy,
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
    viewNotesByDates: () => {
      dispatch({ type: 'view_notes_by_date_pending' });
      axios.get('http://localhost:8080/notes/?dateView=true')
        .then(response => {
          dispatch({ type: 'view_notes_by_date_fulfilled', payload: response.data });
        })
        .catch((response) => {
          dispatch({ type: 'view_notes_by_date_failed', payload: response });
        })
    },
    viewNotesByWeek: () => {
      dispatch({ type: 'view_notes_by_week_pending' });
      axios.get('http://localhost:8080/notes/?weekView=true')
        .then(response => {
          dispatch({ type: 'view_notes_by_week_fulfilled', payload: response.data });
        })
        .catch((response) => {
          dispatch({ type: 'view_notes_by_week_failed', payload: response });
        })
    },
    setNote: note => {
      dispatch({ type: 'set_editor_note', payload: note });
    },
    deleteNote: id => {
      dispatch({ type: 'delete_note_pending' });

      axios.delete(`http://localhost:8080/notes/${id}`)
        .then(response => {
          dispatch({ type: 'delete_note_fulfilled', payload: id });
        })
        .catch((response) => {
          dispatch({ type: 'delete_note_failed', payload: response });
        })
    },
  }
};