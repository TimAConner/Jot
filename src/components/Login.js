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
      display_name: '',
      register_confirm: '',
      register_password: '',
      register_email: '',
    };

    this.handleChange = this.handleChange.bind(this);
    this.login = this.login.bind(this);
    this.register = this.register.bind(this);
  }

  handleEmailChange(event) {
    this.setState({ email: event.target.value });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  login(event) {
    event.preventDefault();
    this.props.login(this.state.email, this.state.password);
  }

  register(event){
    event.preventDefault();
    this.props.register(this.state.register_email, this.state.register_password, this.state.register_confirm, this.state.display_name)
  }

  render() {
    return (
      <div>

        <form onSubmit={this.login} className='login'>

          {/* Show error if error from login */}
          {this.props.error !== null ? <Error
            error={typeof this.props.error.response !== "undefined"
              ? this.props.error.response.data
              : "Please try again later."}
          /> : null}


          {/* Redirect if logged in */}
          {this.props.user.user !== null ? (<Redirect to={{
            pathname: '/',
            state: { from: this.props.location }
          }} />) : null}

          <h1>Login</h1>
          Email: <input type="text" name="email" value={this.state.email} onChange={this.handleChange} required /><br />
          Password: <input type="password" name="password" value={this.state.password} onChange={this.handleChange} required /><br />
          <input type="submit" value="Login" />
        </form>

        <form onSubmit={this.register}>
          <h1>Register</h1>
          Name: <input type="display_name" name="display_name" value={this.state.display_name} onChange={this.handleChange} required /><br />
          Email: <input type="text" pattern="[^ @]*@[^ @]*" name="register_email" value={this.state.register_email} onChange={this.handleChange} required /><br />
          Password: <input type="password" name="register_password" value={this.state.register_password} onChange={this.handleChange} required /><br />
          Confirm: <input type="password" name="register_confirm" value={this.state.register_confirm} onChange={this.handleChange} required /><br />
          <input type="submit" value="Login" />
        </form>
      </div>
    );
  }
}

export default connect(mapUserStateToProps, mapUserDispatchToProps)(Login);