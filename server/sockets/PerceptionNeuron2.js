/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 07:51:12
 * @modify date 2018-08-26 07:51:12
 * @desc [Listen for and rebroadcast Perception Neuron data.]
*/

var WebSocket = require('ws');
var _ = require('lodash');

var config = require('./../config.js').perceptionNeuron2;

class PerceptionNeuron2 {
  constructor() {
    this.url = 'ws://' + config.ip + ':' + config.ports.incoming + "/service";

    this.createListenServer();
    this.createBroadcastServer();
  }

  createBroadcastServer() {
    console.log('Perception Neuron 2 Server broadasting on ' + config.ports.outgoing);
    this.wss = new WebSocket.Server({ port: config.ports.outgoing });
    this.wss.on('connection', this.onBroadcastConnection.bind(this));
    this.wss.on('error', this.onBroadcastError.bind(this));
    this.wss.on('listening', this.onBroadcastListening.bind(this));
  }

  createListenServer() {
    console.log('Connecting to the Perception Neuron 2 at ' + this.url);
    this.ws = new WebSocket(this.url);
    this.ws.on('open', this.onListenOpen.bind(this));
    this.ws.on('message', this.onListenMessage.bind(this));
    this.ws.on('error', this.onListenError.bind(this));
  }

  onBroadcastConnection() {
    console.log('Perception Neuron 2 Server Connected!');
  }

  onBroadcastError() {
    console.log('Perception Neuron 2 Server Error!');
  }

  onBroadcastListening() {
    console.log('Perception Neuron 2 Server Listening!');
  }

  onListenOpen() {
    console.log('Perception Neuron 2 Connected!');
  }

  onListenClose() {
    console.log('Perception Neuron 2 Disconnected!');
  }

  onListenError(err) {
    console.log('Perception Neuron 2 Error ', err);
  }

  onListenMessage(msg) {
    this.broadcast(msg);
	}
	
  broadcast(data) {
    console.log(data);
    // this.wss.clients.forEach(function each(client) {
    //   if (client.readyState === WebSocket.OPEN) {
    //     try {
    //       client.send(data, this.onError);
    //     }
    //     catch(err) {
    //       this.onError(err);
    //     }
    //     finally {}
    //   }
    // }.bind(this));
  }
}

module.exports = PerceptionNeuron2;