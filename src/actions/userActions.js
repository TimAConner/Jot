import axios from 'axios';
import { backendUrl } from '../helpers';

export function mapUserStateToProps(state) {
  return {
    user: state.user,
    error: state.user.error,
  }
}

export function mapUserDispatchToProps(dispatch) {
  // const header = new Headers({ 'Content-Type': 'application/json' });

  // axios.defaults.withCredentials = true; 

  return {
    logUserIn: (email, password) => {
      // Remove token if present
      localStorage.removeItem('jotToken');

      dispatch({ type: 'login_user_pending' });
      axios.post(`${backendUrl}/login`, JSON.stringify({
        "email": email,
        "password": password
      }), {
          headers: {
            'Content-Type': 'application/json',
            'dataType': 'JSON',
            'contentType': 'application/json; charset=utf-8'
          },
          credentials: "include",
        })
        .then(response => {
          if (typeof response.data.token === "undefined" || typeof response.data.user.id === "undefined") {
            dispatch({ type: 'login_user_failed', payload: response });
          } else {
            localStorage.setItem('jotToken', response.data.token);
            dispatch({ type: 'login_user_fulfilled', payload: response.data.user });
          }
        })
        .catch(response => {
          dispatch({ type: 'login_user_failed', payload: response });
        });
    },
    authenticate: () => {
      // Check if local storage has a token
      if (localStorage.getItem('jotToken')) {
        axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jotToken')}`;
        console.log(axios.defaults.headers.common.Authorization);
      } else {
        dispatch({ type: 'getting_user_failed' });
      }

      dispatch({ type: 'getting_user_pending' });
      axios.get(`${backendUrl}/currentUser`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('jotToken')}`,
        }
      })
        .then(response => {
          dispatch({ type: 'getting_user_fulfilled', payload: response.data });
        })
        .catch(response => {
          // if (response.status !== 401) {
          console.log('ERRRO', response);
          // }
          dispatch({ type: 'getting_user_failed', payload: response.data });
        })
    },
  }
};