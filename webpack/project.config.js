const path = require('path');

const project = {
  paths: {
    client: path.resolve('./src/client'),
    server: path.resolve('./src/server'),
    public: path.resolve('./public'),
    compiler_public_path: '/',
    dist: path.resolve('./build'),
  },
  globals: {
    'process.env': {
      'NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'production'),
      'CIRCLE_BUILD_NUM': JSON.stringify(process.env.CIRCLE_BUILD_NUM)
    }
  },
  assets: {
    suffix: process.env.CIRCLE_BUILD_NUM ? `-${process.env.CIRCLE_BUILD_NUM}` : ""
  }
};

module.exports = project;
