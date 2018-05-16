// React & Redux
import React from 'react';
import { connect } from "react-redux";

// Reduc Store
import { mapOptionStateToProps, mapOptionDispatchToProps } from '../actions/optionActions';

// Material UI
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

const OptionDropdown = ({ options, changeHandler, currentStyle, styleName, floatingLabelText }) => (
  <div>
    <SelectField
      name={styleName}
      floatingLabelText={floatingLabelText}
      value={currentStyle}
      onChange={(event, index, value) => changeHandler(value, styleName)}
    >
      {options.map(({ value, text }) => {
        if (currentStyle === value) {
          return (
            <MenuItem value={value} primaryText={text} />
          );
        }

        return (
          <MenuItem value={value} primaryText={text} />
        );
      })}
    </SelectField>
    {/* <select name={styleName} onChange={e => changeHandler(e)}>
      {options.map(({ value, text }) => {
        if (currentStyle === value) {
          return (
            <option selected value={value}>{text}</option>
          );
        }

        return (
          <option value={value}>{text}</option>
        );
      })}
    </select> */}
  </div>
);


export default connect(mapOptionStateToProps, mapOptionDispatchToProps)(OptionDropdown); 