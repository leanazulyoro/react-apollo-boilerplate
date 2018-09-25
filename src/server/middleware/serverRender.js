import config from 'isomorphic-config';
import renderHtml from '../renderHtml';
import getClient from '../apollo/apolloClientForServer';
import { ApolloProvider, renderToStringWithData } from 'react-apollo';
import { StaticRouter } from 'react-router';
import Routes from '../../client/routes';
import { renderToStaticMarkup } from 'react-dom/server';
import React from 'react';

import { ServerStyleSheet, StyleSheetManager } from 'styled-components';

export default function serverRenderer({ clientStats, serverStats }) {
  return function(req, res, next) {
    if (config.server.server_render === true) {
      const context = {};
      const client = getClient();
      const sheet = new ServerStyleSheet();
      const component = sheet.collectStyles(
          <ApolloProvider client={client}>
            <StaticRouter
              location={req.url}
              context={context}
            >
              <Routes />
            </StaticRouter>
          </ApolloProvider>);
      const styles = sheet.getStyleElement();

      renderToStringWithData(component)
        .then(content => {
          const statusCode = 200;
          const html = renderHtml(content, client, styles);
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
    } else {
      const statusCode = 200;
      const html = renderHtml("");
      res.status(statusCode);
      res.send(html);
      res.end();
    }
  };
};
