const p = require('./package.json');

const webpack = require('webpack');
const { resolve } = require('path');

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
	context: resolve(__dirname, 'src'),
	entry: [
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
			  loader: 'style-loader'
			}, {
			  test: /\.css$/,
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
					loader: "style-loader" // creates style nodes from JS strings
				},
				{
					loader: "css-loader" // translates CSS into CommonJS
				},
				{
					loader: "less-loader" // compiles Less to CSS
				}]
			}
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css']
	},
	plugins: [
		new webpack.ProvidePlugin({
			$: "jquery",
			jQuery: "jquery",
			"window.jQuery": "jquery",
			THREE: "three",
			"global.THREE": "three"
		}),
		new webpack.LoaderOptionsPlugin({
		  minimize: true,
		  debug: false
		}),
		new webpack.optimize.UglifyJsPlugin({
		  beautify: false,
		  mangle: {
		    screw_ie8: true,
		    keep_fnames: true
		  },
		  compress: {
		    screw_ie8: true
		  },
		  comments: false
		}),
		new HtmlWebpackPlugin({
			template: 'www/index.html'
		})
	]
}