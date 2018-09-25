import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"
import client from "./apollo/apolloClient";
import { ApolloProvider } from "react-apollo";
import Routes from './routes';

// @todo: esto fue necesario para que vuelva a funcionar el hot reload, ver alternativas sobre donde poner esto
if (module.hot) {
  module.hot.accept();
}

hydrate(
  <ApolloProvider client={client}>
    <Router>
      <Routes />
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
