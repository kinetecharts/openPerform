import config from './../../server/config';

module.exports = {
  defaults: {
    preset: 'Default',
    backgroundColor: 0x333333, // will be overridden by environment settings
    environment: 'Grid',
  },

  inputs: ['Keyboard', 'Mouse', 'PerceptionNeuron', 'MidiController', 'Gamepads'], // keyboard, kinecttransport, myo, neurosky, perceptionNeuron, gamepads, midiController
  performerColors: ['FFFFFF', 'CB2402', 'F0F7FA', '5992AE', 'FF009B'],

  debug: {
    enabled: true, // load bvh file / create performer from playback
    BVH: 'models/bvh/duality_edit.bvh',
    stats: true,
    console2html: false,
  },

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

  keyboardModal: false,
  keyboardContent: document.createElement('div'),

  performerModal: false,
  performerContent: document.createElement('div'),

  groupModal: false,
  groupContent: document.createElement('div'),

  environmentModal: false,
  environmentContent: document.createElement('div'),

  scene: null,

  presets: [],
  currentPreset: null,

  performers: [],
  trackedPerformer: null,

  environments: [],
  currentEnvironment: null,

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
