//import config options
var config = require('./../server/config.js');
var p = require('./../package.json')

var app = './app';
var dest = './build';
var src = './src';
var server = './server';
var data = './data';

module.exports = {
	mongodb:{
		enabled:config.mongodb.enabled,
		dbpath:config.mongodb.files,
		port:config.mongodb.port
	},
	node:{
		path:server + '/server.js'
	},
	browserSync: {
		port: config.browserSync.port,
		proxy: 'localhost:' + config.app.port,
		ghostMode: false,
		files: [
			dest + '/**'
		]
	},
	lint: {
		src: './**',
		formatter:'./node_modules/eslint-path-formatter'
	},
	three: {
		src: src + '/three/**/**',
		watch: [
			src + '/three/**/**'
		]
	},
	config: {
		src: src + '/config/**/**',
		watch: [
			src + '/config/**/**'
		]
	},
	react: {
		src: src + '/react/**/**',
		watch: [
			src + '/react/**/**'
		]
	},
	inputs: {
		src: src + '/inputs/**/**',
		watch: [
			src + '/inputs/**/**'
		]
	},
	effects: {
		src: src + '/effects/**/**',
		watch: [
			src + '/effects/**/**'
		]
	},
	performers: {
		src: src + '/performers/**/**',
		watch: [
			src + '/performers/**/**'
		]
	},
	environments: {
		src: src + '/environments/**/**',
		watch: [
			src + '/environments/**/**'
		]
	},
	less: {
		src: src + '/less/**',
		watch: [
			src + '/less/**'
		],
		dest: dest + '/css/'
	},
	animation: {
		src: src + '/react/components/Default.hyperesources/*',
		watch: [
			src + '/react/components/Default.hyperesources/*'
		],
		dest: dest + '/Default.hyperesources/'
	},
	markup: {
		src: src + '/www/**',
		dest: dest
	},
	browserify: {
		// Enable source maps
		debug: true,
		// A separate bundle will be generated for each
		// bundle config in the list below
		bundleConfigs: [{
			entries: src + '/react/Index.jsx',
			dest: dest + '/js/',
			outputName: 'Index.js'
		}]
	},
	copy: {
		libs: {
			src: [src + '/libs/**'],
			dest: dest + '/libs/'
		},
		images: {
			src: [src + '/images/**'],	
			dest: dest + '/images/'
		},
		fonts: {
			src: [src + '/fonts/**'],
			dest: dest + '/fonts/'
		},
		data: {
			src: [src + '/data/**'],
			dest: dest + '/data/'
		},
		video: {
			src: [src + '/video/**'],
			dest: dest + '/video/'
		},
		glsl: {
			src: [src + '/glsl/**'],
			dest: dest + '/glsl/'
		},
		textures: {
			src: [src + '/textures/**'],
			dest: dest + '/textures/'
		},
		models: {
			src: [src + '/models/**'],
			dest: dest + '/models/'
		}
	},
	app: {
		scripts: {
			src: [src + '/app/scripts/**'],
			dest: dest + '/scripts/'
		}
	},
	nw:{
		name:p.displayName,
		version:p.version,
		src: [
			'./package.json', dest + '/**', server + '/**', data + '/**',
			'./node_modules/express' + '/**',
			'./node_modules/compression' + '/**',
			'./node_modules/serve-favicon' + '/**',
			'./node_modules/cookie-parser' + '/**',
			'./node_modules/morgan' + '/**',
			'./node_modules/body-parser' + '/**',
			'./node_modules/method-override' + '/**',
			'./node_modules/ejs' + '/**',
			'./node_modules/multer' + '/**',
			'./node_modules/request' + '/**',
			'./node_modules/net' + '/**',
			'./node_modules/ws' + '/**'
		],
		dest: app,
		cache: app + '/cache',
		icons:{
			mac:src + '/app/icons/app.icns',
			win:src + '/app/icons/app.ico'
		},
		maintainers:[{
			name: p.company,
			email: p.email,
			web: p.website
		}]
	},
	iconify:{
		src:src + '/app/icons/app.png',
		dest:src + '/app/icons/app.icns'
	}
};
