require('babel-register')({ plugins: ['dynamic-import-node'] }); // @see: https://github.com/webpack/webpack/issues/5703#issuecomment-363267093

import yn from "yn";
import {client as config, server as configServer} from "isomorphic-config";
import ServerBuilder from "./builder/ServerBuilder";
import project from "../webpack/config";
import webpack from "webpack";
import webpackDevConfig from "../webpack/webpack.dev.config";
import cssRequireHook from "css-modules-require-hook";
import chokidar from "chokidar";

if (yn(config.newrelic.enable)) {
  require("newrelic");
}

const static_ttl = (configServer.cache.static_ttl || 0) * 1000;
const statics_options = {
  maxAge: static_ttl,
  setHeaders: (res) => {
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Expires", new Date(Date.now() + static_ttl).toUTCString());
  }
};

const configureDevServer = function (server) {
  cssRequireHook({
    devMode: process.env.NODE_ENV === "development",
    generateScopedName: "style.css",
    extensions: [".scss", ".css"]
  });

  const compiler = webpack(webpackDevConfig);

  server.withMiddleWare(require("webpack-dev-middleware")(compiler, {
    publicPath: project.compiler_public_path,
    contentBase: project.paths.client(),
    hot: true,
    lazy: false,
    serverSideRender: true
  }));

  server.withMiddleWare(require("webpack-hot-middleware")(compiler, {
    path: "/__webpack_hmr"
  }));

  const watcher = chokidar.watch("./server");

  watcher.on("ready", function () {
    watcher.on("all", function () {
      console.log("Clearing /server/ module cache from server");
      Object.keys(require.cache).forEach(function (id) {
        if (/[\/\\]server[\/\\]/.test(id)) delete require.cache[id];
      });
    });
  });

  return server;
};

let server = (new ServerBuilder())
  .withCors(true)
  .withCompression(true)
  .withPort(project.server_port)
  .withMiddleWare((req, res, next) => {
    // Set max-age for Cache-Control header
    res.set("Cache-Control", `max-age=${configServer.cache.ttl || 0}`);
    res.set("Expires", new Date(Date.now() + (configServer.cache.ttl * 1000)).toUTCString());
    next();
  });

if (process.env.NODE_ENV === "development") {
  configureDevServer(server);
}

server.withStatic(project.paths.public(), statics_options)
  .withStatic(`${project.paths.public()}/scripts`, statics_options)
  .withStatic(project.paths.dist(), statics_options);

server.withMiddleWare((req, res, next) => {
  require("./middleware")(req, res, next);
});

server.build();
