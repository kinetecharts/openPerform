// Mousetrap Source: https://github.com/ccampbell/mousetrap

import _ from 'lodash';
import Mousetrap from 'mousetrap';

class KeyboardController {
  constructor() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];
  }

  on(name, cb, event, label) {
    this.callbacks[name] = cb;
    this.events.push(event);
    this.labels.push(label);
    this.initCallbacks();
  }

  initCallbacks() {
    _.forEach(this.callbacks, this.initCallback.bind(this));
  }

  initCallback(cb, name) {
    Mousetrap.bind(name, cb);
  }
}

module.exports = KeyboardController;
