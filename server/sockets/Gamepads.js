var WebSocket = require('ws');
var _ = require('lodash');

var config = require('./../config.js').gamepads;

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

module.exports = Gamepads;