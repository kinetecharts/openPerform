const path = require('path');

const config = {
  app: {
    port: 8000,
  },
  browserSync: {
    port: 8080,
  },
  favicon: path.resolve(__dirname, './../dist/images/favicon.ico'),
  copy: {
    html: {
      src: './src/html/index.html',
      dest: './dist/index.html',
    },
    images: {
      src: './src/images',
      dest: './dist/images',
    },
    models: {
      src: './src/models',
      dest: './dist/models',
    },
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
    enabled: true,
    ip: '192.168.1.250', // ip the Axis Neuron translation app is broadcasting from
    ports: {
      incoming: 9000, // port the Axis Neuron translation app is broadcasting on
      outgoing: 9100, // port the browser connects on
    },
  },
  gamepads: {
    enabled: true,
    ports: {
      outgoing: 9101, // port the browser connects on
    },
  },
  midiController: {
    enabled: true,
    ports: {
      outgoing: 9301, // port the browser connects on
    },
  },
};

module.exports = config;
