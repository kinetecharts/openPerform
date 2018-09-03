/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 07:50:57
 * @modify date 2018-08-26 07:50:57
 * @desc [Listen for and rebroadcast OSC data.]
*/

const osc = require('node-osc');
const WebSocket = require('ws');

const config = require('./../config.js').oscController;

class OSCServer {
  constructor() {
    this.oscServer = new osc.Server(config.ports.incoming, '0.0.0.0');
  
    this.wss = new WebSocket.Server({ port: config.ports.outgoing });
    this.wss.on('connection', this.onBroadcastConnection.bind(this));
    this.wss.on('error', this.onBroadcastError.bind(this));
    this.wss.on('listening', this.onBroadcastListening.bind(this));
  }

  onBroadcastConnection(ws) {
    console.log('OSC Controller Connected!');
    this.oscServer.on('message', this.onBroadcastMessage.bind(this));
  }

  onBroadcastError(err) {
    // console.log('OSC Controller Error! ', err);
  }

  onBroadcastListening() {
    console.log('OSC Controller Listening!');
  }

  onBroadcastMessage(data) {
    this.broadcast(data);
  }

  broadcast(data, rinfo) {
    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        try {
          client.send(JSON.stringify(data), this.onBroadcastError);
        } catch (err) {
          // this.onBroadcastError(err);
        } finally {
          // console.log('Something broke. :(', client);
        }
      }
    });
  }
}

module.exports = OSCServer;
