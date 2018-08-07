const webpack = require('webpack');
const config = require('./config');

module.exports = {
  mode: 'development',

  entry: {
    main: [
      'babel-polyfill',
      config.paths.client('client.js'),
      `webpack-hot-middleware/client?path=${config.compiler_public_path}__webpack_hmr`
    ]
  },

  output: {
    publicPath: config.compiler_public_path,
    path: config.paths.dist(),
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
        test: /\.(s)?css$/i,
        include: config.paths.client(),
        use: [
          {
            loader: 'style-loader',
            options: {
              sourceMap: true
            }
          },
          {
            loader: 'css-loader',
            options: {
              importLoaders: true,
              localIdentName: '[path]___[name]__[local]___[hash:base64:5]',
              sourceMap: true
            }
          },
          {
            loader: 'sass-loader',
            options: {
              data: `$cdnUrl: '${config.cdn_url}';`,
              sourceMap: true
            }
          }
        ]
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
    new webpack.DefinePlugin(config.globals),
    new webpack.HotModuleReplacementPlugin(),
  ],

  optimization: {
    noEmitOnErrors: true,
  },

  externals: {
    'react': 'React',
    'react-dom': 'ReactDOM'
  },

  devServer: {
    outputPath: config.paths.dist(),
    historyApiFallback: true
  }

};
