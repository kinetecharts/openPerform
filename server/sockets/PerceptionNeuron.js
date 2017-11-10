var WebSocket = require('ws');
var _ = require('lodash');

var config = require('./../config.js').perceptionNeuron;

class PerceptionNeuron {
	constructor() {
		this.url = 'ws://'+config.ip+':' + config.ports.incoming + "/service";

		this.createListenServer();
		this.createBroadcastServer();
	}

	createBroadcastServer() {
		console.log('Perception Neuron Server broadasting on ' + config.ports.outgoing);
		this.wss = new WebSocket.Server({ port: config.ports.outgoing });
		this.wss.on('connection', this.onBroadcastConnection.bind(this));
		this.wss.on('error', this.onBroadcastError.bind(this));
		this.wss.on('listening', this.onBroadcastListening.bind(this));
	}

	createListenServer() {
		console.log('Connecting to the Perception Neuron at ' + this.url);
		this.ws = new WebSocket(this.url);
		this.ws.on('open', this.onListenOpen.bind(this));
		this.ws.on('message', this.onListenMessage.bind(this));
		this.ws.on('error', this.onListenError.bind(this));
	}

	onBroadcastConnection() {
		console.log('Perception Neuron Server Connected!');
	}
	
	onBroadcastError() {
		console.log('Perception Neuron Server Error!');
	}
	
	onBroadcastListening() {
		console.log('Perception Neuron Server Listening!');
	}

	onListenOpen() {
		console.log('Perception Neuron Connected!');
	}
	
	onListenClose() {
		console.log('Perception Neuron Disconnected!');
	}
	
	onListenError(err) {
		console.log('Perception Neuron Error ', err);
		// console.log('Trying again in 3000ms');
		// setTimeout(this.createListenServer.bind(this), 3000);
	}
	
	onListenMessage(msg) {
		this.broadcast(msg);
	}
	
	broadcast(data) {
		this.wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				try {
					client.send(data, this.onError);
				}
				catch(err) {
					this.onError(err);
				}
				finally {}
			}
		}.bind(this));
	}
}

module.exports = PerceptionNeuron;