import _ from 'lodash';

class Gamepads {
	constructor(url) {
		this.callbacks = {};
		this.connected = false;
		this.websocket = null;

		this.initializeWebSocket(url);
		this.update();
	}

	initializeWebSocket(url) {
		console.log("Gamepad Server connecting to: ", url);

		this.websocket = new WebSocket(url);
		this.websocket.onopen = this.onOpen.bind(this);
		this.websocket.onclose = this.onClose.bind(this);
		this.websocket.onmessage = this.onMessage.bind(this);
		this.websocket.onerror = this.onError.bind(this);
	}


	onOpen(evt) {
		console.log('Gamepad Server connected:', evt);
		this.connected = true;
	}

	onClose(evt) {
		console.log('Gamepad Server disconnected:', evt);
		this.connected = false;
	}
	
	onMessage(msg) {
		console.log(JSON.parse(msg.data));
	}

	onError(evt) {
		console.log('Gamepad Server error:', evt);
	}

	on(name, cb) {
		this.callbacks[name] = cb;
	}

	send(msg) {
		if (this.connected) {
			try {
				this.websocket.send(JSON.stringify(msg), this.onError);
			}
			catch(err) {
				this.onError(err);
			}
			finally {}

		}
	}

	update() {
		var gamepads = navigator.getGamepads();
		if (_.filter(gamepads).length>0) {
			this.send(gamepads);
		}
		requestAnimationFrame(this.update.bind(this));
	}
}

module.exports = Gamepads;