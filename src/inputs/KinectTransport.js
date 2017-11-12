// KinectTransport Source: https://github.com/stimulant/MS-Cube-SDK/tree/research/KinectTransport

import _ from 'lodash';

import config from './../config';

class KinectTransport {
  constructor() {
    this.callbacks = {};

    this.websocket = null;
    this.initializeWebSocket();
  }

  initializeWebSocket() {
    this.websocket = new WebSocket(`ws://localhost:${config.kinectTransport.port}`);
    this.websocket.onopen = this.onOpen;
    this.websocket.onclose = this.oClose;
    this.websocket.onmessage = this.onMessage.bind(this);
    this.websocket.onerror = this.onError;
  }

  onOpen(evt) {
    console.log('KinectTransport connected:', evt);
  }

  onClose(evt) {
    console.log('KinectTransport disconnected:', evt);
  }

  onMessage(data) {
    const dataObj = JSON.parse(data.data);
    _.forEach(dataObj, (obj) => {
      if (typeof this.callbacks[obj.type] === 'function') {
        this.callbacks[obj.type](obj);
      }
    });
  }

  onError(evt) {
    console.log('KinectTransport error:', evt);
  }

  on(name, cb) {
    this.callbacks[name] = cb;
  }
}

module.exports = KinectTransport;
