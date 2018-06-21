import _ from 'lodash';
import oscBrowser from 'osc-browser';

class OSC {
  constructor(url) {
    this.callbacks = {};
    this.events = [];
    this.labels = [];

    this.connected = false;
    this.websocket = null;

    this.initializeWebSocket(url);
  }

  initializeWebSocket(url) {
    // console.log('OSC Server connecting to: ', url);

    // this.websocket = new WebSocket(url);
    // this.websocket.onopen = this.onOpen.bind(this);
    // this.websocket.onclose = this.onClose.bind(this);
    // this.websocket.onmessage = this.onMessage.bind(this);
    // this.websocket.onerror = this.onError.bind(this);

    // // stop Chrome from ruining things and crashing the socket server
    // window.addEventListener('beforeunload', () => {
    //   this.websocket.close();
    // });

    this.websocket = new osc.WebSocketPort({
      url: url,
    });

    this.websocket.on('message', this.onMessage.bind(this));
    // this.websocket.onopen = this.onOpen.bind(this);
    // this.websocket.onclose = this.onClose.bind(this);
    // this.websocket.onerror = this.onError.bind(this);
    
    this.websocket.open();
    // var sayHello = function () {
    //   this.websocket.send({
    //     address: "/hello",
    //     args: ["world"]
    //   });
    // };
  }


  onOpen(evt) {
    console.log('OSC Server connected:', evt);
    this.connected = true;
  }

  onClose(evt) {
    console.log('OSC Server disconnected:', evt);
    this.connected = false;
  }

  onMessage(msg) {
    console.log("message", JSON.stringify(msg, undefined, 2));
  }

  onError(evt) {
    console.log('OSC Server error:', evt);
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

module.exports = OSC;
