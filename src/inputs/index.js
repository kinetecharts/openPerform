/* This class interfaces with various input
methods and handles response data and
callbacks to the threejs environment.
The input list is defined in config/index.js */

import TWEEN from 'tween.js';

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

    this.spread = 0.5;
    this.spreadAngle = new THREE.Vector3(-1, 0, 0);
    // window.cannons = this.cannons = [
    //   {
    //     spread: Math.random()*127,
    //     scale: Math.random()*127,
    //     angle: Math.random()*127,
    //   },
    //   {
    //     spread: Math.random()*127,
    //     scale: Math.random()*127,
    //     angle: Math.random()*127,
    //   },
    // ];
    // initialize all presets
    this.initPresets();

    this.follow = this.follow.bind(this);
    this.snorry = this.snorry.bind(this);
    this.firstPerson = this.firstPerson.bind(this);

    this.cannonizeById = this.cannonizeById.bind(this);
    this.setCannonById = this.setCannonById.bind(this);
    this.delayClonesById = this.delayClonesById.bind(this);
    this.scaleClonesById = this.scaleClonesById.bind(this);
    this.rotateClonesById = this.rotateClonesById.bind(this);
    this.spreadClonesById = this.spreadClonesById.bind(this);
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
    this.connectCallbacks((this.parent.state.currentInputPreset === null) ?
      this.parent.state.defaults.inputPreset :
      this.parent.state.currentInputPreset);
  }

  initPresets() {
    const pres = _.uniq(_.map(presets.keys(), p => p.split('.')[1].split('/')[1]));
    this.parent.state.inputPresets = pres.slice(0);
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
    console.log('Loading ' + preset + ' input preset.');
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

  /* ******** Start Following Camera Animations ********* */

  fixedFollowing() {
    this.scene.cameraControl.followZ(
      this.parent.performers.performers[
        Object.keys(this.parent.performers.performers)[0]
      ].performer.meshes.mixamorighips,
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, 0, 8),
    );
  }

  followClose() {
    this.scene.unsetRotation();
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene);
    }
    this.cutClose();
    this.scene.cameraControl.follow(
      this.parent.performers.performers[
        Object.keys(this.parent.performers.performers)[0]
      ].performer.meshes.mixamorighips,
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
    );
  }

  lowFollow() {
    this.scene.cameraControl.follow(
      this.parent.performers.performers[
        Object.keys(this.parent.performers.performers)[0]
      ].performer.meshes.mixamorighips,
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, -0.25, 0),
    );
  }

  follow(performer, distance) {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }
    this.scene.camera.up.set( 0, 1, 0 );
    this.scene.cameraControl.follow(
      performer.performer.meshes.mixamorighips,
      new THREE.Vector3(0, 0.6, 0),
      new THREE.Vector3(0, 0, distance),
    );
  }

  followPerformer(id, distance) {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }
    this.scene.camera.up.set( 0, 1, 0 );
    this.scene.cameraControl.follow(
      this.parent.performers.performers[
        Object.keys(this.parent.performers.performers)[id]
      ].performer.meshes.mixamorighips,
      new THREE.Vector3(0, 0.5, 0),
      new THREE.Vector3(0, -0.25, distance),
    );
  }

  firstPerson(performer) {
    this.scene.cameraControl.clearFollow();

    this.scene.unsetRotation();
    this.scene.cameraControl.changeParent(performer.performer.meshes.mixamorighead);

    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 2),
    );
  }

  snorry(distance, performer) {
    this.scene.cameraControl.clearFollow();

    this.scene.unsetRotation();
    this.scene.cameraControl.changeParent(performer.performer.meshes.mixamorigspine3);

    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 15, distance),
      new THREE.Vector3(0, 15, 0),
    );
  }

  snorryCam() {
    this.scene.unsetRotation();
    this.scene.cameraControl.changeParent(this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].performer.meshes.mixamorigspine3);

    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 15, 150),
      new THREE.Vector3(0, 15, 0),
    );
  }

  /* ******** End Following Camera Animations ********* */

  /* ******** Start Static Camera Animations ********* */

  farFollowing() {
    this.scene.cameraControl.followZoom(
      new THREE.Vector3(0, 0, 24),
      TWEEN.Easing.Quadratic.InOut,
      1000,
    );
  }

  slowZoom(distance) {
    this.scene.cameraControl.followZoom(
      new THREE.Vector3(0, 0, distance),
      TWEEN.Easing.Quadratic.InOut,
      20000,
    );
  }

  slowZoom1() {
    this.scene.cameraControl.followZoom(
      new THREE.Vector3(0, 0, 12),
      TWEEN.Easing.Quadratic.InOut,
      20000,
    );
  }

  slowZoom2() {
    this.scene.cameraControl.followZoom(
      new THREE.Vector3(0, 0, 7),
      TWEEN.Easing.Quadratic.InOut,
      20000,
    );
  }

  flyOut(animTime) {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }
    this.scene.cameraControl.fly_to(
      new THREE.Vector3(0, 195, 195),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      TWEEN.Easing.Quadratic.InOut,
      'path',
      animTime,
      1,
      () => { console.log('Camera moved!'); },
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
    this.scene.cameraControl.clearFollow();
    this.scene.camera.up.set( 0, 1, 0 );
    this.scene.cameraControl.followingObj = null;
    this.scene.setRotationSpeed(4.5);
    this.scene.setRotation();
  }

  cutThreeQ(idx) {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }

    const p = this.parent.performers.getPerformer(Object.keys(this.parent.performers.performers)[idx]).scene.position.clone();
    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 15, 15),
      p,
    );
    // this.scene.setRotationSpeed(4.5);
    // this.scene.setRotation();
  }

  flyTop() {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }
    this.scene.cameraControl.clearFollow();
    this.scene.cameraControl.fly_to(
      new THREE.Vector3(0, 11, 0),
      new THREE.Vector3(0, 0, 0),
      new THREE.Vector3(0, 0, 0),
      TWEEN.Easing.Quadratic.InOut,
      'path',
      3000,
      1,
      () => { this.scene.camera.up.set( 0, 0, -1 ); console.log('Camera moved!'); },
    );
  }

  cutTop(idx, distance) {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }

    const p = this.parent.performers.getPerformer(Object.keys(this.parent.performers.performers)[idx]).scene.position.clone();
    p.y = 0.55;
    const p2 = p.clone();
    p2.y = distance;
    this.scene.cameraControl.jump(
      p2,
      p,
    );
  }

  cut(idx, distance) {
    if (this.scene.camera.parent.type !== 'Scene') {
      this.scene.cameraControl.changeParent(this.scene.scene);
    }

    const p = this.parent.performers.getPerformer(Object.keys(this.parent.performers.performers)[idx]).scene.position.clone();
    p.y = 0.55;
    const p2 = p.clone();
    p2.z = distance;
    this.scene.cameraControl.jump(
      p2,
      p,
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

  /* ********* End Static Camera Animations ********** */


  circleClonesById(idx) {
    // this.parent.performers.resetClonesPositionById(Object.keys(this.parent.performers.performers)[idx]);
    this.parent.performers.circleClonesById(Object.keys(this.parent.performers.performers)[idx]);
  }

  resetPosRot(idx) {
    this.parent.performers.resetClonesPositionById(Object.keys(this.parent.performers.performers)[idx]);
    this.parent.performers.resetClonesRotationById(Object.keys(this.parent.performers.performers)[idx]);
  }

  removeEffects() {
    this.parent.performers.removeAllEffects();
  }

  addEffectToClones(idx, effect) {
    this.parent.performers.addEffectsToClonesById(Object.keys(this.parent.performers.performers)[idx], effect);
  }

  addEffectToClonesAndLeader(idx, effect) {
    this.parent.performers.addEffectsToPerformer(Object.keys(this.parent.performers.performers)[idx], effect);
    this.parent.performers.addEffectsToClonesById(Object.keys(this.parent.performers.performers)[idx], effect);
  }
  

  toggleClones(idx) {
    this.parent.performers.toggleClonesById(Object.keys(this.parent.performers.performers)[idx]);
  }

  toggleClonesAndLeader(idx) {
    this.parent.performers.togglePerformer(Object.keys(this.parent.performers.performers)[idx]);
    this.parent.performers.toggleClonesById(Object.keys(this.parent.performers.performers)[idx]);
  }

  cannonize(pos, spread, scale, delay) {
    this.parent.performers.spreadAll(pos.clone().multiplyScalar(spread));
    this.parent.performers.scaleAll(scale);
    // this.parent.performers.delayAll(delay);
  }

  timedCannonize(idx) {
    setInterval(() => {
      this.cannonizeById(idx, 0)
      this.cannonizeById(idx, 0);
    }, 5000);
  }

  cannonizeById(idx, val) {
    this.tweenCannon(idx, val);
  }

  tweenCannon(idx, newCannon) {
    this.delayClonesById(idx, newCannon.delay);
    var that = this;
    new TWEEN.Tween(this.cannons[idx])
      .to(newCannon, 1000)
      .easing(TWEEN.Easing.Quadratic.In)
      .onUpdate(function() {
        that.scaleClonesById(idx, this.scale);
        that.rotateClonesById(idx, this.angle);
        that.spreadClonesById(idx, this.spread);
      })
      .onComplete(() => {
        this.cannons[idx] = newCannon;
      })
      .start();
  }

  setCannonById(idx, newCannon) {
    this.delayClonesById(idx, newCannon.delay);
    this.scaleClonesById(idx, newCannon.scale);
    this.rotateClonesById(idx, newCannon.angle);
    this.spreadClonesById(idx, newCannon.spread);
  }

  delayClonesById(idx, delay) {
    this.cannons[idx].delay = delay;
    this.parent.performers.delayClonesById(Object.keys(this.parent.performers.performers)[idx], Common.mapRange(delay, 0, 127, 0, 1));
  }

  scaleClonesById(idx, scale) {
    this.cannons[idx].scale = scale;
    this.parent.performers.scaleClonesById(Object.keys(this.parent.performers.performers)[idx], Common.mapRange(scale, 0, 127, -0.00075, 0.01));
  }

  rotateClonesById(idx, angle) {
    this.cannons[idx].angle = angle;
    this.spreadAngle = new THREE.Vector3(0,0,0);

    let theta = Common.mapRange(angle, 0, 127, -Math.PI, Math.PI);
    let radius = 1;
    let centerX = 0;
    let centerZ = 0;
    this.spreadAngle.x = centerX + radius * Math.cos(theta);
    this.spreadAngle.y = 0;
    this.spreadAngle.z = centerZ - radius * Math.sin(theta);

    this.parent.performers.spreadClonesById(Object.keys(this.parent.performers.performers)[idx], this.spreadAngle.clone().multiplyScalar(this.spread));
  }

  spreadClonesById(idx, spread) {
    // this.parent.performers.resetClonesRotationById(Object.keys(this.parent.performers.performers)[idx]);
    this.cannons[idx].spread = spread;
    this.spread = Common.mapRange(spread, 0, 127, -2, 2);
    this.parent.performers.spreadClonesById(Object.keys(this.parent.performers.performers)[idx], this.spreadAngle.clone().multiplyScalar(this.spread));
  }

  resetScale() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].resetScale();
  }

  shrink() {
    this.scene.cameraControl.followZoom(
      new THREE.Vector3(0, 0, 15),
      TWEEN.Easing.Quadratic.InOut,
      6400,
    );
  }

  grow() {
    this.scene.cameraControl.followZoom(
      new THREE.Vector3(0, 0, 5),
      TWEEN.Easing.Quadratic.InOut,
      5700,
    );
  }

  scaleLimbs() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].randomizeLimbs(5000);
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

  prepScene() {
    // this.inputManager.resetScale();
    _.map(this.parent.performers.getPerformers(), (performer, idx) => {
      // console.log(idx, performer);
      this.parent.performers.add(performer.name + ' Clone 1', 'clone_' + performer.type, performer, null);
      this.parent.performers.add(performer.name + ' Clone 2', 'clone_' + performer.type, performer, null);
      // this.parent.performers.add(performer.name + ' Clone 3', 'clone_' + performer.type, performer, null);
      // this.parent.performers.add(performer.name + ' Clone 4', 'clone_' + performer.type, performer, null);
      // this.parent.performers.add(performer.name + ' Clone 5', 'clone_' + performer.type, performer, null);
    });
  }

  sceneDefault() {
    this.tweenCannon(0, {
      spread: 43,
      scale: 10,
      angle: 0,
      delay: 109,
    });
    this.toggleClones(0);
    // this.toggleClonesAndLeader(1);
    this.followPerformer(0, 7.7);
    // this.parent.performers.performers[Object.keys(this.parent.performers.performers)[1]].updateStyle('planes');
    // this.parent.performers.performers[Object.keys(this.parent.performers.performers)[2]].updateStyle('planes');

    // this.parent.updateColors(this.parent.switchColorSet('dark')[0]);

    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[0]
    // ].setVisible(false);

    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].setVisible(false);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].setVisible(false);
  }

  sceneOne() {
    this.followPerformer(1, 7.7);
    this.toggleClones(0);
    // this.parent.performers.performers[Object.keys(this.parent.performers.performers)[1]].toggleVisible();
    // this.scene.cameraControl.clearFollow();
    // this.shrink();
    // this.parent.updateColors(this.parent.switchColorSet('darkColors')[0]);
  }

  sceneTwo() {
    this.tweenCannon(0, {
      spread: 63,
      scale: 9,
      angle: 0,
      delay: 109,
    });
    // this.tweenCannon(0, {
    //   spread: 46,
    //   scale: 1,
    //   angle: 0,
    //   delay: 0,
    // });

    // this.tweenCannon(1, {
    //   spread: 46,
    //   scale: 1,
    //   angle: 53,
    //   delay: 0,
    // });

    // this.toggleClones(0);
    // this.toggleClones(1);
    // this.parent.clearCycleColors();
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].updateStyle('planes');
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].updateStyle('planes');

    // this.parent.updateColors(this.parent.switchColorSet('dark')[0]);
    // this.followPerformer(0, 7.7);

    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[0]
    // ].setVisible(false);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].setVisible(true);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].setVisible(true);
  }

  sceneThree() {
    this.toggleClonesAndLeader(0);
    this.addEffectToClonesAndLeader(0, 'ribbons');
    this.followPerformer(1, 7.7);
    // this.tweenCannon(0, {
    //   spread: 63,
    //   scale: 9,
    //   angle: 0,
    //   delay: 3,
    // });

    // this.tweenCannon(1, {
    //   spread: 63,
    //   scale: 9,
    //   angle: 0,
    //   delay: 3,
    // });
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].updateStyle('spheres');
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].updateStyle('spheres');

    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[0]
    // ].setVisible(false);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].setVisible(true);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].setVisible(true);
  }

  sceneFour() {
    this.toggleClonesAndLeader(1);
    this.followPerformer(0, 9);
    this.setCannonById(0, {
      spread: 63,
      scale: 9,
      angle: 0,
      delay: 0,
    });
    this.circleClonesById(0);
    this.flyTop();

    
    // this.tweenCannon(0, {
    //   spread: 46,
    //   scale: 9,
    //   angle: 0,
    //   delay: 0,
    // });

    // this.tweenCannon(1, {
    //   spread: 63,
    //   scale: 9,
    //   angle: 0,
    //   delay: 0,
    // });
    // this.flyTop();
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].updateStyle('discs');
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].updateStyle('discs');
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].addEffect('ghosting');
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].addEffect('ghosting');

    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[0]
    // ].setVisible(false);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].setVisible(true);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].setVisible(true);
  }

  sceneFive() {
    this.parent.performers.performers[Object.keys(this.parent.performers.performers)[1]].toggleVisible();

    this.addEffectToClonesAndLeader(0, 'ribbons');
    this.toggleClonesAndLeader(0);

    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[0]
    // ].setVisible(false);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[1]
    // ].setVisible(false);
    // this.parent.performers.performers[
    //   Object.keys(this.parent.performers.performers)[2]
    // ].setVisible(false);
  }

  sceneSix() {
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].removeEffect('ghosting');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].removeEffect('ghosting');
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
    ].addEffect('ghosting');
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
    ].removeEffect('ghosting');
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[0]
    ].setVisible(true);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[1]
    ].setVisible(false);
    this.parent.performers.performers[
      Object.keys(this.parent.performers.performers)[2]
    ].setVisible(false);
    this.scene.cameraControl.clearFollow();
  }
}

module.exports = InputManager;
