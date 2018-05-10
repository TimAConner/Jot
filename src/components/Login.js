import React from 'react';
import { connect } from "react-redux";

import { Redirect } from 'react-router-dom';

import { mapUserStateToProps, mapUserDispatchToProps } from '../actions/userActions';

import Error from './Error';


class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  submit(event) {
    event.preventDefault();
    this.props.logUserIn(this.state.email, this.state.password);
  }

  render() {

    return (
      <form onSubmit={this.submit} className='login'>

        {/* Show error if error from login */}
        {this.props.error !== null ? <Error error={this.props.error.response.data} /> : null}


        {/* Redirect if logged in */}
        {this.props.user.user !== null ? (<Redirect to={{
          pathname: '/',
          state: { from: this.props.location }
        }} />) : null}

        <h1>Login</h1>
        Email: <input type="text" value={this.state.email} onChange={this.handleEmailChange} required /><br />
        Password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange} required /><br />
        <input type="submit" value="Login" />
      </form>
    );
  }
}

export default connect(mapUserStateToProps, mapUserDispatchToProps)(Login);