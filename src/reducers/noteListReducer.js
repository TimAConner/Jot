export default function reducer(state = {
  notes: [
    {
      "id": 1,
      "text": "This is an example note.",
      "user_id": 1,
      "Keywords": [
        {
          "keyword": "note",
          "user_selected": true
        },
        {
          "keyword": "example",
          "user_selected": true
        }
      ],
      "Note_Dates": [
        {
          "edit_date": "2018-04-30T21:27:14.209Z",
          "note_id": 1
        }
      ]
    },
    {
      "id": 2,
      "text": "This is an alternate example note",
      "user_id": 1,
      "Keywords": [
        {
          "keyword": "note",
          "user_selected": true
        },
        {
          "keyword": "example",
          "user_selected": true
        },
        {
          "keyword": "alternate",
          "user_selected": true
        }
      ],
      "Note_Dates": [
        {
          "edit_date": "2018-05-07T18:56:05.874Z",
          "note_id": 2
        }
      ]
    }
  ],
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