// React & Redux
import React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

// Redux Map To Props
import { mapUserStateToProps, mapUserDispatchToProps } from '../actions/userActions';

// Custom Components
import Error from './Error';

// Material UI
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import Divider from 'material-ui/Divider';

// Custom Css
import { muiTheme } from '../css/muiTheme';

const centerStyle = {
  textAlign: 'center',
};

const formStyle = {
  marginBottom: '2em',
};

const dividerStyle = {
  marginLeft: '1rem',
  marginRight: '1rem',
};


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

  register(event) {
    event.preventDefault();
    this.props.register(this.state.register_email, this.state.register_password, this.state.register_confirm, this.state.display_name)
  }

  render() {
    return (

      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={centerStyle}>
          <h1 style={centerStyle}>Jot</h1>
          <form style={formStyle} onSubmit={this.login}>

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

            <h2>Login</h2>

            <TextField
              hintText="Email"
              floatingLabelText="Email"
              type="text" name="email" value={this.state.email} onChange={this.handleChange} required
            /><br />
            <TextField
              hintText="Password"
              floatingLabelText="Password"
              type="password" name="password" value={this.state.password} onChange={this.handleChange} required
            /><br />
            <RaisedButton label="Login" type='submit' primary={true} />
          </form>

          <Divider style={dividerStyle}/>

          <form style={formStyle} onSubmit={this.register}>
            <h2>Register</h2>
            <TextField
              hintText="Name"
              floatingLabelText="Name"
              type="display_name" name="display_name" value={this.state.display_name} onChange={this.handleChange} required
            /><br />
            <TextField
              hintText="Email"
              floatingLabelText="Email"
              type="text" pattern="[^ @]*@[^ @]*" name="register_email" value={this.state.register_email} onChange={this.handleChange} required
            /><br />

            <TextField
              hintText="Password"
              floatingLabelText="Password"
              type="password" name="register_password" value={this.state.register_password} onChange={this.handleChange} required
            /><br />

            <TextField
              hintText="Confirm Password"
              floatingLabelText="Confirm Password"
              type="password" name="register_confirm" value={this.state.register_confirm} onChange={this.handleChange} required
            /><br />

            <RaisedButton label="Register" type='submit' primary={true} />
          </form>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default connect(mapUserStateToProps, mapUserDispatchToProps)(Login);