const neurosky = require('node-neurosky');

import _ from 'lodash';

// Myo devloper docs: https://github.com/thalmiclabs/myo.js/blob/master/docs.md

class NeuroSky {
  constructor() {
    this.callbacks = {};
    this.ns = neurosky.createClient({
		    appName: 'KinevizMW',
		    appKey: '1234567890abcdef...',
    });
    this.ns.connect();
  }

  on(name, cb) {
    this.callbacks[name] = cb;
    this.initCallbacks();
  }

  initCallbacks() {
    _.forEach(this.callbacks, this.initCallback.bind(this));
  }

  initCallback(cb, name) {
    this.ns.on(name, cb);
  }
}

module.exports = NeuroSky;
