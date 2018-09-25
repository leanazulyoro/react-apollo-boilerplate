const webpack = require('webpack');
const nodeExternals = require('webpack-node-externals');
const Copy = require("copy-webpack-plugin");
const project = require('./project.config');


module.exports = {
  name: 'server',
  mode: 'production',
  entry: {
    server: [
      'babel-polyfill',
      `${project.paths.server}/middleware/serverRender.js`
    ]
  },
  output: {
    filename: 'serverRender.js',
    path: project.paths.dist,
    publicPath: project.paths.compiler_public_path,
    libraryTarget: 'commonjs2'
  },
  target: 'node',
  node: {
    __filename: true,
    __dirname: true,
    fs: 'empty'
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['react', 'es2015', 'stage-1', 'react-hmre'],
            plugins: [
              [
                "babel-plugin-styled-components",
                {
                  "ssr": true,
                  "displayName": true
                }
              ]
            ]
          }
        }
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: 'img/[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              gifsicle: {
                interlaced: false,
              },
              optipng: {
                optimizationLevel: 7,
              },
              pngquant: {
                quality: '65-90',
                speed: 4
              },
              mozjpeg: {
                progressive: true,
                quality: 65
              },
              webp: {
                quality: 75
              },
              svgo: {
                plugins: [
                  {
                    removeViewBox: false
                  },
                  {
                    removeEmptyAttrs: false
                  }
                ]
              }
            }
          }
        ]
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        use: {
          loader: 'file-loader',
          options: {
            hash: 'sha512',
            digest: 'hex',
            name: 'fonts/[hash].[ext]'
          }
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin(project.globals),
    new Copy([
      {
        from: project.paths.public,
        to: project.paths.dist
      }
    ]),
  ],
  externals: [nodeExternals()]
};
