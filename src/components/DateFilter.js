import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import Toggle from 'material-ui/Toggle';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


const optionsStyle = {
  maxWidth: 255,
  marginRight: 'auto',
};

/**
 * This example allows you to set a date range, and to toggle `autoOk`, and `disableYearSelection`.
 */
export default class DateFilter extends React.Component {
  constructor(props) {
    super(props);

    this.handleChangeMinDate = this.props.handleChangeMinDate;
    this.handleChangeMaxDate = this.props.handleChangeMaxDate;

    this.state = {
      autoOk: true,
      disableYearSelection: false,
    };
  }

  render() {
    return (
      <div>
        <MuiThemeProvider>
          <div style={optionsStyle}>
            <DatePicker
              onChange={this.handleChangeMinDate}
              autoOk={this.state.autoOk}
              floatingLabelText="Min Date"
              disableYearSelection={this.state.disableYearSelection}
            />
            <DatePicker
              onChange={this.handleChangeMaxDate}
              autoOk={this.state.autoOk}
              floatingLabelText="Max Date"
              disableYearSelection={this.state.disableYearSelection}
            />
          </div>
        </MuiThemeProvider>
      </div>
    );
  }
}