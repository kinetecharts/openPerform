/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:56:31
 * @modify date 2018-08-31 04:56:31
 * @desc [Environment switcher.]
*/

import _ from 'lodash';
import dat from 'dat-gui';

import MuseEnvironment from './museEnvironment';
import IslandEnvironment from './islandEnvironment';
import GridEnvironment from './gridEnvironment';
import GradientEnvironment from './gradientEnvironment';
import WaterEnvironment from './waterEnvironment';
import EmptyEnvironment from './emptyEnvironment';
import ForestEnvironment from './forestEnvironment';

import config from './../config';

class Environments {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaultEnvironment = config.defaults.environment.toLowerCase();

    this.currentEnvironment = this.defaultEnvironment;
    console.log("Loading default environment: ", this.currentEnvironment);
    this.availEnvironments = config.availEnvironments;
    this.environments = [];

    this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
    this.guiDOM = this.gui.domElement;
    // this.guiFolder = this.gui.addFolder('Environments');
    // this.guiFolder.open();

    this.add(this.defaultEnvironment, defaults); // default
  }

  getEnvironments() {
    return this.environments;
  }

  updateEnvironment(val) {
    this.add(this.availEnvironments[val]);
  }

  add(type, defaults) {
    this.removeAll();
    switch (type) {
      case 'forest':
        this.environments.push(new ForestEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'muse':
        this.environments.push(new MuseEnvironment(this.renderer, this.parent, this.performers, defaults, 'dark'));
        break;
      case 'island':
        this.environments.push(new IslandEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'water':
        this.environments.push(new WaterEnvironment(this.renderer, this.parent, defaults));
        break;
      case 'grid':
        this.environments.push(new GridEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'gradient':
        this.environments.push(new GradientEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'empty':
        this.environments.push(new EmptyEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
    }
    this.currentEnvironment = type;
  }

  removeAll() {
    _.each(this.environments, (environment) => {
      if (environment) {
        environment.remove();
      }
    });
    this.environments = [];
  }

  remove(inputId) {
    if (this.environments[inputId]) {
      this.environments[inputId].remove();
      delete this.environments[inputId];
    }
  }

  exists(inputId) {
    return _.has(this.environments, inputId);
  }

  toggle(variableName) {
    _.each(this.environments, (environment) => {
      environment.toggle(variableName);
    });
  }

  updateColors(bg) {
    _.each(this.environments, (environment) => {
      environment.updateBackgroundColor(bg);
    });
  }

  updateParameters(data) {
    _.each(this.environments, (environment) => {
      environment.updateParameters(data);
    });
  }

  update(data) {
    _.each(this.environments, (environment) => {
      environment.update(data);
    });
  }
}

module.exports = Environments;
