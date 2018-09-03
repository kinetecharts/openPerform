
class Logger {
  constructor() {
    // stop Chrome from ruining things and crashing the socket server
    window.addEventListener('beforeunload', () => {
      this.websocket.close();
    });
  }

  onOpen(name, evt) {
    console.log(name + ' socket connected:', evt);
  }

  onClose(name, evt) {
    console.log(name + ' socket disconnected:', evt);
  }

  onError(name, evt) {
    console.log(name + ' socket error:', evt);
  }
}

module.exports = Logger;