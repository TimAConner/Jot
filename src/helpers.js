import axios from 'axios';

export const backendUrl = "http://localhost:8080";

// Returns postgres date in mm/dd/yyyy hh:mm AM / PM
export const formatDate = postgresDate => {
  const date = new Date(postgresDate.replace(' ', 'T'));
  return `${date.toLocaleString([], {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour12: true,
    hourCycle: true,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })}`;
};

// Returns postgres date `mm/dd/yy- one week from that date`
export const getMinMaxWeek = postgresDate => {
  const minDate = new Date(postgresDate.replace(' ', 'T'));
  const maxDate = new Date(minDate);

  // Add one week
  maxDate.setDate(minDate.getDate() + 7);

  const dateOptions =  {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
    hour12: true,
    hourCycle: true,
    year: 'numeric',
    month: 'numeric',
    day: 'numeric',
  };

  return `${minDate.toLocaleString([], dateOptions)} - ${maxDate.toLocaleString([], dateOptions)}`;
};

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