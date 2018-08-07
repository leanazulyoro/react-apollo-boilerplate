import React from 'react';
import { Route, Switch } from 'react-router-dom';
import HelloWorldContainer from './containers/HelloWorld/HelloWorldContainer';

export default (
  <Switch>
    <Route exact path="/" render={
      (props) => (
        <HelloWorldContainer />
      )
    } />
  </Switch>
);
