/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 07:49:09
 * @modify date 2018-08-26 07:49:09
 * @desc [Listen for and rebroadcast gamepad data.]
*/

const WebSocket = require('ws');

const config = require('./../config.js').gamepads;

class Gamepads {
  constructor() {
    console.log('Gamepad Server broadasting on ' + config.ports.outgoing);
    this.wss = new WebSocket.Server({ port: config.ports.outgoing });
    this.wss.on('connection', this.onBroadcastConnection.bind(this));
    this.wss.on('error', this.onBroadcastError.bind(this));
    this.wss.on('listening', this.onBroadcastListening.bind(this));
  }
  onBroadcastConnection(ws) {
    console.log('Gamepad Server Connected!');
    ws.on('message', this.onBroadcastMessage.bind(this));
  }
  onBroadcastError(err) {
    console.log('Gamepad Server Error! ', err);
  }

  onBroadcastListening() {
    console.log('Gamepad Server Listening!');
  }

  onBroadcastMessage(data) {
    this.broadcast(data);
  }

  broadcast(data) {
    this.wss.clients.forEach((client) => {
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

module.exports = Gamepads;
