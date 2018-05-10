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
      return {
        ...state,
        notes: [
          ...action.payload,
        ],
      }
    }
    default: {
      return state;
    }
  }
}