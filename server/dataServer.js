/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 07:43:36
 * @modify date 2018-08-26 07:43:36
 * @desc [The data server listens to various sockets and rebroadcasts data to each client.]
*/

const config = require('./config.js');

// init kinect server
if (config.kinectTransport.enabled) {
  require('./sockets/KinectTransport');
}

// init perception neuron server
if (config.perceptionNeuron.enabled) {
  const PNServer = require('./sockets/PerceptionNeuron');
  new PNServer();
}

// init gamepad server
if (config.gamepads.enabled) {
  const GPServer = require('./sockets/Gamepads');
  new GPServer();
}

// init midi controller server
if (config.midiController.enabled) {
  const MidiController = require('./sockets/MidiController');
  new MidiController();
}

// init osc server
if (config.oscController.enabled) {
  const OSCServer = require('./sockets/OSCServer');
  new OSCServer();
}

// init poseNet server
if (config.poseNet.enabled) {
  const PoseNetServer = require('./sockets/PoseNet');
  new PoseNetServer();
}

// init iPhoneX server
if (config.iPhoneX.enabled) {
  const IPhoneXServer = require('./sockets/iPhoneX');
  new IPhoneXServer();
}

// init MQTT server
if (config.mqtt.enabled) {
  const MQTTServer = require('./sockets/MQTTServer');
  new MQTTServer();
}