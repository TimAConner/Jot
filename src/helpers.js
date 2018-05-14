import axios from 'axios';

export const backendUrl = "http://localhost:8080";

export const putPostHeaders = {
  headers: {
    'Content-Type': 'application/json',
    'dataType': 'JSON',
    'contentType': 'application/json; charset=utf-8'
  },
  credentials: "include",
};

export const reloadNotes = ({ sortBy, response, dispatch }) => {
  switch (sortBy) {
    case 'notes': {
      axios.get('http://localhost:8080/notes/')
        .then(response => {
          dispatch({ type: 'view_notes_fulfilled', payload: response.data });
        })
        .catch((response) => {
          dispatch({ type: 'view_notes_failed', payload: response });
        });

      break;
    }
    case 'date': {
      dispatch({ type: 'view_notes_by_date_pending' });
      axios.get('http://localhost:8080/notes/?dateView=true')
        .then(response => {
          dispatch({ type: 'view_notes_by_date_fulfilled', payload: response.data });
        })
        .catch((response) => {
          dispatch({ type: 'view_notes_by_date_failed', payload: response });
        })

      break;
    }
    case 'week': {
      dispatch({ type: 'view_notes_by_week_pending' });
      axios.get('http://localhost:8080/notes/?weekView=true')
        .then(response => {
          dispatch({ type: 'view_notes_by_week_fulfilled', payload: response.data });
        })
        .catch((response) => {
          dispatch({ type: 'view_notes_by_week_failed', payload: response });
        })

      break;
    }
    default: {
      axios.get('http://localhost:8080/notes/')
        .then(response => {
          dispatch({ type: 'view_notes_fulfilled', payload: response.data });
        })
        .catch((response) => {
          dispatch({ type: 'view_notes_failed', payload: response });
        });

      break;
    }
  }
};