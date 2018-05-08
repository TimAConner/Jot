export default function reducer(state = {
  notes: [{
    noteId: 0,
    keywords: "A man, a fan, lambs",
    date: "11/12/19",
    text: "This note is about a man, a fan, and several lambs.",
  }],
}, action) {

  switch (action.type) {
    case 'view_notes_pending': {
      return {
        ...state,
      };
    }
    case 'view_notes_failed': {
      console.log("ERR", action.payload);
      return {
        ...state,
      };
    }
    case 'view_notes_fulfilled': {
      return {
        ...state,
        notes: [
          ...state.notes,
          ...action.payload,
        ],
      }
    }
    default: {
      return state;
    }
  }
  // https://redux.js.org/faq/react-redux#react-not-rerendering

}