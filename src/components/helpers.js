import axios from 'axios';

export function isLoggedIn() {
  axios.get('http://localhost:8080/login')
};