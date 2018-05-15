import React from 'react';
import DatePicker from 'material-ui/DatePicker';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'


const optionsStyle = {
  textAlign: 'center',
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
      </div>
    );
  }
}