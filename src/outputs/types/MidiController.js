class MidiController {
  constructor() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];

    this.connected = false;
    this.websocket = null;

    this.outputs = [];
    this.currentDevice = null;
    
    this.channelOns = {
      1: 0x90,
      2: 0x91,
      3: 0x92,
      4: 0x93,
      5: 0x94,
      6: 0x95,
      7: 0x96,
      8: 0x97,
      9: 0x98,
      10: 0x99,
    };

    this.channelOffs = {
      1: 0x80,
      2: 0x81,
      3: 0x82,
      4: 0x83,
      5: 0x84,
      6: 0x85,
      7: 0x86,
      8: 0x87,
      9: 0x88,
      10: 0x89,
    };

    this.currentChannel = 1;

    this.initializeMidi();
  }

  initializeMidi() {
    if (navigator.requestMIDIAccess) {
      window.navigator.requestMIDIAccess()
        .then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this));
    } else {
      console.log('No MIDI support in your browser.');
    }
  }

  onMIDIFailure(err) {
    console.log('Midi connection failure: ', err);
  }

  onMIDISuccess(conn) {
    conn.onstatechange = this.deviceStateChange.bind(this);
    this.populateDeviceList(conn);
  }

  deviceStateChange(evt) {
    console.log(evt);
    switch(evt.port.state) {
      default:
        console.log('Unknown device state: ', evt.currentTarget.state);
        break;
      case 'connected':
        this.addDevice(evt.port);
        break;
      case 'disconnected':
        this.removeDevice(evt.port);
        break;
    }
  }

  addDevice(device) {
    if (device.type === 'output' && _.filter(this.outputs, (d) => { return d.name == device.name; }).length == 0) {
      console.log('Midi output found: ', device);
      this.outputs.push(device);
      if (this.currentDevice == null) {
        this.currentDevice = device.name;
      }
      this.callbacks.devicesConnected(this.getAvailableOutputs(), this.currentDevice);
    }
  }

  removeDevice(device) {
    if (device.type === 'output' && _.filter(this.outputs, (d) => { return d.name == device.name; }).length > 0) {
      console.log('Midi output lost: ', device);
      this.outputs = _.filter(this.outputs, (d) => { return d.name !== device.name; });
      if (this.currentDevice == device.name) {
        this.currentDevice = null;
      }
      this.callbacks.devicesConnected(this.getAvailableOutputs(), this.currentDevice);
    }
  }

  populateDeviceList(conn) {
    conn.outputs.forEach((device) => {
      this.addDevice(device);
    });
  }

  getAvailableOutputs() {
    return _.map(this.outputs, 'name');
  }

  sendMidiNoteOn(note, velocity) {
    _.filter(this.outputs, (out) => { return out.name == this.currentDevice; })[0].send([this.channelOns[this.currentChannel], note, velocity]);
  }

  sendMidiNoteOff(note, velocity) {
    _.filter(this.outputs, (out) => { return out.name == this.currentDevice; })[0].send([this.channelOffs[this.currentChannel], note, velocity]);
  }

  changeDevice(device) {
    console.log(device);
    this.currentDevice = device;
  }

  changeChannel(channel) {
    this.currentChannel = channel;
  }

  sendTest() {
    console.log('!!!!!!', this.currentDevice);
    if (this.currentDevice === null) {
      console.log('No midi output device selected.');
    } else {
      this.sendMidiNoteOn(60, 127);
      setTimeout(() => {
        this.sendMidiNoteOff(60, 127);
      }, 1000);
    }
  }

  on(name, cb, event, label) {
    this.callbacks[name] = cb;
    this.events.push(event);
    this.labels.push(label);
    this.initCallbacks();
  }

  clearCallbacks() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];
  }

  initCallbacks() {
    // _.forEach(this.callbacks, this.initCallback.bind(this));
  }
}

module.exports = MidiController;
