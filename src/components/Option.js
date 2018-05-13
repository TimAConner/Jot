import React from 'react';
import { connect } from "react-redux";

import { mapOptionStateToProps, mapOptionDispatchToProps } from '../actions/optionActions';

class Option extends React.Component {

};


export default connect(mapOptionStateToProps, mapOptionDispatchToProps)(Option);