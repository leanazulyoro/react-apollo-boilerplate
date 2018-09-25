import React, {Fragment, PureComponent} from 'react';
import Helmet from 'react-helmet';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const Title = styled.h1`
  font-size: 4em;
  text-align: center;
  color: green;
`;


class HelloWorld extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      LoadableComponent: null
    }
  }

  componentDidMount(){
    import('../LoadableComponent/LoadableComponent')
      .then(module => this.setState({ LoadableComponent: module.default }))
  }

  render() {

    const {LoadableComponent} = this.state;

    if(!!LoadableComponent) {
      return (
        <Fragment>
          <Helmet>
            <title>Hola mundo</title>
          </Helmet>
          <LoadableComponent />
          <Title id="greeting">{this.props.greeting || 'Hello world!!!!!!!!!'}</Title>
        </Fragment>
      );
    } else {

      return (
        <Fragment>
          <Helmet>
            <title>Hola mundo</title>
          </Helmet>
          <Title id="greeting">{this.props.greeting || 'Hello world!!!!!!!!!'}</Title>
        </Fragment>
      );
    }
  }
};

HelloWorld.propTypes = {
  greeting: PropTypes.string
};

export default HelloWorld;
