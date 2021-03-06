import axios from 'axios';
import { backendUrl, putPostHeaders } from '../helpers';

export function mapUserStateToProps(state) {
  return {
    user: state.user,
    error: state.user.error,
    options: {
      fontSize: 8,
      fontStyle: 'sans-serif',
      autoKeywordStyle: 'italic',
      userKeywordStyle: 'bold',
    }
  }
}

export function mapUserDispatchToProps(dispatch) {
  // const header = new Headers({ 'Content-Type': 'application/json' });

  // axios.defaults.withCredentials = true; 

  return {
    login: (email, password) => {
      // Remove token if present
      localStorage.removeItem('jotToken');

      dispatch({ type: 'login_user_pending' });
      axios.post(`${backendUrl}/login`, JSON.stringify({
        email,
        password,
      }), putPostHeaders)
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
    register: (email, password, confirm, displayName) => {
      axios.post(`${backendUrl}/register`, JSON.stringify({
        email,
        password,
        confirm,
        "display_name": displayName,
      }), putPostHeaders)
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

      if (!localStorage.getItem('jotToken')) {
        return dispatch({ type: 'getting_user_failed' });
      }

      // Set axios authorization to the current token
      axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jotToken')}`;

      dispatch({ type: 'getting_user_pending' });
      axios.get(`${backendUrl}/currentUser`)
        .then(response => {
          dispatch({ type: 'getting_user_fulfilled', payload: response.data });
        })
        .catch(response => {
          console.log(response);
          dispatch({ type: 'getting_user_failed', payload: response });
        });
    },
  }
};