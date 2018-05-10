export default function reducer(state = {
  noteLoaded: false,
  saving: false,
}, action) {
  switch (action.type) {
    case 'set_editor_note': {
      return {
        ...state,
        ...action.payload,
        noteLoaded: true,
      }
    }
    case 'save_note_pending': {
      return {
        ...state,
        saving: true,
      };
    }
    case 'save_note_failed': {
      return {
        ...state,
        saving: false,
      };
    }
    case 'save_note_fulfilled': {
      return {
        ...state,
        ...action.payload,
        saving: false,
      }
    }
    default: {
      return state;
    }
  }
}