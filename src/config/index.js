import config from './../../server/config.js';

const defaults = {
  debug: false, // load bvh file / create performer from playback
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
  colorSet:[],
  dark: [
    {
      background:'#000000',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    },
    {
      background:'#000000',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    },
    {
      background:'#000000',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    },
    {
      background:'#000000',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    },
    {
      background:'#000000',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    }
  ],

  darkColors: [
    {
      background:'#000000',
      performers: ['#ffc005', '#ffc005', '#ffc005']
    },
    {
      background:'#000000',
      performers: ['#005791', '#005791', '#005791']
    },
    {
      background:'#000000',
      performers: ['#18918b', '#18918b', '#18918b']
    },
    {
      background:'#000000',
      performers: ['#4752b7', '#4752b7', '#4752b7']
    },
    {
      background:'#000000',
      performers: ['#ad1403', '#ad1403', '#ad1403']
    }
  ],

  colors1: [
    {
      background:'#ffc005',
      performers: ['#000000', '#000000', '#000000']
    },
    {
      background:'#005791',
      performers: ['#000000', '#000000', '#000000']
    },
    {
      background:'#18918b',
      performers: ['#000000', '#000000', '#000000']
    },
    {
      background:'#4752b7',
      performers: ['#000000', '#000000', '#000000']
    },
    {
      background:'#ad1403',
      performers: ['#000000', '#000000', '#000000']
    }
  ],

  colors2: [
    {
      background:'#ffc005',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    },
    {
      background:'#005791',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    },
    {
      background:'#18918b',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    },
    {
      background:'#4752b7',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
    },
    {
      background:'#ad1403',
      performers: ['#FFFFFF', '#FFFFFF', '#FFFFFF']
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
