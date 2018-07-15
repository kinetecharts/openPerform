const WebSocket = require('ws');
const net = require('net');

const config = require('./../config.js').iPhoneX;

class IPhoneX {
  constructor() {
    console.log('IPhoneX listening on ' + config.ports.incoming);
    this.listen(config.ports.incoming);

    console.log('IPhoneX broadcasting on ' + config.ports.outgoing);
    this.wssOutgoing = new WebSocket.Server({ port: config.ports.outgoing });
    this.wssOutgoing.on('connection', this.onOutgoingConnection.bind(this));
    this.wssOutgoing.on('error', this.onOutgoingError.bind(this));
    this.wssOutgoing.on('listening', this.onOutgoingListening.bind(this));

    this.dataBuffer = '';
  }

  onOutgoingConnection(ws) {
    console.log('IPhoneX Outgoing Connected!');
    this.wsOutgoing = ws;
    this.wsOutgoing.on('message', this.onOutgoingMessage.bind(this));
  }

  onOutgoingError(err) {
    console.log('IPhoneX Outgoing Error! ', err);
  }

  onOutgoingListening() {
    console.log('IPhoneX Outgoing Listening!');
  }

  onOutgoingMessage(data) {
    console.log(data);
    // this.broadcast(data);
  }

  broadcast(data) {
    this.wssOutgoing.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify(data), this.onBroadcastError);
        } catch (err) {
          this.onBroadcastError(err);
        } finally {
          console.log('Something broke. :(');
        }
      }
    });
  }

  listen(port) {
    net.createServer((conn) => {
      conn.setEncoding('utf8');

      conn.on('message', (m) => {
        console.log('MESSAGE: ' + m);
      });

      conn.on('data', (data) => {
        this.dataBuffer += data;
        if (data.charAt(data.length-1) == 'a') { // a == end of packet
          this.broadcast(this.dataBuffer.slice(1, -1));
          this.dataBuffer  = '';
        }
      });
    }).listen(port, '0.0.0.0');
  }
}

module.exports = IPhoneX;
