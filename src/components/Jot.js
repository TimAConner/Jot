// React & Redux
import React from 'react';
import { connect } from "react-redux";
import { Redirect } from 'react-router-dom';

// Redux Map To Props
import { mapUserStateToProps, mapUserDispatchToProps } from '../actions/userActions';

// Custom Components
import NoteList from './NoteList';
import NoteEditor from './NoteEditor';
import Option from './Option';
import Loader from './Loader';

// Global Css
import '../css/Jot.css';
import { muiTheme } from '../css/muiTheme';
import { menuButtonStyle, logoutButtonStyle, logoutButtonLabelStyle } from '../jss/Jot';

// Material UI Componenets
import Drawer from 'material-ui/Drawer';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ListIcon from 'material-ui/svg-icons/action/list';
import SettingsIcon from 'material-ui/svg-icons/action/settings';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import RaisedButton from 'material-ui/RaisedButton';

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
    window.location.reload();
  }

  handleNoteListToggle = () => this.setState({ noteListWindowOpen: !this.state.noteListWindowOpen });

  handleNoteListClose = () => this.setState({ noteListWindowOpen: false });

  handleOptionToggle = () => this.setState({ optionWindowOpen: !this.state.optionWindowOpen });

  handleOptionClose = () => this.setState({ optionWindowOpen: false });


  render() {
    return (
      <div>
        <div className='jot'>
          <MuiThemeProvider muiTheme={muiTheme}>

            <NoteEditor />

            <div>
              {/* Open Note List */}
              <FloatingActionButton
                zDepth={1}
                backgroundColor={'#90CCF4'}
                mini={true}
                onClick={() => this.handleNoteListToggle()}
                style={menuButtonStyle}
              >
                <ListIcon />
              </FloatingActionButton>

              {/* Note List */}
              <Drawer
                docked={false}
                width={'85%'}
                open={this.state.noteListWindowOpen}
                onRequestChange={(noteListWindowOpen) => this.setState({ noteListWindowOpen })}
              >
                {/* Open Options */}
                <FloatingActionButton
                  zDepth={1}
                  backgroundColor={'#90CCF4'}
                  mini={true}
                  onClick={() => this.handleOptionToggle()}
                  style={menuButtonStyle}
                >
                  <SettingsIcon />
                </FloatingActionButton>

                <NoteList closeList={this.handleNoteListClose} />
              </Drawer>

              {/* Options */}
              <Drawer
                docked={false}
                width={'80%'}
                open={this.state.optionWindowOpen}
                onRequestChange={(optionWindowOpen) => this.setState({ optionWindowOpen })}
              >
                <Option />

                <div style={logoutButtonStyle}>
                  <RaisedButton
                    labelStyle={logoutButtonLabelStyle}
                    color='secondary'
                    onClick={() => this.logout()}
                    label='Logout'
                    secondary={true} />
                </div>
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
        </div>
        <div className='desktopError'>
          <h2>Please view Jot on mobile.</h2>
        </div>
      </div>
    );
  }
};

export default connect(mapUserStateToProps, mapUserDispatchToProps)(Jot);