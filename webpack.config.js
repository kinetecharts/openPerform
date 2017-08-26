const p = require('./package.json');

const { resolve } = require('path');
const webpack = require('webpack');

const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: resolve(__dirname, 'src'),
	entry: [
		'react-hot-loader/patch',
		// activate HMR for React

		'webpack-dev-server/client?http://localhost:8080',
		// bundle the client for webpack-dev-server
		// and connect to the provided endpoint

		'webpack/hot/only-dev-server',
		// bundle the client for hot reloading
		// only- means to only hot reload for successful updates

		'./index.jsx',
		// the entry point of our app
	],
	output: {
		filename: 'op_bundle.js',
		// the output bundle

		path: resolve(__dirname, 'dist'),

		publicPath: '/'
		// necessary for HMR to know where to load the hot update chunks
	},

	devtool: '#inline-source-map',

	devServer: {
		hot: true,
		// enable HMR on the server

		contentBase: resolve(__dirname, 'dist'),
		// match the output path

		publicPath: '/',
		// match the output `publicPath`

		overlay: { 
			warnings: true,
			errors: true
		},

		historyApiFallback: true,

		watchContentBase: true,

		watchOptions: {
			poll: true
		}
	},
	module: {
		rules: [
			
			{
				test: /\.(js|jsx)$/,
				exclude: /(node_modules|bower_components)/,
				use: {
					loader: 'babel-loader',
					options: {
						presets: ['env']
					}
				}
			},
			{
				test: /\.css$/,
				options: { sourceMap: true },
				loader: 'style-loader'
			}, {
				test: /\.css$/,
				options: { sourceMap: true },
				loader: 'css-loader'
			},
			{
				test: /\.(bvh|eot|svg|ttf|woff|woff2)$/,
				loader: 'file-loader?name=images/[name].[ext]'
			},
			{
				test: /\.html$/,
				loader: 'html-loader'
			},
			{
				test: /\.(jpe?g|png|gif|svg)$/i,
				use: [
					'url-loader?limit=10000',
					'img-loader'
				]
			},
			{
				test: /\.less$/,
				use: [{
					loader: "style-loader", // creates style nodes from JS strings
					options: { sourceMap: true }
				},
				{
					loader: "css-loader", // translates CSS into CommonJS
					options: { sourceMap: true }
				},
				{
					loader: "less-loader", // compiles Less to CSS
					options: { sourceMap: true }
				}]
			}
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css']
	},
	plugins: [
		new webpack.HotModuleReplacementPlugin(),
		// enable HMR globally

		new webpack.NamedModulesPlugin(),
		// prints more readable module names in the browser console on HMR updates

		// new ExtractTextPlugin('styles.css')
		// export css to separate file

		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			THREE: "three",
			"global.THREE": "three"
		}),

        new HtmlWebpackPlugin({
			template: 'www/index.html'
		})
    ]
};