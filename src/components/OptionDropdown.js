import React from 'react';
import { connect } from "react-redux";

import { mapOptionStateToProps, mapOptionDispatchToProps } from '../actions/optionActions';

const OptionDropdown = ({ options, changeHandler, currentStyle, styleName }) => (
  <div>
    <select name={styleName} onChange={e => changeHandler(e)}>
      {options.map(({value, text}) => {
        if (currentStyle === value) {
          return (
            <option selected value={value}>{text}</option>
          );
        }

        return (
          <option value={value}>{text}</option>
        );
      })}
    </select>
  </div>
);


export default connect(mapOptionStateToProps, mapOptionDispatchToProps)(OptionDropdown); 