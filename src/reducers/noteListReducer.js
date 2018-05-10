export default function reducer(state = {
  notes: [],
}, action) {
  switch (action.type) {
    case 'delete_note_pending': {
      return {
        ...state,
      };
    }
    case 'delete_note_fulfilled': {
      const notes = [...state.notes].filter(note => note.id !== action.payload);

      return {
        ...state,
        notes: [...notes],
      };
    }
    case 'delete_note_failed': {
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
      // Reverse it to get the most recent notes first.
      const mergedNotes = [
        ...state.notes,
        ...action.payload,
      ].reverse().filter((uniqueNote, index, array) => {
        console.log(uniqueNote.id);
        return array.indexOf(array.find(note => note.id === uniqueNote.id)) === index;
      });
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