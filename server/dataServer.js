// const express = require('express');

// const app = express();

// import config options
const config = require('./config.js');

// start app server
// const server = app.listen(config.app.port, () => {
//   console.log('Web server started on port', server.address().port);
// });

// init kinect server
if (config.kinectTransport.enabled) {
  const KTServer = require('./sockets/KinectTransport');
}

// init perception neuron server
if (config.perceptionNeuron.enabled) {
  const PNServer = require('./sockets/PerceptionNeuron');
  const pnServer = new PNServer();
}

// init gamepad server
if (config.gamepads.enabled) {
  const GPServer = require('./sockets/Gamepads');
  const gpServer = new GPServer();
}

// init midi controller server
if (config.midiController.enabled) {
  const MidiController = require('./sockets/MidiController');
  const midiController = new MidiController();
}

// init osc server
if (config.oscController.enabled) {
  const OSCServer = require('./sockets/OSCServer');
  const oscServer = new OSCServer();
}

// init poseNet server
if (config.poseNet.enabled) {
  const PoseNetServer = require('./sockets/PoseNet');
  const poseNetServer = new PoseNetServer();
}

// init iPhoneX server
if (config.iPhoneX.enabled) {
  const IPhoneXServer = require('./sockets/iPhoneX');
  const iPhoneXServer = new IPhoneXServer();
}

const express = require('express');
const fileUpload = require('express-fileupload');

const app = express();
app.use(fileUpload());
app.post('/upload', (req, res, next) => {
  let f = req.files.file;

  f.mv(`${__dirname}/../dist/models/upload/${f.name}`, (err) => {
    if (err) {
      return res.status(500).send(err);
    }

    res.json({file: `/../dist/models/upload/${f.name}`});
  });
});
app.listen(config.fileUpload.port, () => {
  console.log('File upload sever running on ' + config.fileUpload.port);
});