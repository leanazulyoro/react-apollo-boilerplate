import React from "react";
import { hydrate } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom"
import routes from "./routes";
import client from "./apollo/apolloClient";
import { ApolloProvider } from "react-apollo";

hydrate(
  <ApolloProvider client={client}>
    <Router>
      {routes}
    </Router>
  </ApolloProvider>,
  document.getElementById("root")
);
