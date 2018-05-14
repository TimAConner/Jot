export default function reducer(state = {
  existingNoteLoaded: false,
  saving: false,
  focusOnNote: false,
  text: '',
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
        existingNoteLoaded: true,
        focusOnNote: true,
      };
    }
    case 'set_new_note' : {
      return {
        saving: false,
        existingNoteLoaded: false,
        focusOnNote: true,
        text: '',
        id: null,
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
        existingNoteLoaded: true,
      }
    }
    default: {
      return state;
    }
  }
}