import _ from 'lodash'

import ParticleSystem from './ParticleSystem'

import config from './../../config'

class PerformerEffects {
	constructor(parent) {
		this.parent = parent;
		this.effects = [];
	}

	add(effect) {
		switch(effect) {
			default:
				this.effects.push(new ParticleSystem(this.parent));
			break;
		}
		console.log(this.effects);
	}

	update(data) {
		_.each(this.effects, function(effect) {
			effect.update(data);
		});
	}
}

module.exports = PerformerEffects;