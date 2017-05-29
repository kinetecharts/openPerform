//Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js
import _ from 'lodash'
import dat from 'dat-gui'

import Performer from './Performer'
import GroupEffects from './../effects/group'

import config from './../config'

class Performers {
	constructor(parent) {
		this.parent = parent;
		this.list = {};
		this.colors = config.performerColors;

		this.gui = new dat.GUI();
		this.guiDOM = this.gui.domElement;
		this.guiFolder = this.gui.addFolder('Group Effects');
		this.guiFolder.open()

		this.groupEffects = new GroupEffects(this.parent, this.colors, this.guiFolder);
	}

	exists(inputId) {
		return _.has(this.list, inputId);
	}

	add(inputId, type) {
		if (!this.list[inputId]) {
			this.list[inputId] = new Performer(this.parent, inputId, _.size(this.list)+1, type, this.colors[_.size(this.list)%this.colors.length]);
			if (_.size(this.list)>1) {
				this.addEffects(["line"]);
			}
		}
	}

	remove (inputId) {
		if (this.list[inputId]) {
			delete this.list[inputId];
		}
	}

	getPerformers() {
		return _.map(this.list, function(p) {
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

	update(inputId, data) {
		if (this.list[inputId]) {
			this.list[inputId].update(data);
		}

		this.groupEffects.update(this.list);
	}
}

module.exports = Performers;