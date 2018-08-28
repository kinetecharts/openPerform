const neurosky = require('node-neurosky');

import _ from 'lodash';

// Myo devloper docs: https://github.com/thalmiclabs/myo.js/blob/master/docs.md

class NeuroSky {
  constructor() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];

    this.ns = neurosky.createClient({
		    appName: 'KinevizMW',
		    appKey: '1234567890abcdef...',
    });
    this.ns.connect();
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
    _.forEach(this.callbacks, this.initCallback.bind(this));
  }

  initCallback(cb, name) {
    this.ns.on(name, cb);
  }
}

module.exports = NeuroSky;
