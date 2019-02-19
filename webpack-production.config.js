const webpack = require('webpack');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const WebappWebpackPlugin = require('webapp-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin')

const config = require('./server/config');

module.exports = {
  mode: 'production',
  context: resolve(__dirname, 'src'),
  entry: [
    './index.jsx',
    // the entry point of our app
  ],
  output: {
    // the output bundle
    filename: 'bundle.js',

    publicPath: '/',

    path: resolve(__dirname, 'dist/'),
  },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env'],
          },
        },
      },
      {
        test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'url-loader?name=/fonts/[name].[ext]',
      },
      {
        test: /\.(ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader?name=/fonts/[name].[ext]',
      },
      {
        test: /\.css$/,
        loader: 'style-loader',
      }, {
        test: /\.css$/,
        loader: 'css-loader',
      },
      {
        test: /\.(jpe?g|gif|svg)$/i,
        use: [
          'img-loader?name=images/[name].[ext]',
          'url-loader?name=images/[name].[ext]&limit=10000',
        ],
      },
      {
        test: /\.(png)$/i,
        use: [
          'base64-image-loader',
        ],
      },
      {
        test: /\.glsl$/,
        loader: 'webpack-glsl-loader',
      },
    ],
  },
  resolve: {
    extensions: ['.js', '.jsx', '.css'],
  },
  plugins: [
    new CopyWebpackPlugin([
      {
        from: resolve(__dirname, config.copy.all.src),
        to: resolve(__dirname, 'dist/'),
      },
    ]),
    new WebappWebpackPlugin(resolve(__dirname, './src/static/images/op_logo.png')),
    new HtmlWebpackPlugin({
      title: 'Open Perform by Kinetech Arts',
      template: resolve(__dirname, './src/html/index.html'),
    }),
    new webpack.ProvidePlugin({
      $: 'jquery',
      jQuery: 'jquery',
      'window.jQuery': 'jquery',
      THREE: 'three',
      'window.THREE': 'three',
      TWEEN: 'tween.js',
      'window.TWEEN': 'tween.js',
      React: 'react',
      _: 'lodash',
    }),
  ],
};
