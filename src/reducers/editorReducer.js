export default function reducer(state = {
  "id": 1,
  "text": "This is an example note.  A word, a phrase. A phrase, a phrase.",
  "user_id": 1,
  "Keywords": [
    {
      "keyword": "example",
      "user_selected": true
    },
    {
      "keyword": "note",
      "user_selected": true
    }
  ],
  "Note_Dates": [
    {
      "edit_date": "2018-04-30T21:27:14.209Z",
      "note_id": 1
    }
  ]
}, action) {
  switch (action.type) {
    case 'set_editor_text': {
      return {
        ...state,
        ...action.payload,
      }
    }
    default: {
      return state;
    }
  }
}