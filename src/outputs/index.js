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
  constructor(threeScene, parent) {
    this.scene = threeScene; // bridge to threejs environment (/src/three/scene.js)
    this.parent = parent; // bridge to react environment (/src/react/pages/Main.jsx)

    this.outputs = {};
    this.presets = {};

    // initialize all presets
    this.initPresets();
  }

  initOutputTypes() {
    const types = _.uniq(_.map(outputTypes.keys(), t => t.split('.')[1].split('/')[1]));
    _.each(types, (t) => {
      const InterfaceClass = require('./types/' + t);
      this.outputs[t.toLowerCase()] = new InterfaceClass();
    });

    // connect current preset with outputs
    this.connectCallbacks((this.parent.state.currentOutputPreset === null) ?
      this.parent.state.defaults.outputPreset :
      this.parent.state.currentOutputPreset);
  }

  initPresets() {
    const pres = _.uniq(_.map(presets.keys(), p => p.split('.')[1].split('/')[1]));
    this.parent.state.outputPreset = pres.slice(0);
    _.each(pres, (p) => {
      const PresetClass = require('./presets/' + p);
      this.presets[p.toLowerCase()] = new PresetClass(this, this.parent, this.scene);
    });

    // initialize all interfaces
    this.initOutputTypes();
  }

  connectCallbacks(preset) {
    this.clearAllCallbacks();

    const types = _.uniq(_.map(outputTypes.keys(), t => t.split('.')[1].split('/')[1]));
    _.each(types, (t) => {
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
    _.each(this.outputs, (i) => {
      i.clearCallbacks();
    });
  }

  registerCallback(output, event, label, callback) {
    if (this.outputs[output.toLowerCase()]) {
      this.outputs[output.toLowerCase()].on(event, callback, event, label);
    }
  }
}

module.exports = OutputManager;
