/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 07:50:43
 * @modify date 2018-08-26 07:50:43
 * @desc [Listen for and rebroadcast Midi data.]
*/

const WebSocket = require('ws');

const config = require('./../config.js').midiController;

class MidiController {
  constructor() {
    console.log('Midi Controller broadasting on ' + config.ports.outgoing);
    this.wss = new WebSocket.Server({ port: config.ports.outgoing });
    this.wss.on('connection', this.onBroadcastConnection.bind(this));
    this.wss.on('error', this.onBroadcastError.bind(this));
    this.wss.on('listening', this.onBroadcastListening.bind(this));
  }
  onBroadcastConnection(ws) {
    console.log('Midi Controller Connected!');
    ws.on('message', this.onBroadcastMessage.bind(this));
  }
  onBroadcastError(err) {
    console.log('Midi Controller Error! ', err);
  }

  onBroadcastListening() {
    console.log('Midi Controller Listening!');
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

module.exports = MidiController;
