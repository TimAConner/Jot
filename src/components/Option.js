import React from 'react';
import { connect } from "react-redux";

import { mapOptionStateToProps, mapOptionDispatchToProps } from '../actions/optionActions';

import OptionDropdown from './OptionDropdown';

class Option extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      highlightOptions: ['bold', 'italic'],
      fontSizeOptions: [8, 12, 16],
      fontStyleOptions: ['sans-serif', 'serif', 'Times New Roman'],
    };
  }

  handleOptionChange = e => {
    const value = e.target.value;
    const option = e.target.name;
    this.props.updateOption({ value, option });
  };

  render() {
    return (
      <div>
        <h1>Options</h1>
        <h2>{this.props.user !== null ? this.props.user.display_name : null}</h2>


        <h4>Font Style</h4>
        {this.props.user !== null
          ? <OptionDropdown
            options={this.state.fontStyleOptions}
            changeHandler={this.handleOptionChange}
            styleName='font_style'
            currentStyle={this.props.user.Option.font_style}
          />
          : null}

        <h4>Font Size</h4>
        {this.props.user !== null
          ? <OptionDropdown
            options={this.state.fontSizeOptions}
            changeHandler={this.handleOptionChange}
            styleName='font_size'
            currentStyle={this.props.user.Option.font_size}
          />
          : null}

        <h4>Auto Select Style</h4>
        {this.props.user !== null
          ? <OptionDropdown
            options={this.state.highlightOptions}
            changeHandler={this.handleOptionChange}
            styleName='auto_keyword_style'
            currentStyle={this.props.user.Option.auto_keyword_style}
          />
          : null}

        <h4>User Select Style</h4>
        {this.props.user !== null
          ? <OptionDropdown
            options={this.state.highlightOptions}
            changeHandler={this.handleOptionChange}
            styleName='user_keyword_style'
            currentStyle={this.props.user.Option.user_keyword_style}
          />
          : null}

        {/* {this.props.user !== null
          ? <select name='user_keyword_style' onChange={e => this.handleOptionChange(e)}>
            {this.state.highlightOptions.map(option => {
              let userStyle = this.props.user.Option.user_keyword_style;

              if (option === userStyle) {
                return (
                  <option selected value={option}>{option}</option>
                );
              }

              return (
                <option value={option}>{option}</option>
              );
            })}
          </select>
          : null} */}

      </div>
    );
  }
};

export default connect(mapOptionStateToProps, mapOptionDispatchToProps)(Option); 