class Mouse {
  constructor(url) {
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
  }
}

module.exports = Mouse;
