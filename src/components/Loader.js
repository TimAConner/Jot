// React
import React from 'react';

// Material UI
import RefreshIndicator from 'material-ui/RefreshIndicator';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import CircularProgress from 'material-ui/CircularProgress';


import { muiTheme } from '../css/muiTheme';

const style = {
  container: {
    position: 'fixed',
    top: '0.3rem',
    right: '1rem',
  },
  refresh: {
    display: 'inline-block',
    position: 'relative',
  },
};

const hiddenStyle = {
  display: 'none',
};

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
        {/* <RefreshIndicator
          size={40}
          left={10}
          top={0}
          status='loading'
          style={style.refresh}
          loadingColor='#F3D250'
        /> */}
        <CircularProgress color='#F3D250' size={40} thickness={2} />
      </div>
    </MuiThemeProvider>);
  }

}
export default Loader;