// React & Redux
import React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

// Redux Store
import { mapUserStateToProps, mapUserDispatchToProps } from '../actions/userActions';

// Custom Components
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import Option from './Option';
import Loader from './Loader';

// Material UI Componenets
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


class Jot extends React.Component {

  constructor(props) {
    super(props);
    this.props.authenticate();
    this.state = {
      noteListWindowOpen: false,
      optionWindowOpen: false,
    };
  }

  logout() {
    localStorage.removeItem('jotToken');
    this.props.authenticate();
  }

  handleNoteListToggle = () => this.setState({ noteListWindowOpen: !this.state.noteListWindowOpen });

  handleNoteListClose = () => this.setState({ noteListWindowOpen: false });

  handleOptionToggle = () => this.setState({ optionWindowOpen: !this.state.optionWindowOpen });

  handleOptionClose = () => this.setState({ optionWindowOpen: false });


  render() {
    return (
      <div className='Jot'>

        <NoteEditor />

        <MuiThemeProvider>
          <div>
            {/* Note List */}
            <RaisedButton
              label="Open Notes"
              onClick={this.handleNoteListToggle}
            />
            <Drawer
              docked={false}
              width={'90%'}
              open={this.state.noteListWindowOpen}
              onRequestChange={(noteListWindowOpen) => this.setState({ noteListWindowOpen })}
            >
              <RaisedButton
                label="Open Options"
                onClick={this.handleOptionToggle}
              />
              <NoteList closeList={this.handleNoteListClose} />
            </Drawer>

            {/* Options */}
            <Drawer
              docked={false}
              width={'85%'}
              open={this.state.optionWindowOpen}
              onRequestChange={(optionWindowOpen) => this.setState({ optionWindowOpen })}
            >
              <Option />
            </Drawer>
          </div>


        </MuiThemeProvider>


        {/* Show loading screen while loading */}
        {this.props.user.isLoading ? <Loader /> : null}

        {/* Reroute to login if not logged in */}
        {!this.props.user.isLoading && this.props.user.user === null ? (<Redirect to={{
          pathname: '/login',
          state: { from: this.props.location }
        }} />) : null}


        <button onClick={() => this.logout()}>Logout</button>
      </div>
    );
  }
};

export default connect(mapUserStateToProps, mapUserDispatchToProps)(Jot);