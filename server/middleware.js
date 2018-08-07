import React from "react";
import {StaticRouter} from "react-router";
import renderHtml from "./renderHtml";
import routes from "../client/routes";
import {ApolloProvider, renderToStringWithData} from "react-apollo";
import {renderToStaticMarkup} from "react-dom/server";
import config from "isomorphic-config";
import getClient from "./apollo/apolloClientForServer";


function middleware(req, res) {
  if (config.server.server_render === true)
    serverRender(req, res);
  else {
    const statusCode = 200;
    const html = renderHtml("");
    res.status(statusCode);
    res.send(html);
    res.end();
  }
}


function serverRender(req, res) {
  const context = {};

  const client = getClient();

  const component = (
    <ApolloProvider client={client}>
      <StaticRouter
        location={req.url}
        context={context}
      >
        {routes}
      </StaticRouter>
    </ApolloProvider>
  );


  renderToStringWithData(component)
    .then(content => {
      const statusCode = 200;
      const html = renderHtml(content, client);
      res.status(statusCode);
      res.send(html);
      res.end();
    })
    .catch(e => {
      console.error('SERVER RENDERING ERROR:', e);
      const statusCode = 500;
      const html = renderToStaticMarkup(<div>Server Error</div>);
      res.status(statusCode);
      res.send(html);
      res.end();
    });
}
module.exports = middleware;
