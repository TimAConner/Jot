// React
import React from 'react';

// Material UI
import Snackbar from 'material-ui/Snackbar';

// CSS
import { snackbarStyling } from '../jss/Error';

class Error extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: this.props.error,
      open: true,
    };
  }

  componentWillReceiveProps(props) {
    this.state = {
      error: props.error,
      open: true,
    };
  }

  render() {
    return (
      <Snackbar
        bodyStyle={snackbarStyling}
        open={true}
        message={this.state.error.toString()}
        onRequestClose={() => { }}
      />
    );
  }
}

export default Error;