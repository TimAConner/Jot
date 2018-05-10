export default function reducer(state = {
  notes: [],
}, action) {
  switch (action.type) {
    case 'view_notes_pending': {
      return {
        ...state,
      };
    }
    case 'view_notes_failed': {
      return {
        ...state,
      };
    }
    case 'view_notes_fulfilled': {

      // Merge new notes with olds versions of the note.
      const mergedNotes = [
        ...state.notes,
        ...action.payload,
      ].reverse().filter((uniqueNote, index, array) => array.indexOf(array.find(note => note.id = uniqueNote.id)) === index);

      return {
        ...state,
        notes: [...mergedNotes],
      }
    }
    default: {
      return state;
    }
  }
}