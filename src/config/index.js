import config from './../../server/config';

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
  keyboardContent: document.createElement('div'),

  performerModal: false,
  performerContent: document.createElement('div'),

  groupModal: false,
  groupContent: document.createElement('div'),

  environmentModal: false,
  environmentContent: document.createElement('div'),

  inputs: ['Keyboard', 'Mouse', 'PerceptionNeuron', 'MidiController', 'Gamepads'], // keyboard, kinecttransport, myo, neurosky, perceptionNeuron, gamepads, midiController
  presets: [],
  currentPreset: 'Default',
  performers: [],
  performerColors: ['FFFFFF', 'CB2402', 'F0F7FA', '5992AE', 'FF009B'],
  // performerColors: ['FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF', 'FFFFFF'],
  // performerColors: ['FF0000', '00FF00', '0000FF'],
  environments: [],
  kinecttransport: {
    ports: {
      outgoing: config.kinectTransport.ports.outgoing,
    },
  },
  perceptionneuron: {
    ports: {
      outgoing: config.perceptionNeuron.ports.outgoing,
    },
  },
  gamepads: {
    ports: {
      incoming: config.gamepads.ports.incoming,
      outgoing: config.gamepads.ports.outgoing,
    },
  },
  midicontroller: {
    ports: {
      incoming: config.midiController.ports.incoming,
      outgoing: config.midiController.ports.outgoing,
    },
  },
  data: [],
};

module.exports = defaults;
