/* This class interfaces with various output
methods and handles response data and
callbacks to the threejs environment.
The output list is defined in config/index.js */

import TWEEN from 'tween.js';

import config from './../config';

import Common from './../util/Common';

// import all interfaces
const outputTypes = require.context('./types', false, /\.js$/);

// import all presets
const presets = require.context('./presets', false, /\.js$/);

class OutputManager {
  constructor(allowedOutputs, threeScene, parent) {
    this.allowedOutputs = allowedOutputs;
    this.scene = threeScene; // bridge to threejs environment (/src/three/scene.js)
    this.parent = parent; // bridge to react environment (/src/react/pages/Main.jsx)

    this.outputs = {};
    this.presets = {};

    // initialize all presets
    this.initPresets();
  }

  initInputTypes() {
    const types = _.uniq(_.map(outputTypes.keys(), t => t.split('.')[1].split('/')[1]));
    _.each(_.without(this.allowedOutputs, types), (t) => {
      const InterfaceClass = require('./types/' + t);
      let url = '';
      if (config[t.toLowerCase()]) {
        url = 'ws://' + window.location.hostname + ':' + config[t.toLowerCase()].ports.incoming;
      }
      this.outputs[t.toLowerCase()] = new InterfaceClass(url);
    });

    // connect current preset with inputs
    this.connectCallbacks((this.parent.state.currentOutputPreset === null) ?
      this.parent.state.defaults.outputPreset :
      this.parent.state.currentOutputPreset);
  }

  initPresets() {
    const pres = _.uniq(_.map(presets.keys(), p => p.split('.')[1].split('/')[1]));
    this.parent.state.inputPresets = pres.slice(0);
    _.each(pres, (p) => {
      const PresetClass = require('./presets/' + p);
      this.presets[p.toLowerCase()] = new PresetClass(this, this.parent, this.scene);
    });

    // initialize all interfaces
    this.initInputTypes();
  }

  connectCallbacks(preset) {
    this.clearAllCallbacks();

    const types = _.uniq(_.map(outputTypes.keys(), t => t.split('.')[1].split('/')[1]));
    _.each(_.without(this.allowedOutputs, types), (t) => {
      this.presets[preset.toLowerCase()].initCallbacks(t);
    });
    console.log('Loading ' + preset + ' output preset.');
  }

  clearCallbacks(output) {
    if (this.outputs[output.toLowerCase()]) {
      this.outputs[output.toLowerCase()].clearCallbacks();
    }
  }

  clearAllCallbacks() {
    _.each(this.outputs, (o) => {
      o.clearCallbacks();
    });
  }

  registerCallback(output, event, label, callback) {
    if (this.outputs[output.toLowerCase()]) {
      this.outputs[output.toLowerCase()].on(event, callback, event, label);
    }
  }
}

module.exports = OutputManager;
