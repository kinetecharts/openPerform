/* This class interfaces with various input
methods and handles response data and
callbacks to the threejs environment.
The input list is defined in config/index.js */

import _ from 'lodash';
import TWEEN from 'tween';

import config from './../config';

import Common from './../util/Common';

import Myo from './Myo';
import MidiController from './MidiController';
import KinectTransport from './KinectTransport';
import KeyboardController from './KeyboardController';
import NeuroSky from './NeuroSky';
import PerceptionNeuron from './PerceptionNeuron';
import Gamepads from './Gamepads';

class InputManager {
  constructor(inputList, threeScene, parent) {
    this.inputs = {};
    this.scene = threeScene; // bridge to threejs environment (/src/three/scene.js)
    this.parent = parent; // bridge to react environment (/src/react/pages/Main.jsx)

    // connect all inputs in the input list
    _.forEach(inputList, this.connectInputs.bind(this)); // input list defined in config/index.js
  }

  connectInputs(type) {
    switch (type) { // input list defined in config/index.js
      case 'keyboard':
        this.inputs[type] = new KeyboardController();
        this.initKeyboardCallbacks();
        break;
      case 'kinecttransport':
        this.inputs[type] = new KinectTransport();
        this.initKinectTransportCallbacks();
        break;
      case 'myo':
        this.inputs[type] = new Myo();
        this.initMyoCallbacks();
        break;
      case 'neurosky':
        this.inputs[type] = new NeuroSky();
        this.initNeuroSkyCallbacks();
        break;
      case 'perceptionNeuron':
        this.inputs[type] = new PerceptionNeuron(`ws://${window.location.hostname}:${config.perceptionNeuron.port}`);
        this.initPerceptionNeuronCallbacks();
        break;
      case 'gamepads':
        this.inputs[type] = new Gamepads(`ws://${window.location.hostname}:${config.gamepads.ports.outgoing}`);
        this.initGamepadCallbacks();
        break;
      case 'midiController':
        this.inputs[type] = new MidiController(`ws://${window.location.hostname}:${config.midiController.ports.outgoing}`);
        this.initMidiControllerCallbacks();
        break;
    }
  }

  registerCallback(input, event, label, callback) {
    if (this.inputs[input]) {
      this.inputs[input].on(event, callback, event, label);
    }
  }

  resetScale() {
    this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].resetScale();
  }

  fixedTracking() {
    // this.parent.toggleStartOverlay();
    this.scene.cameraControl.trackZ(
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer.meshes.robot_hips,
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
    this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].randomizeLimbs(5000);
  }

  slowZoom2() {
    this.scene.cameraControl.trackZoom(
      new THREE.Vector3(0, 0, 7),
      TWEEN.Easing.Quadratic.InOut,
      20000,
    );
  }

  abominationMode() {
    this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].randomizeAll(5000);
  }


  initGamepadCallbacks() {
    this.registerCallback('gamepads', 'message', 'Gamepad', (data) => {
      const leftStick = _.merge(_.map(_.filter(data, d => d.id.slice(0, 4) == 'Left'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d.value;
        return obj;
      }));
      if (leftStick.length > 0) { console.log('Left Stick: ', leftStick); }


      const rightStick = _.merge(_.map(_.filter(data, d => d.id.slice(0, 5) == 'Right'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d.value;
        return obj;
      }));
      if (rightStick.length > 0) { console.log('Right Stick: ', rightStick); }

      const dPad = _.merge(_.map(_.filter(data, d => d.id.slice(0, 4) == 'DPad'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d.value;
        return obj;
      }));
      if (dPad.length > 0) { console.log('DPad Stick: ', dPad); }

      const aButton = _.filter(data, d => d.id == 'A');
      if (aButton.length > 0) { console.log('A Button: ', aButton); }

      const bButton = _.filter(data, d => d.id == 'B');
      if (bButton.length > 0) { console.log('B Button: ', bButton); }

      const xButton = _.filter(data, d => d.id == 'X');
      if (xButton.length > 0) { console.log('X Button: ', xButton); }

      const yButton = _.filter(data, d => d.id == 'Y');
      if (yButton.length > 0) { console.log('Y Button: ', yButton); }

      const lbButton = _.filter(data, d => d.id == 'LB');
      if (lbButton.length > 0) { console.log('LB Button: ', lbButton); }

      const rbButton = _.filter(data, d => d.id == 'RB');
      if (rbButton.length > 0) { console.log('RB Button: ', rbButton); }

      const ltButton = _.filter(data, d => d.id == 'LT');
      if (ltButton.length > 0) { console.log('LT Button: ', ltButton); }

      const rtButton = _.filter(data, d => d.id == 'RT');
      if (rtButton.length > 0) { console.log('RT Button: ', rtButton); }
    });
  }

  initMidiControllerCallbacks() {
    this.performerIdx = 0;
    this.registerCallback('midiController', 'message', 'Midi Controller', (data) => {
      switch (data.name) {
        case 'cycle':
          this.resetScale();
          break;

          /* case 'track left': // scene 1
					this.scene.switchEnvironment("grid-dark");
					this.parent.performers.showWireframe();
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].addEffects(["trails"]);
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].removeEffects(["cloner"]);

					this.snorryCam();

					break;
				case 'track right': // scene 2
					this.scene.switchEnvironment("water");
					this.parent.performers.hideWireframe();
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].addEffects(["cloner"]);
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].removeEffects(["trails"]);

					this.firstPerson();
					break; */

        case 'marker set': // start overlay
          this.fixedTracking();
          break;
        case 'marker left': // black overlay
          this.shrink();
          break;
        case 'marker right': // end overlay
          this.grow();
          break;

        case 'rewind':
          this.performerIdx--;
          if (this.performerIdx < 0) {
            this.performerIdx = this.parent.BVHPlayers.length - 1;
          }
          break;

        case 'fast forward':
          this.performerIdx++;
          if (this.performerIdx > this.parent.BVHPlayers.length - 1) {
            this.performerIdx = 0;
          }
          break;

        case 'stop':
          this.parent.BVHPlayers[this.performerIdx].stop();
          break;

        case 'play':
          this.parent.BVHPlayers[this.performerIdx].play();
          break;

        case 'record':
          if (this.parent.BVHPlayers.length <= 8) {
            this.parent.addBVHPerformer(this.parent.BVHFiles[this.parent.BVHPlayers.length]);
          } else {
            console.log('BVH Limit Reached!');
          }
          break;


        case 'solo 1':
          this.trackPerformer(0, 14);
          break;
        case 'mute 1':
          this.prevStyle(0);
          break;
        case 'record 1':
          this.nextStyle(0);
          break;
        case 'slider 1':
          this.scalePerformer(0, data.value);
          break;
        case 'knob 1':
          this.updateIntensity(0, data.value);
          break;

          /** ************************************** */

        case 'solo 2':
          this.trackPerformer(1, 14);
          break;
        case 'mute 2':
          this.prevStyle(1);
          break;
        case 'record 2':
          this.nextStyle(1);
          break;
        case 'slider 2':
          this.scalePerformer(1, data.value);
          break;
        case 'knob 2':
          this.updateIntensity(1, data.value);
          break;

          /** ************************************** */

        case 'solo 3':
          this.trackPerformer(2, 14);
          break;
        case 'mute 3':
          this.prevStyle(2);
          break;
        case 'record 3':
          this.nextStyle(2);
          break;
        case 'slider 3':
          this.scalePerformer(2, data.value);
          break;
        case 'knob 3':
          this.updateIntensity(2, data.value);
          break;

          /** ************************************** */

        case 'solo 4':
          this.trackPerformer(3, 14);
          break;
        case 'mute 4':
          this.prevStyle(3);
          break;
        case 'record 4':
          this.nextStyle(3);
          break;
        case 'slider 4':
          this.scalePerformer(3, data.value);
          break;
        case 'knob 4':
          this.updateIntensity(3, data.value);
          break;

          /** ************************************** */

        case 'solo 5':
          this.trackPerformer(4, 14);
          break;
        case 'mute 5':
          this.prevStyle(4);
          break;
        case 'record 5':
          this.nextStyle(4);
          break;
        case 'slider 5':
          this.scalePerformer(4, data.value);
          break;
        case 'knob 5':
          this.updateIntensity(4, data.value);
          break;

          /** ************************************** */

        case 'solo 6':
          this.trackPerformer(5, 14);
          break;
        case 'mute 6':
          this.prevStyle(5);
          break;
        case 'record 6':
          this.nextStyle(5);
          break;
        case 'slider 6':
          this.scalePerformer(5, data.value);
          break;
        case 'knob 6':
          this.updateIntensity(5, data.value);
          break;

          /** ************************************** */

        case 'solo 7':
          this.trackPerformer(6, 14);
          break;
        case 'mute 7':
          this.prevStyle(6);
          break;
        case 'record 7':
          this.nextStyle(6);
          break;
        case 'slider 7':
          this.scalePerformer(6, data.value);
          break;
        case 'knob 7':
          this.updateIntensity(6, data.value);
          break;

          /** ************************************** */

        case 'solo 8':
          this.trackPerformer(7, 14);
          break;
        case 'mute 8':
          this.prevStyle(7);
          break;
        case 'record 8':
          this.nextStyle(7);
          break;
        case 'slider 8':
          this.scalePerformer(7, data.value);
          break;
        case 'knob 8':
          this.updateIntensity(7, data.value);
          break;

				/** ************************************** */

				/* case 'stop':
					this.scene.unsetRotation();
					break;
				case 'play':
					this.scene.setRotation();
					break;

				case 'solo 1':
					this.snorryCam();
					break;

				case 'solo 2':
					this.cutMedium();
					break;

				case 'solo 3':
					this.cutMedium();
					this.trackPerformer();
					break;

				case 'solo 4':
					this.flyTop();
					break;

				case 'solo 5':
					this.cutThreeQ();
					break;

				case 'solo 6':
					this.firstPerson();
					break;

				case 'solo 7':
					this.cutMedium();
					this.scene.cameraControl.track(
						this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer.meshes['robot_hips'],
						new THREE.Vector3(0, 0.5, 0),
						new THREE.Vector3(0,0,7)
					);
					break;

				case 'solo 8':
					this.rotate();
					break;

				case 'record 1':
					this.trackClose();
					break;

				case 'record 2':
					this.flyOut();
					break;

				case 'slider 8':
					data.parameter = "waves"
					data.value = Common.mapRange(data.value, 0, 127, 0.25, 1);
					this.scene.environments.updateParameters(data);
					break;


				case 'record 4':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('leftshoulder', false);
				break;

				case 'record 5':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('rightshoulder', false);
				break;

				case 'record 6':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('leftupleg', false);
				break;

				case 'record 7':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('rightupleg', false);
				break;

				case 'record 8':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('head', false);
				break;

				// case 'knob 1':
				// 	// this.scene.controls.rotateLeft();
				// 	// this.scene.controls.sphericalDelta.theta = Common.mapRange(data.value, 0, 127, 0, Math.PI);
				// 	break;

				case 'slider 1':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].scalePart('head', Common.mapRange(data.value, 0, 127, 0.01, 5));
				break;

				case 'slider 2':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].scalePart('leftshoulder', Common.mapRange(data.value, 0, 127, 0.01, 5));
				break;

				case 'slider 3':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].scalePart('rightshoulder', Common.mapRange(data.value, 0, 127, 0.01, 5));
				break;

				case 'slider 4':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].scalePart('leftupleg', Common.mapRange(data.value, 0, 127, 0.01, 5));
				break;

				case 'slider 5':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].scalePart('rightupleg', Common.mapRange(data.value, 0, 127, 0.01, 5));
				break;

				case 'slider 6':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].randomizeLimbs(Common.mapRange(data.value, 0, 127, 1, 5000));
				break;

				case 'slider 7':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].randomizeAll(Common.mapRange(data.value, 0, 127, 1, 5000));
				break; */

				/* case 'mute 1':
					this.farTracking();
				break;

				case 'mute 2':
					this.slowZoom1();
				break;

				case 'mute 3':
					this.scaleLimbs();
				break;

				case 'mute 4':
					this.slowZoom2();
				break;

				case 'mute 5':
					this.abominationMode();
				break; */

				// case 'mute 6':
				// 	this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].scalePart("hips", 500, 1000);
				// break;


				// case 'solo 6':
				// 	this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].addEffects(["trails"])
				// 	break;

				// case 'record 6':
				// 	this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].removeEffects(["trails"])
				// 	break;

				// case 'solo 7':
				// 	this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].addEffects(["cloner"])
				// 	break;

				// case 'record 7':
				// 	this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].removeEffects(["cloner"])
				// 	break;

				// case 'solo 8':
				// 	this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].addEffects(["particleSystem"])
				// 	break;

				// case 'record 8':
				// 	this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].removeEffects(["particleSystem"])
				// 	break;
				// // case 'slider 1':
				// // 	data.parameter = "lines"
				// // 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// // 	this.scene.environments.updateParameters(data);
				// // 	break;
				// // case 'knob 1':
				// // 	data.parameter = "size"
				// // 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// // 	this.scene.environments.updateParameters(data);
				// // 	break;
				// case 'slider 1':
				// 	data.parameter = "life"
				// 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// 	this.parent.performers.updateParameters(data);
				// 	break;
				// case 'knob 1':
				// 	data.parameter = "rate"
				// 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// 	this.parent.performers.updateParameters(data);
				// 	break;

				// // case 'knob 3':
				// // 	data.parameter = "size"
				// // 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// // 	this.parent.performers.updateParameters(data);
				// // 	break;
				// // case 'slider 3':
				// // 	data.parameter = "color"
				// // 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// // 	this.parent.performers.updateParameters(data);
				// // 	break;
      }
    });
  }

  updateIntensity(id, value) {
    const val = Common.mapRange(value, 0, 127, 1, 200);
    const p = this.parent.performers.performers[Object.keys(this.parent.performers.performers)[id]];
    p.updateIntensity(val);
  }

  scalePerformer(id, value) {
    const p = this.parent.performers.performers[Object.keys(this.parent.performers.performers)[id]];
    const val = Common.mapRange(value, 0, 127, 1 / p.modelShrink / 2, 1 / p.modelShrink * 2);
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

  initPerceptionNeuronCallbacks() {
    this.registerCallback('perceptionNeuron', 'message', 'Perception Neuron', this.parent.updatePerformers.bind(this.parent));
  }

  initNeuroSkyCallbacks() { // https://github.com/elsehow/mindwave
    this.registerCallback('mindwave', 'data', 'Mindwave', (data) => { console.log(data); });
  }

  initMyoCallbacks() { // https://github.com/thalmiclabs/myo.js/blob/master/docs.md
    this.registerCallback('myo', 'imu', 'Myo', (data) => { console.log(data); });
  }

  initKinectTransportCallbacks() { // Reuires Kinect Transport app.
    /* https://github.com/stimulant/MS-Cube-SDK/tree/research/KinectTransport
		Returns either depth or bodies object. */
    this.registerCallback('kinecttransport', 'depth', 'Kinect Depth', this.scene.viewKinectTransportDepth.bind(this.scene));
    this.registerCallback('kinecttransport', 'bodies', 'Kinect Body', this.scene.viewKinectTransportBodies.bind(this.scene));
  }

  initKeyboardCallbacks() { // Uses mousetrap: https://github.com/ccampbell/mousetrap
    this.registerCallback('keyboard', 'esc', 'Hide / Show Keyboard Shortcuts', this.parent.openKeyboardModal.bind(this.parent));

    this.registerCallback('keyboard', '-', 'Toggle GUI', this.parent.toggleGUI.bind(this.parent));
    this.registerCallback('keyboard', '=', 'Toggle Fullscreen', this.parent.toggleFullscreen.bind(this.parent));

    this.registerCallback('keyboard', 'l', 'Tracking Camera - Low Angle', () => {
    	if (!this.scene.cameraControl.trackingObj) {
	      this.scene.cameraControl.track(
	        this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer.meshes.robot_hips,
	        new THREE.Vector3(0, 0.5, 0),
	        new THREE.Vector3(0, 0, 7),
	      );
	  	} else {
	  		this.scene.cameraControl.clearTrack();
	  	}
    });

    // this.registerCallback('keyboard', ';', 'Tracking Camera - Zoom Out', function() {
    // 	this.scene.cameraControl.trackZoom(
    // 		new THREE.Vector3(0,0,100),
    // 		TWEEN.Easing.Quadratic.InOut,
    // 		5000
    // 	);
    // }.bind(this));

    // this.registerCallback('keyboard', "'", 'Tracking Camera - Zoom In', function() {
    // 	this.scene.cameraControl.trackZoom(
    // 		new THREE.Vector3(0,0,3),
    // 		TWEEN.Easing.Quadratic.InOut,
    // 		5000
    // 	);
    // }.bind(this));

    // this.registerCallback('keyboard', "a", 'randomize limb scale', function() {
    // 	_.each(this.parent.performers.performers, (performer) => {
    // 		performer.randomizeAll(5000);
    // 	});
    // }.bind(this));

    this.registerCallback('keyboard', 'c', 'Vogue Clone', () => {
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performerEffects.effects[0].clonePerformer();
      // this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].randomizeColors(5000);
    });

    this.registerCallback('keyboard', 'q', 'Randomize All Mesh Scale', () => {
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].randomizeAll(5000);
      // this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].randomizeColors(5000);
    });

    this.registerCallback('keyboard', 'w', 'Random Limb Scale', () => {
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].randomizeLimbs(5000);
    });

    this.registerCallback('keyboard', 'n', 'Detach Left Arm', () => { // toggle environment input
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('leftshoulder', false);
    });

    this.registerCallback('keyboard', 'm', 'Detach Right Arm', () => { // toggle environment input
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('rightshoulder', false);
    });

    this.registerCallback('keyboard', ',', 'Detach Left Leg', () => { // toggle environment input
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('leftupleg', false);
    });

    this.registerCallback('keyboard', '.', 'Detach Right Leg', () => { // toggle environment input
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('rightupleg', false);
    });

    this.registerCallback('keyboard', '/', 'Detach Head', () => { // toggle environment input
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].unParentPart('head', false);
    });

    // this.registerCallback('keyboard', 'space', 'Show Overlay', this.parent.toggleStartOverlay.bind(this.parent));
    this.registerCallback('keyboard', 'space', 'Toggle Floor', () => { this.scene.environments.environments[0].toggleVisible(); });

    // this.registerCallback('keyboard', '1', 'Dark Grid Theme', function() { this.switchEnvironment("grid-dark"); }.bind(this.scene));
    // this.registerCallback('keyboard', '2', 'Water Theme', function() { this.switchEnvironment("water"); }.bind(this.scene));
    // this.registerCallback('keyboard', '3', 'Light Grid Theme', function() { this.switchEnvironment("grid-light"); }.bind(this.scene));
    // this.registerCallback('keyboard', '4', 'Gradient Theme', function() { this.switchEnvironment("gradient"); }.bind(this.scene));
    // this.registerCallback('keyboard', '5', 'Island Theme', function() { this.switchEnvironment("island"); }.bind(this.scene));

    // Camera positions
    this.registerCallback('keyboard', 'r', 'Rotate Camera', this.scene.toggleRotation.bind(this.scene)); // enable / disable camera rotation

    this.registerCallback('keyboard', 'q', 'Fly Close', function () { // fly to close up shot
      if (this.camera.parent.type !== 'Scene') {
        this.cameraControl.changeParent(this.scene);
      }
      this.cameraControl.fly_to(
        config.camera.closeShot.position,
        new THREE.Vector3(0, 0, 0),
        config.camera.closeShot.look,
        TWEEN.Easing.Quadratic.InOut,
        'path',
        3000,
        1,
        () => { console.log('Camera moved!'); },
      );
    }.bind(this.scene));

    this.registerCallback('keyboard', 'w', 'Fly Medium', function () { // fly to medium shot
      if (this.camera.parent.type !== 'Scene') {
        this.cameraControl.changeParent(this.scene);
      }
      this.cameraControl.fly_to(
        config.camera.mediumShot.position,
        new THREE.Vector3(0, 0, 0),
        config.camera.mediumShot.look,
        TWEEN.Easing.Quadratic.InOut,
        'path',
        3000,
        1,
        () => { console.log('Camera moved!'); },
      );
    }.bind(this.scene));

    this.registerCallback('keyboard', 'e', 'Fly Wide', function () { // fly to wide shot
      if (this.camera.parent.type !== 'Scene') {
        this.cameraControl.changeParent(this.scene);
      }
      this.cameraControl.fly_to(
        config.camera.wideShot.position,
        new THREE.Vector3(0, 0, 0),
        config.camera.wideShot.look,
        TWEEN.Easing.Quadratic.InOut,
        'path',
        3000,
        1,
        () => { console.log('Camera moved!'); },
      );
    }.bind(this.scene));

    // this.registerCallback('keyboard', 'a', 'Cut Close', this.cutClose.bind(this)); //cut to close up shot

    // this.registerCallback('keyboard', 's', 'Cut Medium', this.cutMedium.bind(this)); //cut to medium shot

    // this.registerCallback('keyboard', 'd', 'Cut Wide', function() { //cut to wide shot
    // 	if (this.camera.parent.type !== "Scene") {
    // 		this.cameraControl.changeParent(
    // 			this.scene
    // 		);
    // 	}
    // 	this.cameraControl.jump(
    // 		config.camera.wideShot.position,
    // 		config.camera.wideShot.look
    // 	);
    // }.bind(this.scene));

    this.registerCallback('keyboard', 'g', 'Snorry Cam', this.snorryCam.bind(this)); // look at face

    this.registerCallback('keyboard', 'f', 'First Person', this.firstPerson.bind(this)); // first person view

    this.registerCallback('keyboard', 't', 'Track Performer', this.trackPerformer.bind(this)); // follow x position of performer

    this.registerCallback('keyboard', 'y', 'Top View', this.flyTop.bind(this)); // follow x position of performer

    this.registerCallback('keyboard', 'u', '3/4 View', this.cutThreeQ.bind(this)); // follow x position of performer

    this.registerCallback('keyboard', 'i', 'Fly Out', this.flyOut.bind(this)); // follow x position of performer

    // this.registerCallback('keyboard', 'z', 'Env Input', function() { //toggle environment input
    // 	this.scene.environments.toggle("usePerformerInput");
    // }.bind(this));

    // this.registerCallback('keyboard', 'x', 'Toggle Wireframe', function() { //toggle environment input
    // 	this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].toggleWireframe();
    // }.bind(this));
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
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer.meshes.robot_hips,
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
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer.meshes.robot_hips,
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
      this.parent.performers.performers[Object.keys(this.parent.performers.performers)[id]].performer.meshes.robot_hips,
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
    this.scene.cameraControl.changeParent(this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer.meshes.robot_head);

    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 0, 1),
      new THREE.Vector3(0, 0, 2),
    );
  }

  snorryCam() {
    this.scene.unsetRotation();
    this.scene.cameraControl.changeParent(this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer.meshes.robot_spine3);

    this.scene.cameraControl.jump(
      new THREE.Vector3(0, 15, 150),
      new THREE.Vector3(0, 15, 0),
    );
  }
}

module.exports = InputManager;
