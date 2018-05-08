import React from 'react';

const Login = () => (
  <div className='login'>
    <h1>Login</h1>
    Email: <input type="text" name="email" /><br />
    Password: <input type="password" name="password" /><br />
    <input type="submit" value="Submit" />
  </div>
)

export default Login;