var express = require('express');
var app = express();
var compression = require('compression');

var favicon = require('serve-favicon');
var cookieParser = require('cookie-parser');

var morgan = require('morgan');
var bodyParser = require('body-parser');
var methodOverride = require('method-override');

var ejs = require('ejs');
var path = require('path');  

var routes = require('./routes/index');

//import config options
var config = require('./config.js');

//enable gzip
app.use(compression());

app.use(favicon(config.favicon));
app.use(morgan('dev'));
app.use(methodOverride());

//use json parser
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.get("/", function (req, res) {
	res.redirect("/index.html" + (req._parsedUrl && req._parsedUrl.search ? req._parsedUrl.search : ""));
});

app.use(cookieParser());
app.use(function (req, res, next) {
	if (config.login.enabled && (/\.html/ig).test(req.url)) {
		if (req.cookies.siteUser != null || (/login\.html/ig).test(req.url)) {
			return next();
		} else {
			return res.redirect("/login.html?" + req.url);
		}
	} else {
		return next();
	}
});


//init mongoose
/* eslint-disable */
if (config.verticadb.enabled) {
	var verticadb = require('./database/VerticaDB');
	app.locals.verticadb = verticadb;
}
/* eslint-enable */

//init vertica
/* eslint-disable */
if (config.mongodb.enabled) {
	var mongodb = require('./database/MongoDB');
}
/* eslint-enable */

app.use(express.static('./dist'));

app.use('/', routes);

//start app server
var server = app.listen(config.app.port, function() {
	console.log('Web server started on port', server.address().port);
});

//init kinect server
/* eslint-disable */
if (config.kinectTransport.enabled) {
    var KTServer = require('./sockets/KinectTransport');
}
/* eslint-enable */

//init perception neuron server
/* eslint-disable */
if (config.perceptionNeuron.enabled) {
    var PNServer = require('./sockets/PerceptionNeuron');
    var pnServer = new PNServer();
}
/* eslint-enable */

//init gamepad server
/* eslint-disable */
if (config.gamepads.enabled) {
    var GPServer = require('./sockets/Gamepads');
    var gpServer = new GPServer();
}
/* eslint-enable */

//init midi controller server
/* eslint-disable */
if (config.midiController.enabled) {
    var MidiController = require('./sockets/MidiController');
    var midiController = new MidiController();
}
/* eslint-enable */
