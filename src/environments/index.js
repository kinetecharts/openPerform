/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:56:31
 * @modify date 2018-08-31 04:56:31
 * @desc [Environment switcher.]
*/

import GridEnvironment from './GridEnvironment';
import WaterEnvironment from './WaterEnvironment';
import EmptyEnvironment from './EmptyEnvironment';
import ForestEnvironment from './ForestEnvironment';
import SpaceEnvironment from './SpaceEnvironment';
import SpaceStationEnvironment from './SpaceStationEnvironment';
import SolarSystemEnvironment from './SolarSystemEnvironment';
import ForestMonsterEnvironment from './ForestMonsterEnvironment';
import KidsRoomEnvironment from './KidsRoomEnvironment';

import TestEnvironment from './TestEnvironment';

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

    this.add('kids_room', this.defaults); // default
    // this.add('space_station', this.defaults); // default
    // this.add('forest_monster', this.defaults); // default
  }

  getEnvironments() {
    return this.environments;
  }

  toggleEnvironment(val) {
    this.hideAll();
    this.show(val);
  }
  
  updateEnvironment(val) {
    this.add(this.availEnvironments[val], this.defaults);
  }

  add(type, defaults) {
    // this.removeAll();
    switch (type) {
      case 'kids_room':
        this.environments.push(new KidsRoomEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
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
      case 'space_station':
        this.environments.push(new SpaceStationEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'solar_system':
        this.environments.push(new SolarSystemEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'forest_monster':
        this.environments.push(new ForestMonsterEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
      case 'test':
        this.environments.push(new TestEnvironment(this.renderer, this.parent, this.performers, defaults));
        break;
    }
    this.currentEnvironment = type;
  }

  hideAll() {
    _.each(this.environments, (environment) => {
      environment.setVisible(false);
    });
  }

  hide(inputId) {
    if (this.environments[inputId]) {
      this.environments[inputId].setVisible(false);
    }
  }

  showAll() {
    _.each(this.environments, (environment) => {
      environment.setVisible(true);
    });
  }

  show(inputId) {
    if (this.environments[inputId]) {
      this.environments[inputId].setVisible(true);
    }
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
