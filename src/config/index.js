import config from './../../server/config';

module.exports = {
  isAR: false,
  isVR: false,
  defaults: {
    inputPreset: 'Default',
    outputPreset: 'Default',
    backgroundColor: '000000', // will be overridden by environment settings
    floorColor: 'ffffff', // will be overridden by environment settings
    environment: 'grid',
    performer: {
      wireframe: false,
      color: null, // if null, will use color from performerColors (listed below)
      material: 'basic',
      visible: true,
      tracking: false,
      intensity: 1,
      style: 'default',
      offset: null, // if null, will auto increment x position based on performer id
    },
    effect: 'ribbons',
  },

  inputs: ['Keyboard', 'Mouse', 'PerceptionNeuron', 'MidiController', 'Gamepads', 'OSCController', 'PoseNet', 'iPhoneX'], // keyboard, kinecttransport, myo, neurosky, perceptionNeuron, gamepads, midiController
  outputs: ['MidiController'],
  performerColors: ['c8ace0', 'D83437', 'FCF3C2', 'C6AC82', '6A695F', '162E2D'],
  // performerColors: ['158C9B', '158C9B', 'FCF3C2', 'C6AC82', '6A695F', '162E2D'],
  colorSet: [
    { background: 'EDC346', performers: ['2D3E9A', '253380', '1e2866', '161e4d', '0f1433', '070a1a'] },
    { background: 'BB806C', performers: ['376A9C', '2e5882', '254769', '1c354f', '132436', '0a131c'] },
    { background: 'BC4936', performers: ['38B8A4', '2f9e8d', '288577', '206b60', '185249', '113832'] },
    { background: 'D9CD86', performers: ['403BA6', '37328c', '2d2973', '232059', '191740', '0f0e26'] },
    { background: 'B84C38', performers: ['3ABAA8', '32a192', '2a877b', '226e64', '1a544c', '123b35'] },
    { background: 'D63727', performers: ['F0A623', 'd69320', 'bd821c', 'a37018', '8a5f15', '704d11'] },
  ],
  debug: {
    bvh: {
      enabled: false, // load bvh file / create performer from playback
      files: [
        'animations/bvh/duality_edit.bvh',
        // 'animations/bvh/dai_cmp_edit.bvh',
        // 'animations/bvh/sean_edit.bvh',
        // 'animations/bvh/juliet_edit.bvh',
        // 'animations/bvh/wei_edit.bvh',
        // 'animations/bvh/freya_edit.bvh',
      ],
      autoplay: true,
    },
    stats: true,
    console2html: false,
  },
  bvhFiles: [
    './animations/bvh/duality_edit.bvh',
    './animations/bvh/dai_cmp_edit.bvh',
    './animations/bvh/sean_edit.bvh',
    './animations/bvh/juliet_edit.bvh',
    './animations/bvh/wei_edit.bvh',
    './animations/bvh/freya_edit.bvh',
    './animations/bvh/movie-1_1.bvh',
  ],
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

  bvhChooserModal: true,
  
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
  osccontroller: {
    ports: {
      incoming: config.oscController.ports.incoming,
      outgoing: config.oscController.ports.outgoing,
    },
  },
  posenet: {
    ports: {
      incoming: config.poseNet.ports.incoming,
      outgoing: config.poseNet.ports.outgoing,
    },
  },
  iphonex: {
    ports: {
      incoming: config.iPhoneX.ports.incoming,
      outgoing: config.iPhoneX.ports.outgoing,
    },
  },
  data: [],
};
