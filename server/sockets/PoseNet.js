const WebSocket = require('ws');

const config = require('./../config.js').poseNet;

class PoseNet {
  constructor() {
    console.log('PoseNet listening on ' + config.ports.incoming);
    this.wssIncoming = new WebSocket.Server({ port: config.ports.incoming });
    this.wssIncoming.on('connection', this.onIncomingConnection.bind(this));
    this.wssIncoming.on('error', this.onIncomingError.bind(this));
    this.wssIncoming.on('listening', this.onIncomingListening.bind(this));

    console.log('PoseNet broadcasting on ' + config.ports.outgoing);
    this.wssOutgoing = new WebSocket.Server({ port: config.ports.outgoing });
    this.wssOutgoing.on('connection', this.onOutgoingConnection.bind(this));
    this.wssOutgoing.on('error', this.onOutgoingError.bind(this));
    this.wssOutgoing.on('listening', this.onOutgoingListening.bind(this));
  }

  onIncomingConnection(ws) {
    console.log('PoseNet Incoming Connected!');
    this.wsIncoming = ws;
    this.wsIncoming.on('error', this.onIncomingSocketError.bind(this));
    this.wsIncoming.on('message', this.onIncomingMessage.bind(this));
  }

  onIncomingSocketError(err) {
    console.log('PoseNet Incoming Socket Error! ', err);
  }

  onIncomingError(err) {
    console.log('PoseNet Incoming Error! ', err);
  }

  onIncomingListening() {
    console.log('PoseNet Incoming Listening!');
  }

  onIncomingMessage(data) {
    this.broadcast(data);
  }

  onOutgoingConnection(ws) {
    console.log('PoseNet Outgoing Connected!');
    this.wsOutgoing = ws;
    this.wsOutgoing.on('message', this.onOutgoingMessage.bind(this));
  }

  onOutgoingError(err) {
    console.log('PoseNet Outgoing Error! ', err);
  }

  onOutgoingListening() {
    console.log('PoseNet Outgoing Listening!');
  }

  onOutgoingMessage(data) {
    console.log(data);
    // this.broadcast(data);
  }

  broadcast(data) {
    this.wssOutgoing.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(data, this.onBroadcastError);
        } catch (err) {
          this.onBroadcastError(err);
        } finally {
          console.log('Something broke. :(');
        }
      }
    });
  }
}

module.exports = PoseNet;
