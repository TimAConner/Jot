import axios from 'axios';

export function mapNoteStateToProps(state) {
  return {
    notes: state.notes,
  }
}

export function mapDispatchToProps(dispatch) {
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
  }
};