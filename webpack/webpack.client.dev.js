const webpack = require('webpack');
const project = require('./project.config');


module.exports = {
  name: 'client',
  mode: 'development',
  entry: {
    main: [
      'babel-polyfill',
      project.paths.client,
      `webpack-hot-middleware/client?path=${project.paths.compiler_public_path}__webpack_hmr`
    ]
  },
  output: {
    publicPath: project.paths.compiler_public_path,
    path: project.paths.dist,
    filename: `[name].bundle.js`,
    chunkFilename: `[name].bundle.js`
  },
  target: 'web',
  node: {
    fs: 'empty',
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        use: [
          {
            loader: 'babel-loader',
            options: {
              presets: ['react', 'es2015', 'stage-1', 'react-hmre']
            }
          }
        ],
        exclude: /node_modules/,
      },
      {
        test: /\.(jpe?g|png|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
            options: {
              hash: 'sha512',
              digest: 'hex',
              name: 'images/[hash].[ext]'
            }
          },
          {
            loader: 'image-webpack-loader',
            options: {
              bypassOnDebug: true,
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
    new webpack.HotModuleReplacementPlugin(),
  ],
  optimization: {
    noEmitOnErrors: true,
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /node_modules/,
          chunks: "initial",
          name: "vendor",
          priority: 10,
          enforce: true
        }
      }
    }
  },
  devServer: {
    outputPath: project.paths.dist,
    historyApiFallback: true
  }
};
