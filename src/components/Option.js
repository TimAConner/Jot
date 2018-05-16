// React & Redux
import React from 'react';
import { connect } from "react-redux";

// Redux Map To Props
import { mapOptionStateToProps, mapOptionDispatchToProps } from '../actions/optionActions';

// Custom Components
import OptionDropdown from './OptionDropdown';

const headerStyling = {
  textAlign: 'center',
};

const optionDropdownDivStyling = {
  display: 'grid',
  justifyContent: 'center',
};

class Option extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      highlightOptions: [
        { value: 'bold', text: 'Bold' },
        { value: 'italic', text: 'Italic' },
        { value: 'underlined', text: 'Underlined' },
        { value: 'uppercase', text: 'Uppercase' },
      ],
      fontSizeOptions: [
        { value: 'small', text: 'Small' },
        { value: 'medium', text: 'Medium' },
        { value: 'large', text: 'Large' },
        { value: 'x-large', text: 'Extra Large' },
      ],
      fontStyleOptions: [
        { value: 'sans-serif', text: 'Sans Serif' },
        { value: 'serif', text: 'Serif' },
        { value: 'times-new-roman', text: 'Times New Roman' },
        { value: 'georgia', text: 'Georgia' },
        { value: 'verdana', text: 'Verdana' },
        { value: 'arial', text: 'Arial' },
        { value: 'monospace', text: 'Monospace' },
      ],
    };
  }

  handleOptionChange = (value, key) => {
    this.props.updateOption({ value, key });
  };

  render() {
    return (
      <div style={{ backgroundColor: '#FDFDFD', }} className='window'>
        <h1 style={headerStyling}>Options</h1>
        <h2 style={headerStyling}>{this.props.user !== null ? this.props.user.display_name : null}</h2>

        <div style={optionDropdownDivStyling}>

          {/* <h4>Font Style</h4> */}
          {this.props.user !== null
            ? <OptionDropdown
              options={this.state.fontStyleOptions}
              changeHandler={this.handleOptionChange}
              styleName='font_style'
              floatingLabelText='Font'
              currentStyle={this.props.user.Option.font_style}
            />
            : null}

          {/* <h4>Font Size</h4> */}
          {this.props.user !== null
            ? <OptionDropdown
              options={this.state.fontSizeOptions}
              changeHandler={this.handleOptionChange}
              styleName='font_size'
              floatingLabelText='Font Size'
              currentStyle={this.props.user.Option.font_size}
            />
            : null}

          {/* <h4>Auto Select Style</h4> */}
          {this.props.user !== null
            ? <OptionDropdown
              options={this.state.highlightOptions}
              changeHandler={this.handleOptionChange}
              styleName='auto_keyword_style'
              floatingLabelText='Auto Keyword Style'
              currentStyle={this.props.user.Option.auto_keyword_style}
            />
            : null}

          {/* <h4>User Select Style</h4> */}
          {this.props.user !== null
            ? <OptionDropdown
              options={this.state.highlightOptions}
              changeHandler={this.handleOptionChange}
              styleName='user_keyword_style'
              floatingLabelText='User Keyword Style'
              currentStyle={this.props.user.Option.user_keyword_style}
            />
            : null}
        </div>
      </div>
    );
  }
};

export default connect(mapOptionStateToProps, mapOptionDispatchToProps)(Option); 