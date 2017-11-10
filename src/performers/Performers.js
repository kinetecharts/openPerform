//Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js
import _ from 'lodash'
import dat from 'dat-gui'

import Performer from './Performer'
import GroupEffects from './../effects/group'

import config from './../config'

class Performers {
	constructor() {
		this.performers = {};
		this.dataBuffer = [];
	}
	init(parent) {
		this.parent = parent;
		this.colors = config.performerColors;

		// this.gui = new dat.GUI();
		// this.guiDOM = this.gui.domElement;
		// this.guiFolder = this.gui.addFolder('Group Effects');
		// this.guiFolder.open()

		this.groupEffects = new GroupEffects(this.parent, this.colors, this.guiFolder);
	}

	exists(inputId) {
		return _.has(this.performers, inputId);
	}

	add(inputId, type, actions) {
		if (this.performers && !this.performers[inputId] && this.colors) {
			this.performers[inputId] = new Performer(this.parent, inputId, _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], 0, true, actions);
			// this.performers[inputId+"_-1"] = new Performer(this.parent, inputId+"_-1", _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], -1, true);
			// this.performers[inputId+"_1"] = new Performer(this.parent, inputId+"_1", _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], 1, true);
			// this.performers[inputId+"_-2"] = new Performer(this.parent, inputId+"_-2", _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], -2, true);
			// this.performers[inputId+"_2"] = new Performer(this.parent, inputId+"_2", _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], 2, true);
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
		return _.map(this.performers);
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

	showWireframe() {
		_.each(this.performers, function(performer) {
			performer.showWireframe();
		});
	}

	hideWireframe() {
		_.each(this.performers, function(performer) {
			performer.hideWireframe();
		});
	}

	updateParameters(data) {
		_.each(this.performers, function(performer) {
			performer.updateParameters(data);
		});
	}

	update(inputId, data) {
		// if (this.performers[inputId]) {
		// 	this.performers[inputId].update(data);
		// }

		var idx = 0;
		_.each(this.performers, (p) => {
			// p.updateOffsetScale(Math.sin());
			p.dataBuffer.push(data);
			// console.log(p.dataBuffer.length);
			if (p.dataBuffer.length > (500*idx)+1) {
				p.update(p.dataBuffer.shift());
			}
			idx++;
		});

		this.groupEffects.update(this.performers);
	}
}

module.exports = Performers;