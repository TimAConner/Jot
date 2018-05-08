import axios from 'axios';

export function isLoggedIn() {
  axios.get('http://localhost:8080/currentUser')
  .then(user => {
    if(typeof user.id === 'undefined'){
      return false
    }
    
    return user;
  })
  .catch(err => {

    // 401 is the default error for the user
    // not being logged in on the server
    if(err.status !== 401){
      console.log(err);
    }
    return false;
  })
};