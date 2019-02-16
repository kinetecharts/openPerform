const path = require('path');

const config = {
  app: {
    port: 8000,
  },
  browserSync: {
    port: 8080,
  },
  favicon: path.resolve(__dirname, './../docs/images/favicon.ico'),
  shaderToy: {
    key: '',
  },
  copy: {
    all: {
      src: './src/static/',
    }
  },
  fileUpload: {
    port: 8888,
  },
  // input sockets
  kinectTransport: {
    enabled: false,
    ports: {
      incoming: 3000,
      outgoing: 9999,
    },
  },
  perceptionNeuron: {
    enabled: false,
    ip: '127.0.0.1', // ip the Axis Neuron translation app is broadcasting from
    ports: {
      incoming: 9000, // port the Axis Neuron translation app is broadcasting on
      outgoing: 9100, // port the browser connects on
    },
  },
  gamepads: {
    enabled: false,
    ports: {
      outgoing: 9101, // port the browser connects on
    },
  },
  midiController: {
    enabled: false,
    ports: {
      outgoing: 9301, // port the browser connects on
    },
  },
  oscController: {
    enabled: false,
    ports: {
      incoming: 9400,
      outgoing: 9401, // port the browser connects on
    },
  },
  poseNet: {
    enabled: false,
    ports: {
      incoming: 9500,
      outgoing: 9501, // port the browser connects on
    },
  },
  iPhoneX: {
    enabled: false,
    ports: {
      incoming: 9600,
      outgoing: 9601, // port the browser connects on
    },
  },
  kinectron: {
    enabled: false,
    ports: {
      incoming: 9700,
    },
  },
};

module.exports = config;
