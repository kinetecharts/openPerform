import _ from 'lodash';



class MidiController {
	constructor(url) {
		this.callbacks = {};
		this.connected = false;
		this.websocket = null;

		this.initializeWebSocket(url);
		this.initializeMidi();
	}

	initializeMidi() {
		if (navigator.requestMIDIAccess) {
			window.navigator.requestMIDIAccess().then(this.onMIDISuccess.bind(this), this.onMIDIFailure.bind(this))
		} else {
			console.log('No MIDI support in your browser.')
		}
	}

	onMIDIFailure(err) {
		console.log("Midi connection failure: ", err);
	}

	onMIDISuccess(conn) {
		conn.inputs.forEach(function(port){
			console.log('Midi controller found: ', port);
			port.onmidimessage = this.onMidiIn.bind(this);
			port.onstatechange = this.onStateChange.bind(this);
		}.bind(this));
	}

	onMidiIn(msg) {
		this.websocket.send(JSON.stringify({
			device: msg.data[0],
			note: msg.data[1],
			value: msg.data[2]
		}), this.onError);
	}

	onStateChange(msg) {
		console.log("New midi state: ", msg);
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
		this.callbacks["message"](JSON.parse(msg.data));
	}

	onError(evt) {
		console.log('Gamepad Server error:', evt);
	}

	on(name, cb) {
		this.callbacks[name] = cb;
	}
}

module.exports = MidiController;