import _ from 'lodash';

class IPhoneX {
  constructor(url) {
    this.callbacks = {};
    this.events = [];
    this.labels = [];

    this.connected = false;
    this.websocket = null;

    this.keydown = {};

    this.initializeWebSocket(url);
  }

  initializeWebSocket(url) {
    console.log('iPhone X connecting to: ', url);

    this.websocket = new WebSocket(url);
    this.websocket.onopen = this.onOpen.bind(this);
    this.websocket.onclose = this.onClose.bind(this);
    this.websocket.onmessage = this.onMessage.bind(this);
    this.websocket.onerror = this.onError.bind(this);

    // stop Chrome from ruining things and crashing the socket server
    window.addEventListener('beforeunload', () => {
      this.websocket.close();
    });
  }


  onOpen(evt) {
    console.log('iPhone X connected:', evt);
    this.connected = true;
  }

  onClose(evt) {
    console.log('iPhone X disconnected:', evt);
    this.connected = false;
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

  onError(evt) {
    console.log('iPhone X error:', evt);
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
