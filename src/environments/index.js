import _ from 'lodash';
import dat from 'dat-gui';

import MuseEnvironment from './museEnvironment';
import IslandEnvironment from './islandEnvironment';
import GridEnvironment from './gridEnvironment';
import GradientEnvironment from './gradientEnvironment';
import WaterEnvironment from './waterEnvironment';

import config from './../config';

class Environments {
  constructor(renderer, parent, performers) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;

    this.environments = [];

    this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
    this.guiDOM = this.gui.domElement;
    // this.guiFolder = this.gui.addFolder('Environments');
    // this.guiFolder.open();

    this.add('grid-dark'); // default
  }

  getEnvironments() {
    return this.environments;
  }

  add(type) {
    this.removeAll();
    switch (type) {
      case 'muse':
        this.environments.push(new MuseEnvironment(this.renderer, this.parent, this.performers, this.guiFolder, 'dark'));
        break;
      case 'island':
        this.environments.push(new IslandEnvironment(this.renderer, this.parent, this.performers, this.guiFolder));
        break;
      case 'water':
        this.environments.push(new WaterEnvironment(this.renderer, this.parent, this.guiFolder));
        break;
      case 'grid-dark':
        this.environments.push(new GridEnvironment(this.renderer, this.parent, this.performers, 'dark'));
        break;
      case 'grid-light':
        this.environments.push(new GridEnvironment(this.renderer, this.parent, this.performers, this.guiFolder, 'light'));
        break;
      case 'gradient':
        this.environments.push(new GradientEnvironment(this.renderer, this.parent, this.performers, this.guiFolder));
        break;
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
