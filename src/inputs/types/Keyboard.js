// Mousetrap Source: https://github.com/ccampbell/mousetrap


import Mousetrap from 'mousetrap';

class Keyboard {
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

  clearCallbacks() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];
  }

  initCallbacks() {
    _.forEach(this.callbacks, this.initCallback.bind(this));
  }

  initCallback(cb, name) {
    Mousetrap.bind(name, cb);
  }
}

module.exports = Keyboard;
