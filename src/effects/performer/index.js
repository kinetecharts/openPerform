import _ from 'lodash'

import ParticleSystem from './ParticleSystem'

import config from './../../config'

class PerformerEffects {
	constructor(parent, color, guiFolder) {
		this.parent = parent;
		this.effects = [];
		this.color = color;
		this.guiFolder = guiFolder;
	}

	add(effect) {
		switch(effect) {
			default:
				this.effects.push(new ParticleSystem(this.parent, this.color, this.guiFolder));
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