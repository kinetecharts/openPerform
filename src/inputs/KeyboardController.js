// Mousetrap Source: https://github.com/ccampbell/mousetrap

import _ from 'lodash'
import Mousetrap from 'mousetrap'

class KeyboardController {
	constructor() {
		this.callbacks = {};
	}

	on(name, cb) {
		this.callbacks[name] = cb;
		this.initCallbacks();
	}

	initCallbacks() {
		_.forEach(this.callbacks, this.initCallback.bind(this));
	}

	initCallback(cb, name) {
		Mousetrap.bind(name, cb);
	}
}

module.exports = KeyboardController;