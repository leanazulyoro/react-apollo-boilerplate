require('babel-register')({ plugins: ['dynamic-import-node'] }); // @see: https://github.com/webpack/webpack/issues/5703#issuecomment-363267093
const webpack = require("webpack");
const yn = require('yn');
const config = require('isomorphic-config');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const path = require('path');

if (yn(config.client.newrelic.enable)) {
  require('newrelic');
}

const server = express();

const staticTTL = (config.server.cache.static_ttl || 0) * 1000;
const staticsOptions = {
  maxAge: staticTTL,
  setHeaders: (res) => {
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Expires', new Date(Date.now() + staticTTL).toUTCString());
  }
};

server.use(cors());
server.use(compression());
//server.use(cacheMiddleware); // @todo use a cache middleware from a module
server.use(express.static(path.resolve('./', 'public'), staticsOptions));
server.use(express.static(`${path.resolve('./', 'public')}/scripts`, staticsOptions));
server.use(express.static(path.resolve('./', 'build'), staticsOptions));


if (process.env.NODE_ENV === 'development') {

  const webpackClientConfig = require("../../webpack/webpack.client.dev");
  const webpackServerConfig = require("../../webpack/webpack.server.dev");

  const compiler = webpack([webpackClientConfig, webpackServerConfig]);
  server.use(require('webpack-dev-middleware')(compiler, {
    publicPath: '/',
    contentBase: path.resolve('./', 'src/client'),
    hot: true,
    lazy: false,
    serverSideRender: true
  }));

  server.use(require('webpack-hot-middleware')(compiler.compilers.find(comp => comp.name === 'client'), {
    path: '/__webpack_hmr'
  }));

  server.use(require('webpack-hot-server-middleware')(compiler, {
    chunkName: 'server'
  }));
} else {
  server.use(require('./serverRender.js').default(''));
}


server.listen(config.server.port, (err) => {
  if (err) {
    throw new Error(err);
  } else {
    console.info(`Listening at http://localhost:${config.server.port}`);
  }
});
