const WebSocket = require('ws');
const _ = require('lodash');

const config = require('./../config.js').perceptionNeuron;

class PerceptionNeuron {
	constructor() {
		this.url = 'ws://'+config.ip+':' + config.ports.incoming + "/service";

		console.log("Connecting to the Perception Neuron at " + this.url);
		this.ws = new WebSocket(this.url);
		this.ws.on('open', this.onOpen.bind(this));
		this.ws.on('close', this.onClose.bind(this));
		this.ws.on('message', this.onMessage.bind(this));
		this.ws.on('error', this.onError.bind(this));
	}
	onOpen() {
		console.log("Perception Neuron Connected!");
		this.wss = new WebSocket.Server({ port: config.ports.outgoing });
	}
	onClose() {
		console.log('disconnected');
	}
	onError(err) {
		console.log(err);
	}
	onMessage(msg) {
		this.broadcast(msg);
	}
	broadcast(data) {
		this.wss.clients.forEach(function each(client) {
			if (client.readyState === WebSocket.OPEN) {
				client.send(data);
			}
		});
	}
}

module.exports = PerceptionNeuron;