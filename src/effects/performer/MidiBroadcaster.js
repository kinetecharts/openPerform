import _ from 'lodash';


class MidiBroadcaster {
    constructor(parent, color, guiFolder) {
    this.name = 'trails';
    this.parent = parent;

    this.color = color;
    this.guiFolder = guiFolder;

    this.targets = [/* "hips",
      "rightupleg", "rightleg", "rightfoot",
      "leftupleg", "leftleg", "leftfoot",
      "spine", "spine3", "head",
      "rightarm", "rightforearm", */'righthand',
      /* "leftarm", "leftforearm", */'lefthand',
    ];
    this.callbacks = {};
    this.connected = false;
    this.websocket = null;

    this.keydown = {};

    this.initializeWebSocket(url);
    this.initializeMidi();

    this.profile = {
      // Korg nanoKONTROL 2
      58: 'track left',
      59: 'track right',

      46: 'cycle',
      60: 'marker set',
      61: 'marker left',
      62: 'marker right',

      43: 'rewind',
      44: 'fast forward',
      42: 'stop',
      41: 'play',
      45: 'record',

      32: 'solo 1',
      33: 'solo 2',
      34: 'solo 3',
      35: 'solo 4',
      36: 'solo 5',
      37: 'solo 6',
      38: 'solo 7',
      39: 'solo 8',

      48: 'mute 1',
      49: 'mute 2',
      50: 'mute 3',
      51: 'mute 4',
      52: 'mute 5',
      53: 'mute 6',
      54: 'mute 7',
      55: 'mute 8',

      64: 'record 1',
      65: 'record 2',
      66: 'record 3',
      67: 'record 4',
      68: 'record 5',
      69: 'record 6',
      70: 'record 7',
      71: 'record 8',

      16: 'knob 1',
      17: 'knob 2',
      18: 'knob 3',
      19: 'knob 4',
      20: 'knob 5',
      21: 'knob 6',
      22: 'knob 7',
      23: 'knob 8',

      0: 'slider 1',
      1: 'slider 2',
      2: 'slider 3',
      3: 'slider 4',
      4: 'slider 5',
      5: 'slider 6',
      6: 'slider 7',
      7: 'slider 8',
    };
  }

  initializeMidi() {
    if (navigator.requestMIDIAccess) {
      window.navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
    } else {
      console.log('No MIDI support in your browser.');
    }
  }

  onMIDIFailure(err) {
    console.log('Midi connection failure: ', err);
  }

  onMIDISuccess(conn) {
    conn.outputs.forEach((port) => {
      console.log('Midi controller found: ', port);
      // port.onmidimessage = this.onMidiIn.bind(this);
      // port.onstatechange = this.onStateChange.bind(this);
    });
  }

  

  onStateChange(msg) {
    console.log('New midi state: ', msg);
  }

  update(data) {
    data.traverse((d) => {
      if (_.filter(this.targets, t => `robot_${t}` == d.name.toLowerCase()).length > 0) {
        
      }
    });
  }
}

module.exports = MidiBroadcaster;
