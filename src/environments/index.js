/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:56:31
 * @modify date 2018-08-31 04:56:31
 * @desc [Environment switcher.]
*/

import GridEnvironment from 'GridEnvironment';
import WaterEnvironment from 'WaterEnvironment';
import EmptyEnvironment from 'EmptyEnvironment';
import ForestEnvironment from 'ForestEnvironment';
import SpaceEnvironment from 'SpaceEnvironment';

import config from './../config';

class Environments {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.defaultEnvironment = config.defaults.environment.toLowerCase();

    this.currentEnvironment = this.defaultEnvironment;
    console.log("Loading default environment: ", this.currentEnvironment);
    this.availEnvironments = config.availEnvironments;
    this.environments = [];

    this.updateEnvironment = this.updateEnvironment.bind(this);

    this.add(this.defaultEnvironment, this.defaults); // default
  }

  getEnvironments() {
    return this.environments;
  }

  updateEnvironment(val) {
    this.add(this.availEnvironments[val], this.defaults);
  }

  add(type, defaults) {
    this.removeAll();
    switch (type) {
      case 'forest':
        this.environments.push(new ForestEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'water':
        this.environments.push(new WaterEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'grid':
        this.environments.push(new GridEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'empty':
        this.environments.push(new EmptyEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'space':
        this.environments.push(new SpaceEnvironment(this.renderer, this.parent, this.performers, defaults));
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

  updateLightPosition(x, z) {
    _.each(this.environments, (environment) => {
      environment.updateLightPosition(x, z);
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
