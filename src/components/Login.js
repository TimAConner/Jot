import React from 'react';
import { connect } from "react-redux";

import { Redirect } from 'react-router-dom';

import { mapUserStateToProps, mapUserDispatchToProps } from '../actions/userActions';

class Login extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      email: '',
      password: '',
    };

    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handlePasswordChange(event) {
    this.setState({ password: event.target.value });
  }

  render() {

    return (
      <div className='login'>

        {/* Redirect if logged in */}
        {this.props.user.user !== null ? (<Redirect to={{
          pathname: '/',
          state: { from: this.props.location }
        }} />) : null}

        <h1>Login</h1>
        Email: <input type="text" value={this.state.email} onChange={this.handleEmailChange} /><br />
        Password: <input type="password" value={this.state.password} onChange={this.handlePasswordChange} /><br />
        <input type="submit" value="Login" onClick={() => this.props.logUserIn(this.state.email, this.state.password)} />
      </div>
    );
  }
}

export default connect(mapUserStateToProps, mapUserDispatchToProps)(Login);