import axios from 'axios';
import { backendUrl } from '../helpers';

export function mapUserStateToProps(state) {
  return {
    user: state.user,
  }
}

export function mapUserDispatchToProps(dispatch) {
  // const header = new Headers({ 'Content-Type': 'application/json' });

  // axios.defaults.withCredentials = true; 

  return {
    logUserIn: (email, password) => {
      console.log("email", email, password);
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
        // fetch(`${backendUrl}/login`, {
        //   method: "POST",
        //   body: JSON.stringify({
        //     "email": email,
        //     "password": password
        //   }),
        //   withCredentials: true,
        //   headers: {
        //     'Content-Type': 'application/json',
        //     'dataType': 'JSON',
        //     'contentType': 'application/json; charset=utf-8'
        //   },
        //   credentials: "same-origin"
        // })
        // axios({s
        //   method: 'POST',
        //   url: `${backendUrl}/login`,
        //   withCredentials: true,
        //   data: JSON.stringify({
        //     "email": email,
        //     "password": password
        //   }),
        //   json: true,
        // })
        .then(response => {
          if(typeof response.data.token !== "undefined"){
            localStorage.setItem('jotToken', response.data.token);
            console.log('set token', localStorage.getItem('jotToken'))

            if(localStorage.getItem('jotToken')){
              axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jotToken')}`;
              console.log(axios.defaults.headers.common.Authorization);
            }
          }
          console.log('response', response);
          dispatch({ type: 'login_user_fulfilled', payload: response.data.user });
        })
        .catch(response => {
          console.log('response', response);
          dispatch({ type: 'login_user_failed', payload: response });
        });
    },
    isLoggedIn: () => {

      if(localStorage.getItem('jotToken')){
        axios.defaults.headers.common.Authorization = `Bearer ${localStorage.getItem('jotToken')}`;
        console.log(axios.defaults.headers.common.Authorization);
      } else {
        dispatch({ type: 'getting_user_failed' });
      }

      // console.log(email, password);

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
          dispatch({ type: 'getting_user_failed', payload: response });
        })
    },
  }
};