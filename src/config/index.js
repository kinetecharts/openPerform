import config from './../../server/config';

module.exports = {
  isAR: false,
  isVR: false,
  defaults: {
    inputPreset: 'Default',
    outputPreset: 'Default',
    backgroundColor: '#000000', // will be overridden by environment settings
    environment: 'water',
  },

  inputs: ['Keyboard', 'Mouse', 'PerceptionNeuron', 'MidiController', 'Gamepads'], // keyboard, kinecttransport, myo, neurosky, perceptionNeuron, gamepads, midiController
  outputs: ['MidiController'],
  performerColors: ['FFFFFF', 'D83437', 'FCF3C2', 'C6AC82', '6A695F', '162E2D'],
  debug: {
    bvh: {
      enabled: true, // load bvh file / create performer from playback
      files: ['models/bvh/duality_edit.bvh'],
      autoplay: true,
    },
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

  inputPresets: [],
  currentInputPreset: null,

  outputPresets: [],
  currentOutputPreset: null,

  midiDevices: [],
  currentMidiDevice: null,

  currentMidiChannel: 1,

  performers: [],
  performerName: null,
  trackedPerformer: null,

  environments: [],
  availEnvironments: [],
  currentEnvironment: '',

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
