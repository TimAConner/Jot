export default function reducer(state = {
  notes: [],
  saving: false,
  sortBy: 'notes',
}, action) {
  switch (action.type) {
    case 'delete_note_pending': {
      return {
        ...state,
        saving: true,
      };
    }
    case 'delete_note_fulfilled': {
      const notes = [...state.notes].filter(note => note.id !== action.payload);

      return {
        ...state,
        notes: [...notes],
        saving: false,
      };
    }
    case 'delete_note_failed': {
      return {
        ...state,
        saving: false,
      };
    }
    case 'view_notes_failed': {
      return {
        ...state,
      };
    }
    case 'view_notes_pending': {
      return {
        ...state,
      };
    }
    case 'view_notes_fulfilled': {

      // Merge new notes with olds versions of the note.
      // Reverse it to get the most recent notes first and merge them.
      // Reverse the output (with the most recent notes last in the array) 
      // to have the most recent notes going forward.
      const mergedNotes = [
        ...state.notes,
        ...action.payload,
      ].reverse().filter((uniqueNote, index, array) => {
        return array.indexOf(array.find(note => note.id === uniqueNote.id)) === index;
      }).reverse();

      return {
        ...state,
        notes: [...mergedNotes],
        sortBy: 'notes',
      };
    }
    case 'view_notes_by_date_pending': {
      return {
        ...state,
      };
    }
    case 'view_notes_by_date_fulfilled': {
      return {
        ...state,
        notes: [...action.payload],
        sortBy: 'dates',
      };
    }
    case 'view_notes_by_date_failed': {
      return {
        ...state,
      };
    }
    default: {
      return state;
    }
  }
}