/* This class interfaces with various input
methods and handles response data and
callbacks to the threejs environment.
The input list is defined in config/index.js */

import TWEEN from 'tween';

import config from './../config';

import Common from './../util/Common';

// import all interfaces
const inputTypes = require.context('./types', false, /\.js$/);

// import all presets
const presets = require.context('./presets', false, /\.js$/);

class InputManager {
  constructor(allowedInputs, threeScene, parent) {
    this.allowedInputs = allowedInputs;
    this.scene = threeScene; // bridge to threejs environment (/src/three/scene.js)
    this.parent = parent; // bridge to react environment (/src/react/pages/Main.jsx)

    this.inputs = {};
    this.presets = {};

    // initialize all presets
    this.initPresets();
  }

  initInputTypes() {
    const types = _.uniq(_.map(inputTypes.keys(), t => t.split('.')[1].split('/')[1]));
    _.each(_.without(this.allowedInputs, types), (t) => {
      const InterfaceClass = require('./types/' + t);
      let url = '';
      if (config[t.toLowerCase()]) {
        url = 'ws://' + window.location.hostname + ':' + config[t.toLowerCase()].ports.outgoing;
      }
      this.inputs[t.toLowerCase()] = new InterfaceClass(url);
    });

    // connect current preset with inputs
    this.connectCallbacks(this.parent.state.currentPreset);
  }

  initPresets() {
    const pres = _.uniq(_.map(presets.keys(), p => p.split('.')[1].split('/')[1]));
    this.parent.state.presets = pres.slice(0);
    _.each(pres, (p) => {
      const PresetClass = require('./presets/' + p);
      this.presets[p.toLowerCase()] = new PresetClass(this, this.parent, this.scene);
    });

    // initialize all interfaces
    this.initInputTypes();
  }

  connectCallbacks(preset) {
    this.clearAllCallbacks();

    const types = _.uniq(_.map(inputTypes.keys(), t => t.split('.')[1].split('/')[1]));
    _.each(_.without(this.allowedInputs, types), (t) => {
      this.presets[preset.toLowerCase()].initCallbacks(t);
    });
    console.log('Loading ' + preset + ' preset.');
  }

  clearCallbacks(input) {
    if (this.inputs[input.toLowerCase()]) {
      this.inputs[input.toLowerCase()].clearCallbacks();
    }
  }

  clearAllCallbacks() {
    _.each(this.inputs, (i) => {
      i.clearCallbacks();
    });
  }

  registerCallback(input, event, label, callback) {
    if (this.inputs[input.toLowerCase()]) {
      this.inputs[input.toLowerCase()].on(event, callback, event, label);
    }
  }

  resetScale() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].resetScale();
  }

  fixedTracking() {
    // this.parent.toggleStartOverlay();
    this.scene.cameraControl.trackZ(
      this.parent.performers.performers[
        Object.keys(this.parent.performers.performers)[0]
      ].performer.meshes.robot_hips,
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, 0, 8),
    );
  }

  shrink() {
    // this.parent.toggleBlackOverlay();
    this.scene.cameraControl.trackZoom(
      new THREE.Vector3(0, 0, 105),
      TWEEN.Easing.Quadratic.InOut,
      6400,
    );
  }

  grow() {
    // this.parent.toggleEndOverlay();
    this.scene.cameraControl.trackZoom(
      new THREE.Vector3(0, 0, 5),
      TWEEN.Easing.Quadratic.InOut,
      5700,
    );
  }

  farTracking() {
    this.scene.cameraControl.trackZoom(
      new THREE.Vector3(0, 0, 24),
      TWEEN.Easing.Quadratic.InOut,
      1000,
    );
  }

  slowZoom1() {
    this.scene.cameraControl.trackZoom(
      new THREE.Vector3(0, 0, 12),
      TWEEN.Easing.Quadratic.InOut,
      20000,
    );
  }

  scaleLimbs() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].randomizeLimbs(5000);
  }

  slowZoom2() {
    this.scene.cameraControl.trackZoom(
      new THREE.Vector3(0, 0, 7),
      TWEEN.Easing.Quadratic.InOut,
      20000,
    );
  }

  abominationMode() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].randomizeAll(5000);
  }

  updateIntensity(id, value) {
    const val = Common.mapRange(value, 0, 127, 1, 200);
    const p = this.parent.performers.performers[Object.keys(this.parent.performers.performers)[id]];
    p.updateIntensity(val);
  }

  scalePerformer(id, value) {
    const p = this.parent.performers.performers[Object.keys(this.parent.performers.performers)[id]];
    const val = Common.mapRange(value, 0, 127, (1 / p.modelShrink) / 2, (1 / p.modelShrink) * 2);
    p.getScene().scale.set(val, val, val);
  }

  prevStyle(id) {
    const p = this.parent.performers.performers[Object.keys(this.parent.performers.performers)[id]];
    p.updateStyle(p.getPrevStyle());
  }

  nextStyle(id) {
    const p = this.parent.performers.performers[Object.keys(this.parent.performers.performers)[id]];
    p.updateStyle(p.getNextStyle());
  }

  flyOut() {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }
    this.scene.cameraControl.fly_to(
      new THREE.Vector3(0, 195, 195),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      TWEEN.Easing.Quadratic.InOut,
      'path',
      7000,
      1,
      () => { console.log('Camera moved!'); },
    );
  }

  trackClose() {
    this.scene.unsetRotation();
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene);
    }
    this.cutClose();
    this.scene.cameraControl.track(
      this.parent.performers.performers[
        Object.keys(this.parent.performers.performers)[0]
      ].performer.meshes.robot_hips,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    );
  }

  cutClose() {
    this.scene.unsetRotation();
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene);
    }
    this.scene.cameraControl.jump(
      config.camera.closeShot.position,
      config.camera.closeShot.look,
    );
  }

  rotate() {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene);
    }
    this.scene.cameraControl.trackingObj = null;
    this.scene.setRotationSpeed(4.5);
    this.scene.setRotation();
  }

  lowTrack() {
    this.scene.cameraControl.track(
      this.parent.performers.performers[
        Object.keys(this.parent.performers.performers)[0]
      ].performer.meshes.robot_hips,
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, -0.25, 0),
    );
  }

  cutThreeQ() {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }
    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 15, 15),
      new THREE.Vector3(0, 0, 0),
    );
    this.scene.setRotationSpeed(4.5);
    this.scene.setRotation();
  }

  flyTop() {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }
    this.scene.cameraControl.fly_to(
      new THREE.Vector3(0, 13, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      TWEEN.Easing.Quadratic.InOut,
      'path',
      3000,
      1,
      () => { console.log('Camera moved!'); },
    );
  }

  trackPerformer(id, distance) {
    this.scene.cameraControl.track(
      this.parent.performers.performers[
        Object.keys(this.parent.performers.performers)[id]
      ].performer.meshes.robot_hips,
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, -0.25, distance),
    );
  }

  cutMedium() {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }

    this.scene.cameraControl.jump(
      config.camera.mediumShot.position,
      config.camera.mediumShot.look,
    );
  }

  firstPerson() {
    this.scene.unsetRotation();
    this.scene.cameraControl.changeParent(this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].performer.meshes.robot_head);

    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 2),
    );
  }

  snorryCam() {
    this.scene.unsetRotation();
    this.scene.cameraControl.changeParent(this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].performer.meshes.robot_spine3);

    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 15, 150),
      new THREE.Vector3(0, 15, 0),
    );
  }

  timedStyleSwap(type) {
    if (this.styleInterval !== null) {
      clearInterval(this.styleInterval);
    }
    this.styleInterval = setInterval(
      this.swapStyle.bind(this, type),
      4709,
    );
    this.swapStyle(type);
  }

  clearStyleSwap() {
    if (this.styleInterval !== null) {
      clearInterval(this.styleInterval);
    }
  }

  swapStyle(type) {
    let perf1 = null;
    let perf2 = null;
    let randoStyle1 = null;
    let randoStyle2 = null;
    switch (type) {
      default:
      case 'same':
        perf1 = this.parent.performers.performers[
          Object.keys(this.parent.performers.performers)[1]
        ];
        perf2 = this.parent.performers.performers[
          Object.keys(this.parent.performers.performers)[2]
        ];
        randoStyle1 = perf1.styles[Math.floor((Math.random() * perf1.styles.length))];
        perf1.updateStyle(randoStyle1);
        perf2.updateStyle(randoStyle1);
        break;
      case 'diff':
        perf1 = this.parent.performers.performers[
          Object.keys(this.parent.performers.performers)[1]
        ];
        perf2 = this.parent.performers.performers[
          Object.keys(this.parent.performers.performers)[2]
        ];
        randoStyle1 = perf1.styles[Math.floor((Math.random() * perf1.styles.length))];
        randoStyle2 = perf2.styles[Math.floor((Math.random() * perf2.styles.length))];
        perf1.updateStyle(randoStyle1);
        perf2.updateStyle(randoStyle2);
        break;
    }
  }

  nextScene() {
    this.sceneId++;
    if (this.sceneId > this.maxScenes) {
      this.sceneId = this.maxScenes;
    }
    this.switchScene(this.sceneId);
  }

  prevScene() {
    this.sceneId--;
    if (this.sceneId < 0) {
      this.sceneId = 0;
    }
    this.switchScene(this.sceneId);
  }

  switchScene(id) {
    console.log('Switching to scene ' + id);
    switch (id) {
      default:
        this.sceneDefault();
        break;
      case 1:
        this.sceneOne();
        break;
      case 2:
        this.sceneTwo();
        break;
      case 3:
        this.sceneThree();
        break;
      case 4:
        this.sceneFour();
        break;
      case 5:
        this.sceneFive();
        break;
      case 6:
        this.sceneSix();
        break;
      case 7:
        this.sceneSeven();
        break;
      case 8:
        this.sceneEight();
        break;
      case 9:
        this.sceneNine();
        break;
      case 10:
      case 0:
        this.sceneTen();
        break;
    }
  }

  sceneDefault() {
    this.parent.performers.performers[Object.keys(this.parent.performers.performers)[1]].updateStyle('planes');
    this.parent.performers.performers[Object.keys(this.parent.performers.performers)[2]].updateStyle('planes');

    this.parent.updateColors(this.parent.switchColorSet('dark')[0]);

    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);

    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(false);
  }

  sceneOne() {
    this.parent.updateColors(this.parent.switchColorSet('darkColors')[0]);
  }

  sceneTwo() {
    this.parent.clearCycleColors();
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].updateStyle('planes');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].updateStyle('planes');

    this.parent.updateColors(this.parent.switchColorSet('dark')[0]);
    this.trackPerformer(0, 7.7);

    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(true);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(true);
  }

  sceneThree() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].updateStyle('spheres');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].updateStyle('spheres');

    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(true);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(true);
  }

  sceneFour() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].updateStyle('discs');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].updateStyle('discs');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].addEffect('cloner');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].addEffect('cloner');

    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(true);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(true);
  }

  sceneFive() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(false);
  }

  sceneSix() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].removeEffect('cloner');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].removeEffect('cloner');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(false);
  }

  sceneSeven() {
    this.parent.updateColors(this.parent.switchColorSet('colors1')[0]);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(true);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(true);
  }

  sceneEight() {
    this.parent.clearCycleColors();
    this.parent.updateColors(this.parent.switchColorSet('colors2')[0]);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(true);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(true);
  }

  sceneNine() {
    this.clearStyleSwap();
    this.parent.clearCycleColors();
    this.parent.updateColors(this.parent.switchColorSet('dark')[0]);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].addEffect('cloner');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(false);
  }

  sceneTen() {
    console.log('scene ten!');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].removeEffect('cloner');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(true);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(false);
    this.scene.cameraControl.clearTrack();
  }
}

module.exports = InputManager;
