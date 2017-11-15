// Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js
import _ from 'lodash';
import dat from 'dat-gui';

import Performer from './Performer';
import GroupEffects from './../effects/group';

import config from './../config';

class Performers {
  constructor() {
    this.performers = {};
    this.dataBuffer = [];
  }
  init(parent, colors) {
    this.parent = parent;
    this.colors = colors;

    // this.gui = new dat.GUI();
    // this.guiDOM = this.gui.domElement;
    // this.guiFolder = this.gui.addFolder('Group Effects');
    // this.guiFolder.open()

    this.groupEffects = new GroupEffects(this.parent, this.colors, this.guiFolder);
  }

  exists(inputId) {
    return _.has(this.performers, inputId);
  }

  getPosition() {
    var defaultDistance = 3;
    if (_.size(this.performers)==0) {
      return 0;
    } else if (_.size(this.performers)==1) {
      return -(_.size(this.performers)*defaultDistance);
    } else {
      switch(_.size(this.performers)%2) {
        case 0:
          return ((_.size(this.performers)/2)*defaultDistance);
          break;
        case 1:
          // return -(_.size(this.performers)*2);
          return -(_.size(this.performers)*2);
          break;
      }
    }
  }

  add(inputId, type, actions) {
    if (this.performers && !this.performers[inputId] && this.colors) {
      this.performers[inputId] = new Performer(
        this.parent,
        inputId,
        _.size(this.performers) + 1,
        type,
        this.colors[_.size(this.performers) % this.colors.length],
        true,
        actions,
        this.getPosition()
      );
      // this.performers[inputId+"_-1"] = new Performer(this.parent, inputId+"_-1", _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], -1, true);
      // this.performers[inputId+"_1"] = new Performer(this.parent, inputId+"_1", _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], 1, true);
      // this.performers[inputId+"_-2"] = new Performer(this.parent, inputId+"_-2", _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], -2, true);
      // this.performers[inputId+"_2"] = new Performer(this.parent, inputId+"_2", _.size(this.performers)+1, type, this.colors[_.size(this.performers)%this.colors.length], 2, true);
      // if (_.size(this.performers)>1) {
      // 	this.addEffects(["line"]);
      // }
    }
  }

  remove(inputId) {
    if (this.exists(inputId)) {
      this.performers[inputId].clearScene();
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
    switch (effect) {
      case 'line':
        this.groupEffects.add('line');
        break;
    }
  }

  showWireframe() {
    _.each(this.performers, (performer) => {
      performer.showWireframe();
    });
  }

  hideWireframe() {
    _.each(this.performers, (performer) => {
      performer.hideWireframe();
    });
  }

  clearTracking() {
  	_.each(this.performers, (performer) => {
      performer.clearTracking();
    });
  }

  setColors(colors) {
  	this.colors = colors;
  }

  updateColors(colors) {
    var c = colors.slice();
    _.each(this.performers, (performer) => {
      performer.setColor(c.shift());
    });
  }

  updateParameters(data) {
    _.each(this.performers, (performer) => {
      performer.updateParameters(data);
    });
  }

  update(inputId, data) {
    // if (this.performers[inputId]) {
    // 	this.performers[inputId].update(data);
    // }

    _.each(this.performers, (p) => {
      p.update(data);
    });

    this.groupEffects.update(this.performers);
  }
}

module.exports = Performers;
