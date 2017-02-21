//Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js
import _ from 'lodash'

import Performer from './Performer'

import config from './../../config'

class Performers {
	constructor(parent) {
		this.parent = parent;
		this.list = {};
		this.colors = config.performerColors;
	}

	exists(inputId) {
		return _.has(this.list, inputId);
	}

	add(inputId, type) {
		if (!this.list[inputId]) {
			this.list[inputId] = new Performer(this.parent, inputId, _.size(this.list)+1, type, this.colors[_.size(this.list)%this.colors.length]);
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
				color: p.color
			};
		});
	}

	update(inputId, data) {
		if (this.list[inputId]) {
			this.list[inputId].update(data);
		}
	}
}

module.exports = Performers;