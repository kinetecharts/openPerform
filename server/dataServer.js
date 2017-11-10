var express = require('express');
var app = express();

var routes = require('./routes/index');

//import config options
var config = require('./config.js');

app.use('/', routes);

//start app server
var server = app.listen(config.app.port, function() {
	console.log('Web server started on port', server.address().port);
});

//init kinect server
if (config.kinectTransport.enabled) {
    var KTServer = require('./sockets/KinectTransport');
}

//init perception neuron server
if (config.perceptionNeuron.enabled) {
    var PNServer = require('./sockets/PerceptionNeuron');
    var pnServer = new PNServer();
}

//init gamepad server
if (config.gamepads.enabled) {
    var GPServer = require('./sockets/Gamepads');
    var gpServer = new GPServer();
}

//init midi controller server
if (config.midiController.enabled) {
    var MidiController = require('./sockets/MidiController');
    var midiController = new MidiController();
}