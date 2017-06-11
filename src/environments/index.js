import _ from 'lodash'
import dat from 'dat-gui'

import IslandEnvironment from './islandEnvironment'
import GridEnvironment from './gridEnvironment'
import GradientEnvironment from './gradientEnvironment'

import config from './../config'

class Environments {
	constructor(renderer, parent, performers) {
		this.renderer = renderer;
		this.parent = parent;
		this.performers = performers;

		this.environments = [];
		
		this.gui = new dat.GUI();
		this.guiDOM = this.gui.domElement;
		this.guiFolder = this.gui.addFolder('Environments');
		this.guiFolder.open()

		this.add("island"); //default
	}

	add(type) {
		this.removeAll();
		switch(type) {
			case 'island':
				this.environments.push(new IslandEnvironment(this.renderer, this.parent, this.performers, this.guiFolder));
			break;
			case 'grid-dark':
				this.environments.push(new GridEnvironment(this.renderer, this.parent, this.performers, this.guiFolder, "dark"));
			break;
			case 'grid-light':
				this.environments.push(new GridEnvironment(this.renderer, this.parent, this.performers, this.guiFolder, "light"));
			break;
			case 'gradient':
				this.environments.push(new GradientEnvironment(this.renderer, this.parent, this.performers, this.guiFolder));
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