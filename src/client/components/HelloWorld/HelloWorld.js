import React from 'react';
import PropTypes from 'prop-types';
import './HelloWorld.scss';

const HelloWorld = (props) => (
  <div id="greeting">{props.greeting || 'Hello world'}</div>
);

HelloWorld.propTypes = {
  greeting: PropTypes.string
};

export default HelloWorld;
