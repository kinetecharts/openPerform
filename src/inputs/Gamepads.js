import _ from 'lodash';

class Gamepads {
	constructor(url) {
		this.callbacks = {};
		this.connected = false;
		this.websocket = null;

		this.initializeWebSocket(url);
		// this.update();
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

		this.send(navigator.getGamepads());
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
		if (this.connected /*&& _.filter(msg).length>0*/) {
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
		this.send(navigator.getGamepads());
		requestAnimationFrame(this.update.bind(this));
	}
}

module.exports = Gamepads;