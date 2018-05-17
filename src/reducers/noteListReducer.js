export default function reducer(state = {
  notes: [],
  saving: false,
  loading: false,
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
        loading: false,
      };
    }
    case 'view_notes_pending': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'view_notes_fulfilled': {
      return {
        ...state,
        notes: [...action.payload],
        sortBy: 'notes',
        loading: false,
      };
    }
    case 'view_notes_by_date_pending': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'view_notes_by_date_fulfilled': {
      return {
        ...state,
        notes: [...action.payload],
        sortBy: 'date',
        loading: false,
      };
    }
    case 'view_notes_by_date_failed': {
      return {
        ...state,
        loading: false,
      };
    }
    case 'view_notes_by_week_pending': {
      return {
        ...state,
        loading: true,
      };
    }
    case 'view_notes_by_week_fulfilled': {
      return {
        ...state,
        notes: [...action.payload],
        sortBy: 'week',
        loading: false,
      };
    }
    case 'view_notes_by_week_failed': {
      return {
        ...state,
        loading: false,
      };
    }
    default: {
      return state;
    }
  }
}