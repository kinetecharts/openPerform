/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 10:45:52
 * @modify date 2018-09-02 10:45:52
 * @desc [description]
*/

// Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js

import Performer from './Performer';
import GroupEffects from './../effects/group';

import config from './../config';

class Performers {
  constructor(inputManager, outputManager) {
    this.inputManager = inputManager;
    this.outputManager = outputManager;

    this.charOffset = { z: 12.65, y: 0 };
    this.characters = [
      {
        name: 'robot',
        offset: { x: 3, y: this.charOffset.y, z: this.charOffset.z },
        scale: 2, headScale: 2, headOffset: { x: 3, y: 0.15, z: 12.5 },
        effect: 'Data Tags', color: 0x6e6e6e,
        boneType: 'box',
        bones: {
          'SpineBase': {color: 0x6e6e6e, x: 0.11, z: 0.11},
          'SpineMid': {color: 0x6e6e6e, x: 0.2, z: 0.175},

          'Neck': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          'Head': {color: 0x6e6e6e, x: 0.04, z: 0.04},

          'ShoulderLeft': {color: 0x6e6e6e, x: 0.06, z: 0.06},
          'ElbowLeft': {color: 0x6e6e6e, x: 0.04, z: 0.06},
          'WristLeft': {color: 0x015f8a, x: 0.05, z: 0.04},
          'HandLeft': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          
          'ShoulderRight': {color: 0x6e6e6e, x: 0.06, z: 0.06},
          'ElbowRight': {color: 0x6e6e6e, x: 0.04, z: 0.06},
          'WristRight': {color: 0x015f8a, x: 0.05, z: 0.04},
          'HandRight': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          
          'HipLeft': {color: 0x6e6e6e, x: 0.08, z: 0.08},
          'KneeLeft': {color: 0x6e6e6e, x: 0.06, z: 0.08},
          'AnkleLeft': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          'FootLeft': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          
          'HipRight': {color: 0x6e6e6e, x: 0.08, z: 0.08},
          'KneeRight': {color: 0x6e6e6e, x: 0.06, z: 0.08},
          'AnkleRight': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          'FootRight': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          
          'SpineShoulder': {color: 0x015f8a, x: 0.2, z: 0.2},
          
          'HandTipLeft': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          'ThumbLeft': {color: 0x6e6e6e, x: 0.02, z: 0.02},

          'HandTipRight': {color: 0x6e6e6e, x: 0.02, z: 0.02},
          'ThumbRight': {color: 0x6e6e6e, x: 0.02, z: 0.02},
        }
      },
      {
        name: 'astronaut',
        offset: { x: 0, y: this.charOffset.y, z: this.charOffset.z },
        scale: 2, headScale: 0.625, headOffset: { x: 0, y: 0.4, z: 12.5 },
        effect: 'Ghosting', color: 0x888888,
        boneType: 'cylinder',
        bones: {
          'SpineBase': {color: 0x888888, x: 0.11, z: 0.11},
          'SpineMid': {color: 0x888888, x: 0.2, z: 0.15},

          'Neck': {color: 0x888888, x: 0.02, z: 0.02},
          'Head': {color: 0x888888, x: 0.04, z: 0.04},

          'ShoulderLeft': {color: 0x888888, x: 0.06, z: 0.06},
          'ElbowLeft': {color: 0x888888, x: 0.04, z: 0.06},
          'WristLeft': {color: 0x2e2e23, x: 0.05, z: 0.04},
          'HandLeft': {color: 0x888888, x: 0.02, z: 0.02},
          
          'ShoulderRight': {color: 0x888888, x: 0.06, z: 0.06},
          'ElbowRight': {color: 0x888888, x: 0.04, z: 0.06},
          'WristRight': {color: 0x2e2e23, x: 0.05, z: 0.04},
          'HandRight': {color: 0x888888, x: 0.02, z: 0.02},
          
          'HipLeft': {color: 0x888888, x: 0.08, z: 0.08},
          'KneeLeft': {color: 0x888888, x: 0.06, z: 0.08},
          'AnkleLeft': {color: 0x888888, x: 0.02, z: 0.02},
          'FootLeft': {color: 0x888888, x: 0.02, z: 0.02},
          
          'HipRight': {color: 0x888888, x: 0.08, z: 0.08},
          'KneeRight': {color: 0x888888, x: 0.06, z: 0.08},
          'AnkleRight': {color: 0x888888, x: 0.02, z: 0.02},
          'FootRight': {color: 0x888888, x: 0.02, z: 0.02},
          
          'SpineShoulder': {color: 0x888888, x: 0.175, z: 0.2},
          
          'HandTipLeft': {color: 0x888888, x: 0.02, z: 0.02},
          'ThumbLeft': {color: 0x888888, x: 0.02, z: 0.02},

          'HandTipRight': {color: 0x888888, x: 0.02, z: 0.02},
          'ThumbRight': {color: 0x888888, x: 0.02, z: 0.02},
        }
      },
      {
        name: 'alien',
        offset: { x: -3, y: this.charOffset.y, z: this.charOffset.z },
        scale: 2, headScale: 0.175, headOffset: { x: -3, y: 0.4, z: 12.5 },
        effect: 'Particles', color: 0x3d4034,
        boneType: 'poly',
        bones: {
          'SpineBase': {color: 0x3d4034, x: 0.11, z: 0.11},
          'SpineMid': {color: 0x3d4034, x: 0.1125, z: 0.15},
          'Neck': {color: 0x3d4034, x: 0.02, z: 0.02},
          'Head': {color: 0x3d4034, x: 0.04, z: 0.04},

          'ShoulderLeft': {color: 0x3d4034, x: 0.04, z: 0.06},
          'ElbowLeft': {color: 0x3d4034, x: 0.02, z: 0.04},
          'WristLeft': {color: 0x24261f, x: 0.03, z: 0.02},
          'HandLeft': {color: 0x3d4034, x: 0.02, z: 0.02},
          
          'ShoulderRight': {color: 0x3d4034, x: 0.04, z: 0.06},
          'ElbowRight': {color: 0x3d4034, x: 0.02, z: 0.04},
          'WristRight': {color: 0x24261f, x: 0.03, z: 0.02},
          'HandRight': {color: 0x3d4034, x: 0.02, z: 0.02},
          
          'HipLeft': {color: 0x3d4034, x: 0.06, z: 0.06},
          'KneeLeft': {color: 0x3d4034, x: 0.04, z: 0.06},
          'AnkleLeft': {color: 0x3d4034, x: 0.02, z: 0.02},
          'FootLeft': {color: 0x3d4034, x: 0.02, z: 0.02},
          
          'HipRight': {color: 0x3d4034, x: 0.06, z: 0.06},
          'KneeRight': {color: 0x3d4034, x: 0.04, z: 0.06},
          'AnkleRight': {color: 0x3d4034, x: 0.02, z: 0.02},
          'FootRight': {color: 0x3d4034, x: 0.02, z: 0.02},
          
          'SpineShoulder': {color: 0x3d4034, x: 0.19, z: 0.1125},
          
          'HandTipLeft': {color: 0x3d4034, x: 0.02, z: 0.02},
          'ThumbLeft': {color: 0x3d4034, x: 0.02, z: 0.02},
          'HandTipRight': {color: 0x3d4034, x: 0.02, z: 0.02},
          'ThumbRight': {color: 0x3d4034, x: 0.02, z: 0.02},
        }
      },
    ];
    
    window.performers = this.performers = {};
    this.dataBuffer = [];
  }
  init(parent, scene) {
    this.parent = parent;
    this.colors = config.performerColors;

    this.scene = scene;

    // this.gui = new dat.GUI();
    // this.guiDOM = this.gui.domElement;
    // this.guiFolder = this.gui.addFolder('Group Effects');
    // this.guiFolder.open()

    this.groupEffects = new GroupEffects(this.parent, this.colors, this.guiFolder);
  }

  exists(inputId) {
    return _.has(this.performers, inputId);
  }

  add(inputId, type, leader, actions, options) {
    if (this.performers && !this.performers[inputId] && this.colors) {
      let performerLimit = 3;
      if (_.size(this.performers) < performerLimit) {
        (options == null) ? options = _.cloneDeep(config.defaults.performer) : null;
        (options.color == null) ? options.color = this.colors[_.size(this.performers) % this.colors.length] : null;
        this.performers[inputId] = new Performer(
          this.parent,
          inputId,
          _.size(this.performers) + 1,
          type,
          leader,
          actions,
          this.inputManager,
          this.outputManager,
          options,
          this.characters[_.size(this.performers)], //Math.floor(Math.random()*this.characters.length)
          this.scene,
        );
        console.log('Added performer: ', _.size(this.performers));
      }
    }
  }

  remove(inputId) {
    if (this.exists(inputId)) {
      this.performers[inputId].clearScene();
      delete this.performers[inputId];
      console.log('Removed performer: ', _.size(this.performers));
    }
  }

  getAllPerformers() {
    _.map(this.getCloneGroups(), (performerGroup, idx) => {
      _.map(performerGroup);
    })
  }

  getPerformers() {
    return _.map(this.performers);
  }

  getPerformer(id) {
    return this.performers[id];
  }

  togglePerformers() {
    _.each(this.performers, (performer) => {
      performer.toggleVisible();
    });
  }

  togglePerformer(id) {
    this.getPerformer(id).toggleVisible();
  }

  showPerformers() {
    _.each(this.performers, (performer) => {
      performer.setVisible(true);
    });
  }

  showPerformer(id) {
    this.getPerformer(id).setVisible(true);
  }

  hidePerformers() {
    _.each(this.performers, (performer) => {
      performer.setVisible(false);
    });
  }

  hidePerformer(id) {
    this.getPerformer(id).setVisible(true);
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

  clearSnorried() {
  	_.each(this.performers, (performer) => {
      performer.clearSnorried();
    });
  }

  clearFirstPersoned() {
  	_.each(this.performers, (performer) => {
      performer.clearFirstPersoned();
    });
  }

  clearFollowing() {
  	_.each(this.performers, (performer) => {
      performer.clearFollowing();
    });
  }

  updateParameters(data) {
    _.each(this.performers, (performer) => {
      performer.updateParameters(data);
    });
  }

  removeAllEffects() {
    _.each(this.performers, (performer) => {
      performer.removeEffects(performer.effects);
    });
  }

  addEffectsToClonesById(id, effect) {
    _.each(this.getCloneGroups()[id], (p) => {
      p.addEffect(effect);
    });
  }

  addEffectsToPerformer(id, effect) {
    this.getPerformer(id).addEffect(effect);
  }

  toggleClonesById(id) {
    _.each(this.getCloneGroups()[id], (p) => {
      p.toggleVisible();
    });
  }

  showClonesById(id) {
    _.each(this.getCloneGroups()[id], (p) => {
      p.setVisible(true);
    });
  }

  hideClonesById(id) {
    _.each(this.getCloneGroups()[id], (p) => {
      p.setVisible(false);
    });
  }

  getCloneGroups() {
    return _.pickBy(_.groupBy(this.performers, (p) => {
      if (p.leader == null || p.leader == undefined) {
        return null;
      }
      return p.leader.inputId;
    }), function(value, key) {
      return (key !== null
        && key !== 'null'
        && key !== undefined
        && key !== 'undefined');
    })
  }

  circleClonesById(id) {
    let s = 1;
    _.each(this.getCloneGroups()[id], (performer) => {
      let rot = new THREE.Euler();//performer.getRotation();
      rot.y = parseFloat(s);
      performer.resetRotation();
      performer.resetOffset();
      performer.resetPosition();
      performer.setRotation(rot.clone());
      s++;
    });
  }

  resetClonesPositionById(id) {
    _.each(this.getCloneGroups()[id], (performer) => {
      performer.resetPosition();
    });
  }

  resetClonesRotationById(id) {
    _.each(this.getCloneGroups()[id], (performer) => {
      performer.resetRotation();
    });
  }

  spreadClonesById(id, val) {
    let v = val.clone();
    let s = 1;
    _.each(this.getCloneGroups()[id], (performer) => {
      v.setX(val.x * s);
      v.setY(val.y * s);
      v.setZ(val.z * s);
      performer.resetRotation();
       performer.resetOffset();
      performer.resetPosition();
      performer.setOffset(v);
      s++;
    });
  }

  spreadAll(val) {
    _.each(this.getCloneGroups(), (performerGroup, idx) => {
      let v = val.clone();
      let s = 1;
      _.each(performerGroup, (performer) => {
        v.setX(val.x * s);
        v.setY(val.y * s);
        v.setZ(val.z * s);
        performer.resetRotation();
        performer.resetOffset();
        performer.resetPosition();
        performer.setOffset(v);
        s++;
      });
    })
  }

  delayClonesById(id, delay) {
    console.log(id, delay);
    let s = 1;
    _.each(this.getCloneGroups()[id], (performer) => {
      performer.setDelay(delay * s);
      s++;
    });
  }

  delayAll(delay) {
    console.log(this.getCloneGroups());
    _.each(this.getCloneGroups(), (performerGroup, idx) => {
      let s = 1;
      _.each(performerGroup, (performer) => {
        performer.setDelay(delay * s);
        s++;
      });
    })
  }

  scaleClonesById(id, scale) {
    let s = 1;
    _.each(this.getCloneGroups()[id], (performer) => {
      performer.setScale(scale * s);
      s++;
    });
  }

  scaleAll(scale) {
    _.each(this.getCloneGroups(), (performerGroup, idx) => {
      let s = 1;
      _.each(performerGroup, (performer) => {
        performer.setScale(scale * s);
        s++;
      });
    })
  }

  updateColors(colors) {
    let idx = 0;
    _.each(this.performers, (performer) => {
      performer.setColor(colors[idx]);
      idx++;
    });
  }

  update(inputId, data) {
    if (this.performers[inputId]) {
      
      if (this.performers[inputId].activeTimeout !== null) { clearTimeout(this.performers[inputId].activeTimeout); }
      this.performers[inputId].activeTimeout = setTimeout(this.remove.bind(this, inputId), 5000);

      this.performers[inputId].update(data);
      _.each(_.filter(this.performers, (p) => {
        if (p.leader === null || p.leader === undefined) {
          return false;
        }
        return p.leader.inputId === inputId;
      }), (p) => p.update(data));
      this.groupEffects.update(this.performers);
    }
  }
}

module.exports = Performers;
