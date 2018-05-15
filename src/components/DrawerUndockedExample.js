import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


export default class DrawerUndockedExample extends React.Component {

  constructor(props) {
    super(props);
    this.state = { open: false };
  }

  handleToggle = () => this.setState({ open: !this.state.open });

  handleClose = () => this.setState({ open: false });

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <RaisedButton
            label="Open Drawer"
            onClick={this.handleToggle}
          />
          <Drawer
            docked={true}
            width={'90%'}
            open={this.state.open}
            onRequestChange={(open) => this.setState({ open })}
          >
            <MenuItem onClick={this.handleClose}>Menu Item</MenuItem>
            <MenuItem onClick={this.handleClose}>Menu Item 2</MenuItem>
          </Drawer>
        </MuiThemeProvider>
      </div>
    );
  }
}