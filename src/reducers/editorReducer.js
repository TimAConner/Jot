export default function reducer(state = {
  noteLoaded: false,
  saving: false,
  focusOnNote: false,
}, action) {
  switch (action.type) {
    case 'set_focus_to_false': {
      return {
        ...state,
        focusOnNote: false,
      }
    }
    case 'set_editor_note': {
      return {
        ...state,
        ...action.payload,
        noteLoaded: true,
        focusOnNote: true,
      };
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
        Keywords: [...action.payload.Keywords],
        id: action.payload.id,
        Note_Dates: [...action.payload.Note_Dates],
        saving: false,
        noteLoaded: true,
      }
    }
    default: {
      return state;
    }
  }
}