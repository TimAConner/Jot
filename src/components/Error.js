// React
import React from 'react';

// Material UI
import Snackbar from 'material-ui/Snackbar';

const snackbarStyling = {
  height: '',
  lineHeight: 'inherit',
  paddingBottom: '1em',
  paddingTop: '1em',
};

class Error extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      error: this.props.error,
      open: true,
    };
  }

  componentWillReceiveProps(props){
    this.state = {
      error: this.props.error,
      open: true,
    };
  }
  
  render() {
    return (
      <Snackbar
        bodyStyle={snackbarStyling}
        open={true}
        message={this.state.error.toString()}
        onRequestClose={() => {}}
      />
    );
  }
}

export default Error;