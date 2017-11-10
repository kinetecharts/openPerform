var WebSocket = require('ws');
var _ = require('lodash');

var config = require('./../config.js').midiController;

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

module.exports = MidiController;