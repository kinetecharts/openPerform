import _ from 'lodash';

class PoseNet {
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
    console.log('PoseNet connecting to: ', url);

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
    console.log('PoseNet connected:', evt);
    this.connected = true;
  }

  onClose(evt) {
    console.log('PoseNet disconnected:', evt);
    this.connected = false;
  }

  onMessage(msg) {
    this.callbacks.message(JSON.parse(msg.data));
  }

  onError(evt) {
    console.log('PoseNet error:', evt);
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

module.exports = PoseNet;
