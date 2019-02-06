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
    
    window.performers = this.performers = {};
    this.dataBuffer = [];

    this.materials = ['Shader', 'Basic', 'Lambert', 'Phong', 'Standard', 'Shader Toy 1', 'Shader Toy 2', 'Shader Toy 3', 'Shader Toy 4', 'Shader Toy 5', 'Shader Toy 6', 'Shader Toy 7', 'Shader Toy 8', 'Shader Toy 9', 'Shader Toy 10'];
    this.currentMaterial = 0;

    this.updateMaterials = this.updateMaterials.bind(this);
    this.nextMaterial = this.nextMaterial.bind(this);
    this.prevMaterial = this.prevMaterial.bind(this);
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

  add(inputId, type, leader, actions, options) {
    if (this.performers && !this.performers[inputId] && this.colors) {
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
      );
    }
  }

  remove(inputId) {
    if (this.exists(inputId)) {
      this.performers[inputId].clearScene();
      delete this.performers[inputId];
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
    // console.log(id, delay);
    let s = 1;
    _.each(this.getCloneGroups()[id], (performer) => {
      performer.setDelay(delay * s);
      s++;
    });
  }

  delayAll(delay) {
    // console.log(this.getCloneGroups());
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

  nextMaterial() {
    this.currentMaterial++;
    if (this.currentMaterial > this.materials.length) {
      this.currentMaterial = 0;
    }
    this.updateMaterials(this.currentMaterial);
  }

  prevMaterial() {
    this.currentMaterial--;
    if (this.currentMaterial < 0) {
      this.currentMaterial = this.materials.length - 1;
    }
    this.updateMaterials(this.currentMaterial);
  }

  updateMaterials(val) {
    _.each(this.performers, (performer) => {
      performer.setMaterial(performer.materials.getMaterialNames()[val]);
    });
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
