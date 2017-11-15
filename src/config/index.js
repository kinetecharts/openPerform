import config from './../../server/config.js';

const defaults = {
  debug: true, // load bvh file / create performer from playback
  debugBVH: 'models/bvh/duality_edit.bvh',
  backgroundColor: 0x333333,
  console2html: false,
  scene: null,
  camera: {
    closeShot: {
      position: new THREE.Vector3(0, 1.5, 5),
      look: new THREE.Vector3(0, 1.5, 0),
    },
    mediumShot: {
      position: new THREE.Vector3(0, 1.5, 10),
      look: new THREE.Vector3(0, 1.5, 0),
    },
    wideShot: {
      position: new THREE.Vector3(0, 1.5, 20),
      look: new THREE.Vector3(0, 1.5, 0),
    },
  },
  stats: true,
  
  keyboardModal: false,
  keyboardContent: document.createElement("div"),

  performerModal: false,
  performerContent: document.createElement("div"),

  groupModal: false,
  groupContent: document.createElement("div"),

  environmentModal: false,
  environmentContent: document.createElement("div"),

  colorSets: [
    {
      background:'#1B325F',
      performers: ['#1B325F', '#9CC4E4', '#94BA65']
    },
    {
      background:'#9CC4E4',
      performers: ['#2790B0', '#2B4E72', '#C7BA99']
    },
    {
      background:'#94BA65',
      performers: ['#F58723', '#83A300', '#3A2D19']
    },
    {
      background:'#2790B0',
      performers: ['#E8373E', '#E61E2C', '#327CCB']
    },
    {
      background:'#2B4E72',
      performers: ['#8B84B7', '#4A970A', '#75CFB6']
    },
    {
      background:'#C7BA99',
      performers: ['#1B325F', '#9CC4E4', '#94BA65']
    },
    {
      background:'#F58723',
      performers: ['#2790B0', '#2B4E72', '#C7BA99']
    },
    {
      background:'#83A300',
      performers: ['#F58723', '#83A300', '#3A2D19']
    },
    {
      background:'#3A2D19',
      performers: ['#E8373E', '#E61E2C', '#327CCB']
    },
    {
      background:'#E8373E',
      performers: ['#8B84B7', '#4A970A', '#75CFB6']
    },
    {
      background:'#E61E2C',
      performers: ['#1B325F', '#9CC4E4', '#94BA65']
    },
    {
      background:'#327CCB',
      performers: ['#2790B0', '#2B4E72', '#C7BA99']
    },
    {
      background:'#8B84B7',
      performers: ['#F58723', '#83A300', '#3A2D19']
    },
    {
      background:'#4A970A',
      performers: ['#E8373E', '#E61E2C', '#327CCB']
    },
    {
      background:'#75CFB6',
      performers: ['#8B84B7', '#4A970A', '#75CFB6']
    }
  ],

  inputs: ['keyboard', 'mouse', 'perceptionNeuron', 'midiController', 'gamepads'], // keyboard, kinecttransport, myo, neurosky, perceptionNeuron, gamepads, midiController
  performers: [],
  environments: [],

  myo: null,
  kinectTransport: {
    port: config.kinectTransport.ports.outgoing,
  },
  perceptionNeuron: {
    port: config.perceptionNeuron.ports.outgoing,
  },
  gamepads: {
    ports: {
      incoming: config.gamepads.ports.incoming,
      outgoing: config.gamepads.ports.outgoing,
    },
  },
  midiController: {
    ports: {
      incoming: config.midiController.ports.incoming,
      outgoing: config.midiController.ports.outgoing,
    },
  },
  data: [],
  home: {
    target: { lat: 24.525961, lon: 15.255119 },
    look: new THREE.Vector3(0, 0, 0),
    center: { lat: 48.425555, lon: 11.777344 },
    zoom: 1835,
    data: [],
    title: 'Europe',
    key: 'europe',
  },
};

module.exports = defaults;
