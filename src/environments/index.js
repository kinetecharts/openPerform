import _ from 'lodash'
import dat from 'dat-gui'

import GridEnvironment from './gridEnvironment'
import GradientEnvironment from './gradientEnvironment'

import config from './../config'

class Environments {
	constructor(parent) {
		this.parent = parent;
		this.environments = [];
		
		this.gui = new dat.GUI();
		this.guiDOM = this.gui.domElement;
		this.guiFolder = this.gui.addFolder('Environments');
		this.guiFolder.open()

		this.add("grid"); //default
	}

	add(type) {
		this.removeAll();
		switch(type) {
			case 'grid':
				this.environments.push(new GridEnvironment(this.parent, this.guiFolder));
			break;
			case 'gradient':
				this.environments.push(new GradientEnvironment(this.parent, this.guiFolder));
			break;
		}
		console.log(this.environments);
	}

	removeAll () {
		_.each(this.environments, function(environment) {
			if (environment) {
				environment.remove();
			}
		}.bind(this));
		this.environments = [];
	}

	remove (inputId) {
		if (this.environments[inputId]) {
			this.environments[inputId].remove();
			delete this.environments[inputId];
		}
	}

	exists(inputId) {
		return _.has(this.environments, inputId);
	}

	update(data) {
		_.each(this.environments, function(environment) {
			environment.update(data);
		});
	}
}

module.exports = Environments;