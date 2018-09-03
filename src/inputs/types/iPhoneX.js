import Logger from '../../util/Logger';

class IPhoneX {
  constructor(url) {
    this.callbacks = {};
    this.events = [];
    this.labels = [];

    this.logger = new Logger();

    this.connected = false;
    this.websocket = null;

    this.keydown = {};

    this.initializeWebSocket(url);
  }

  initializeWebSocket(url) {
    console.log('iPhone X connecting to: ', url);

    this.websocket = new WebSocket(url);
    this.websocket.onopen = this.logger.onOpen.bind(this, this.constructor.name);
    this.websocket.onclose = this.logger.onClose.bind(this, this.constructor.name);
    this.websocket.onmessage = this.onMessage.bind(this);
    this.websocket.onerror = this.logger.onError.bind(this, this.constructor.name);
  }

  onMessage(msg) {
    const data = _.map(JSON.parse(msg.data).split('~'), (m) => {
      return m.split(':');
    });
    this.callbacks.message({
      not: data.slice(0, data.length-208),
      3: data.slice(data.length-208, data.length-156),
      2: data.slice(data.length-156, data.length-104),
      1: data.slice(data.length-104, data.length-52),
      blendShapes: data.slice(data.length-52, data.length),
      raw: data
    });
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

module.exports = IPhoneX;
