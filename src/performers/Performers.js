//Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js
import _ from 'lodash'
import dat from 'dat-gui'

import Performer from './Performer'
import GroupEffects from './../effects/group'

import config from './../config'

class Performers {
	constructor() {
		this.performers = {};
	}
	init(parent) {
		this.parent = parent;
		this.colors = config.performerColors;

		this.gui = new dat.GUI();
		this.guiDOM = this.gui.domElement;
		this.guiFolder = this.gui.addFolder('Group Effects');
		this.guiFolder.open()

		this.groupEffects = new GroupEffects(this.parent, this.colors, this.guiFolder);
	}

	exists(inputId) {
		return _.has(this.performers, inputId);
	}

	add(inputId, type) {
		if (this.performers && !this.performers[inputId] && this.colors) {
			this.performers[inputId] = new Performer(this.parent, inputId, _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length]);
			// if (_.size(this.performers)>1) {
			// 	this.addEffects(["line"]);
			// }
		}
	}

	remove (inputId) {
		if (this.performers[inputId]) {
			delete this.performers[inputId];
		}
	}

	getPerformers() {
		return _.map(this.performers, function(p) {
			return {
				name: p.name + ' (' + p.type + ')',
				color: '#' + p.color,
				gui: p.guiDOM
			};
		});
	}

	addEffects(effects) {
		_.each(effects, (effect) => {
			this.addEffect(effect);
		});
	}

	addEffect(effect) {
		switch(effect) {
			case 'line':
				this.groupEffects.add("line");
			break;
		}
	}

	updateParameters(data) {
		_.each(this.performers, function(performer) {
			performer.updateParameters(data);
		});
	}

	update(inputId, data) {
		if (this.performers[inputId]) {
			this.performers[inputId].update(data);
		}

		this.groupEffects.update(this.performers);
	}
}

module.exports = Performers;