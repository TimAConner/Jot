// React
import React from 'react';

// Material UI
import RefreshIndicator from 'material-ui/RefreshIndicator';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';
import { muiTheme } from '../css/muiTheme';

// CSS
import { style, hiddenStyle } from '../jss/Loader';

class Loader extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      visible: this.props.visible,
    };
  }

  componentWillReceiveProps(props) {
    this.setState({
      visible: props.visible,
    });
  }

  render() {
    return (<MuiThemeProvider style={muiTheme}>
      <div style={this.state.visible ? style.container : hiddenStyle}>
        <CircularProgress color='#F3D250' size={40} thickness={3} />
      </div>
    </MuiThemeProvider>);
  }

}
export default Loader;