class Mouse {
  constructor(url) {
    this.callbacks = {};
  }
  
  on(name, cb) {
    this.callbacks[name] = cb;
  }

  clearCallbacks() {
    this.callbacks = {};
  }
}

module.exports = Mouse;
