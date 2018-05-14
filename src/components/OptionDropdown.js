import React from 'react';
import { connect } from "react-redux";

import { mapOptionStateToProps, mapOptionDispatchToProps } from '../actions/optionActions';

const OptionDropdown = ({ options, changeHandler, currentStyle, styleName }) => (
  <div>
    <select name={styleName} onChange={e => changeHandler(e)}>
      {options.map(option => {
        if (option === currentStyle) {
          return (
            <option selected value={option}>{option}</option>
          );
        }

        return (
          <option value={option}>{option}</option>
        );
      })}
    </select>
  </div>
);


export default connect(mapOptionStateToProps, mapOptionDispatchToProps)(OptionDropdown); 