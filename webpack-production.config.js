const webpack = require('webpack');
const { resolve } = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

const config = require('./server/config');

module.exports = {
	/*watch: true,
	watchOptions: {
		aggregateTimeout: 300,
		poll: 1000,
		ignored: '/node_modules/'
	},*/
	context: resolve(__dirname, 'src'),
	entry: [
		'./index.jsx',
		// the entry point of our app
	],
	output: {
		filename: 'bundle.js',
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
				test: /\.(eot|ttf|woff|woff2)$/,
				loader: 'file-loader?name=fonts/[name].[ext]'
			},
			{
				test: /\.(jpe?g|gif|svg)$/i,
				use: [
					'url-loader?name=images/[name].[ext]&limit=10000',
					'img-loader?name=images/[name].[ext]'
				]
			},
			{
				test: /\.(png)$/i,
				use: [
					'base64-image-loader',
				]
			},
			{
				test: /\.(glsl|vert|frag)$/,
				loader: 'webpack-glsl-loader'
			},
		],
	},
	resolve: {
		extensions: ['.js', '.jsx', '.css']
	},
	plugins: [
		new CopyWebpackPlugin([
      {
        from: resolve(__dirname, config.copy.html.src),
        to: resolve(__dirname, config.copy.html.dest),
      },
      {
        from: resolve(__dirname, config.copy.images.src),
        to: resolve(__dirname, config.copy.images.dest),
      },
      {
        from: resolve(__dirname, config.copy.textures.src),
        to: resolve(__dirname, config.copy.textures.dest),
			},
			{
        from: resolve(__dirname, config.copy.models.src),
        to: resolve(__dirname, config.copy.models.dest),
			},
			{
        from: resolve(__dirname, config.copy.animations.src),
        to: resolve(__dirname, config.copy.animations.dest),
			},
			{
        from: resolve(__dirname, config.copy.bmfonts.src),
        to: resolve(__dirname, config.copy.bmfonts.dest),
      },
    ]),
		new webpack.LoaderOptionsPlugin({
		  minimize: true,
		  debug: false
		}),
		// new webpack.optimize.UglifyJsPlugin({
		//   beautify: false,
		//   mangle: {
		//     screw_ie8: false,
		//     keep_fnames: true
		//   },
		//   compress: {
		//     screw_ie8: false
		//   },
		//   comments: false
		// }),
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

		new webpack.optimize.CommonsChunkPlugin({
		  name: "vendor",
		  filename: "vendor.js",
		  minChunks: function (module) {
		    // this assumes your vendor imports exist in the node_modules directory
		    return module.context && module.context.indexOf("node_modules") !== -1;
		  }
		})
	]
}