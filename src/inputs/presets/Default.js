class DefaultPreset {
  constructor(inputManager, main, scene) {
    this.inputManager = inputManager;
    this.main = main;
    this.scene = scene;
  }

  initCallbacks(type) {
    switch (type.toLowerCase()) {
      default:
        console.log(type.toLowerCase() + ' input not found for this preset');
        break;
      case 'keyboard':
        this.initKeyboardCallbacks();
        break;
      case 'kinecttransport':
        this.initKinectTransportCallbacks();
        break;
      case 'myo':
        this.initMyoCallbacks();
        break;
      case 'neurosky':
        this.initNeuroSkyCallbacks();
        break;
      case 'perceptionneuron':
        this.initPerceptionNeuronCallbacks();
        break;
      case 'gamepads':
        this.initGamepadCallbacks();
        break;
      case 'midicontroller':
        this.initMidiControllerCallbacks();
        break;
    }
  }

  initGamepadCallbacks() {
    let previous = {
      dpadX:0, dpadY:0,
      lStickX:0, lStickY:0, rStickX:0, rStickY:0,
      x:0, y:0,
      a:0, b:0,
      lb:0, rb:0,
      lt:0, rt:0
    }

    this.inputManager.registerCallback('gamepads', 'message', 'Gamepad', (data) => {
      const leftStick = _.merge(_.map(_.filter(data, d => d.id.slice(0, 4) == 'Left'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d;
        return obj;
      }));
      if (leftStick.length > 0) {
        if (
          leftStick[0].x.value !== previous.lStickX ||
          leftStick[0].y.value !== previous.lStickY
        ) {
          console.log('Left Stick Moved: ', leftStick);
        }
      }

      const rightStick = _.merge(_.map(_.filter(data, d => d.id.slice(0, 5) == 'Right'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d;
        return obj;
      }));
      if (rightStick.length > 0) {
        if (
          rightStick[0].x.value !== previous.rStickX ||
          rightStick[0].y.value !== previous.rStickY
        ) {
          console.log('Right Stick Moved: ', rightStick);
        }
      }

      const dPad = _.merge(_.map(_.filter(data, d => d.id.slice(0, 4) == 'DPad'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d;
        return obj;
      }));
      if (dPad.length > 0) {
        if (dPad[0].x) {
            if (dPad[0].x.direction !== previous.dpadX) {
              if (dPad[0].x.direction == 1) {
                console.log('D-Pad Right: ', dPad[0].x.direction);
              }

              if (dPad[0].x.direction == -1) {
                console.log('D-Pad Left: ', dPad[0].x.direction);
              }

              previous.dpadX = dPad[0].x.direction;
            }
        }
        if (dPad[0].y) {
            if (dPad[0].y.direction !== previous.dpadY) {
              if (dPad[0].y.direction == 1) {
                console.log('D-Pad Up: ', dPad[0].y.direction);
              }

              if (dPad[0].y.direction == -1) {
                console.log('D-Pad Down: ', dPad[0].y.direction);
              }

              previous.dpadY = dPad[0].y.direction;
            }
        }
      }

      const aButton = _.filter(data, d => d.id == 'A');
      if (aButton.length > 0) {
        if (aButton[0].pressed !== previous.a) {
          if (aButton[0].pressed) {
            console.log('A Button Pressed: ', aButton[0].pressed);
          }
        }
        previous.a = aButton[0].pressed;
      }

      const bButton = _.filter(data, d => d.id == 'B');
      if (bButton.length > 0) {
        if (bButton[0].pressed !== previous.b) {
          if (bButton[0].pressed) {
            console.log('B Button Pressed: ', bButton[0].pressed);
          }
        }
        previous.b = bButton[0].pressed;
      }

      const xButton = _.filter(data, d => d.id == 'X');
      if (xButton.length > 0) {
        if (xButton[0].pressed !== previous.x) {
          if (xButton[0].pressed) {
            console.log('X Button Pressed: ', xButton[0].pressed);
          }
        }
        previous.x = xButton[0].pressed;
      }

      const yButton = _.filter(data, d => d.id == 'Y');
      if (yButton.length > 0) {
        if (yButton[0].pressed !== previous.y) {
          if (yButton[0].pressed) {
            console.log('Y Button Pressed: ', yButton[0].pressed);
          }
        }
        previous.y = yButton[0].pressed;
      }

      const lbButton = _.filter(data, d => d.id == 'LB');
      if (lbButton.length > 0) {
        if (lbButton[0].pressed !== previous.lb) {
          if (lbButton[0].pressed) {
            console.log('LB Button Pressed: ', lbButton[0].pressed);
          }
        }
        previous.lb = lbButton[0].pressed;
      }

      const rbButton = _.filter(data, d => d.id == 'RB');
      if (rbButton.length > 0) {
        if (rbButton[0].pressed !== previous.rb) {
          if (rbButton[0].pressed) {
            console.log('RB Button Pressed: ', rbButton[0].pressed);
          }
        }
        previous.rb = rbButton[0].pressed;
      }

      const ltButton = _.filter(data, d => d.id == 'LT');
      if (ltButton.length > 0) {
        if (ltButton[0].pressed !== previous.lt) {
          if (ltButton[0].pressed) {
            console.log('LT Button Pressed: ', ltButton[0].pressed);
          }
        }
        previous.lt = ltButton[0].pressed;
      }

      const rtButton = _.filter(data, d => d.id == 'RT');
      if (rtButton.length > 0) {
        if (rtButton[0].pressed !== previous.rt) {
          if (rtButton[0].pressed) {
            console.log('RT Button Pressed: ', rtButton[0].pressed);
          }
        }
        previous.rt = rtButton[0].pressed;
      }
    });
  }

  initMidiControllerCallbacks() {
    this.performerIdx = 0;
    this.inputManager.registerCallback('midiController', 'message', 'Midi Controller', (data) => {
      switch (data.name) {
        case 'cycle':
          this.resetScale();
          break;

          /* case 'track left': // scene 1
          this.scene.switchEnvironment("grid-dark");
          this.main.performers.showWireframe();
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(["trails"]);
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(["cloner"]);

          this.snorryCam();

          break;
        case 'track right': // scene 2
          this.scene.switchEnvironment("water");
          this.main.performers.hideWireframe();
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(["cloner"]);
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(["trails"]);

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
            this.performerIdx = this.main.BVHPlayers.length - 1;
          }
          break;

        case 'fast forward':
          this.performerIdx++;
          if (this.performerIdx > this.main.BVHPlayers.length - 1) {
            this.performerIdx = 0;
          }
          break;

        case 'stop':
          this.main.BVHPlayers[this.performerIdx].stop();
          break;

        case 'play':
          this.main.BVHPlayers[this.performerIdx].play();
          break;

        case 'record':
          if (this.main.BVHPlayers.length <= 8) {
            this.main.addBVHPerformer(this.main.BVHFiles[this.main.BVHPlayers.length]);
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
            this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].performer.meshes['robot_hips'],
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
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('leftshoulder', false);
        break;

        case 'record 5':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('rightshoulder', false);
        break;

        case 'record 6':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('leftupleg', false);
        break;

        case 'record 7':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('rightupleg', false);
        break;

        case 'record 8':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('head', false);
        break;

        // case 'knob 1':
        // 	// this.scene.controls.rotateLeft();
        // 	// this.scene.controls.sphericalDelta.theta = Common.mapRange(data.value, 0, 127, 0, Math.PI);
        // 	break;

        case 'slider 1':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].scalePart('head', Common.mapRange(data.value, 0, 127, 0.01, 5));
        break;

        case 'slider 2':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].scalePart('leftshoulder', Common.mapRange(data.value, 0, 127, 0.01, 5));
        break;

        case 'slider 3':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].scalePart('rightshoulder', Common.mapRange(data.value, 0, 127, 0.01, 5));
        break;

        case 'slider 4':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].scalePart('leftupleg', Common.mapRange(data.value, 0, 127, 0.01, 5));
        break;

        case 'slider 5':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].scalePart('rightupleg', Common.mapRange(data.value, 0, 127, 0.01, 5));
        break;

        case 'slider 6':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].randomizeLimbs(Common.mapRange(data.value, 0, 127, 1, 5000));
        break;

        case 'slider 7':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].randomizeAll(Common.mapRange(data.value, 0, 127, 1, 5000));
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
        // 	this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].scalePart("hips", 500, 1000);
        // break;


        // case 'solo 6':
        // 	this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(["trails"])
        // 	break;

        // case 'record 6':
        // 	this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(["trails"])
        // 	break;

        // case 'solo 7':
        // 	this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(["cloner"])
        // 	break;

        // case 'record 7':
        // 	this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(["cloner"])
        // 	break;

        // case 'solo 8':
        // 	this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(["particleSystem"])
        // 	break;

        // case 'record 8':
        // 	this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(["particleSystem"])
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
        // 	this.main.performers.updateParameters(data);
        // 	break;
        // case 'knob 1':
        // 	data.parameter = "rate"
        // 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
        // 	this.main.performers.updateParameters(data);
        // 	break;

        // // case 'knob 3':
        // // 	data.parameter = "size"
        // // 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
        // // 	this.main.performers.updateParameters(data);
        // // 	break;
        // // case 'slider 3':
        // // 	data.parameter = "color"
        // // 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
        // // 	this.main.performers.updateParameters(data);
        // // 	break;
      }
    });
  }

  initPerceptionNeuronCallbacks() {
    this.inputManager.registerCallback('perceptionneuron', 'message', 'Perception Neuron', this.main.updatePerformers.bind(this.main));
  }

  initNeuroSkyCallbacks() { // https://github.com/elsehow/mindwave
    this.inputManager.registerCallback('mindwave', 'data', 'Mindwave', (data) => { console.log(data); });
  }

  initMyoCallbacks() { // https://github.com/thalmiclabs/myo.js/blob/master/docs.md
    this.inputManager.registerCallback('myo', 'imu', 'Myo', (data) => { console.log(data); });
  }

  initKinectTransportCallbacks() { // Reuires Kinect Transport app.
    /* https://github.com/stimulant/MS-Cube-SDK/tree/research/KinectTransport
		Returns either depth or bodies object. */
    this.inputManager.registerCallback('kinecttransport', 'depth', 'Kinect Depth', this.scene.viewKinectTransportDepth.bind(this.scene));
    this.inputManager.registerCallback('kinecttransport', 'bodies', 'Kinect Body', this.scene.viewKinectTransportBodies.bind(this.scene));
  }

  initKeyboardCallbacks() { // Uses mousetrap: https://github.com/ccampbell/mousetrap
    this.inputManager.registerCallback('keyboard', 'esc', 'Hide / Show Keyboard Shortcuts', this.main.openKeyboardModal.bind(this.main));

    this.inputManager.registerCallback('keyboard', '-', 'Toggle GUI', this.main.toggleGUI.bind(this.main));
    this.inputManager.registerCallback('keyboard', '=', 'Toggle Fullscreen', this.main.toggleFullscreen.bind(this.main));

    this.inputManager.registerCallback('keyboard', 'l', 'Tracking Camera - Low Angle', () => {
    	if (!this.scene.cameraControl.trackingObj) {
	      this.scene.cameraControl.track(
	        this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].performer.meshes.robot_hips,
	        new THREE.Vector3(0, 0.5, 0),
	        new THREE.Vector3(0, 0, 7),
	      );
	  	} else {
	  		this.scene.cameraControl.clearTrack();
	  	}
    });

    // this.inputManager.registerCallback('keyboard', ';', 'Tracking Camera - Zoom Out', function() {
    // 	this.scene.cameraControl.trackZoom(
    // 		new THREE.Vector3(0,0,100),
    // 		TWEEN.Easing.Quadratic.InOut,
    // 		5000
    // 	);
    // }.bind(this));

    // this.inputManager.registerCallback('keyboard', "'", 'Tracking Camera - Zoom In', function() {
    // 	this.scene.cameraControl.trackZoom(
    // 		new THREE.Vector3(0,0,3),
    // 		TWEEN.Easing.Quadratic.InOut,
    // 		5000
    // 	);
    // }.bind(this));

    // this.inputManager.registerCallback('keyboard', "a", 'randomize limb scale', function() {
    // 	_.each(this.main.performers.performers, (performer) => {
    // 		performer.randomizeAll(5000);
    // 	});
    // }.bind(this));

    this.inputManager.registerCallback('keyboard', 'c', 'Vogue Clone', () => {
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].performerEffects.effects[0].clonePerformer();
      // this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].randomizeColors(5000);
    });

    this.inputManager.registerCallback('keyboard', 'q', 'Randomize All Mesh Scale', () => {
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].randomizeAll(5000);
      // this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].randomizeColors(5000);
    });

    this.inputManager.registerCallback('keyboard', 'w', 'Random Limb Scale', () => {
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].randomizeLimbs(5000);
    });

    this.inputManager.registerCallback('keyboard', 'n', 'Detach Left Arm', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('leftshoulder', false);
    });

    this.inputManager.registerCallback('keyboard', 'm', 'Detach Right Arm', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('rightshoulder', false);
    });

    this.inputManager.registerCallback('keyboard', ',', 'Detach Left Leg', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('leftupleg', false);
    });

    this.inputManager.registerCallback('keyboard', '.', 'Detach Right Leg', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('rightupleg', false);
    });

    this.inputManager.registerCallback('keyboard', '/', 'Detach Head', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('head', false);
    });

    // this.inputManager.registerCallback('keyboard', 'space', 'Show Overlay', this.main.toggleStartOverlay.bind(this.main));
    this.inputManager.registerCallback('keyboard', 'space', 'Toggle Floor', () => { this.scene.environments.environments[0].toggleVisible(); });

    // this.inputManager.registerCallback('keyboard', '1', 'Dark Grid Theme', function() { this.switchEnvironment("grid-dark"); }.bind(this.scene));
    // this.inputManager.registerCallback('keyboard', '2', 'Water Theme', function() { this.switchEnvironment("water"); }.bind(this.scene));
    // this.inputManager.registerCallback('keyboard', '3', 'Light Grid Theme', function() { this.switchEnvironment("grid-light"); }.bind(this.scene));
    // this.inputManager.registerCallback('keyboard', '4', 'Gradient Theme', function() { this.switchEnvironment("gradient"); }.bind(this.scene));
    // this.inputManager.registerCallback('keyboard', '5', 'Island Theme', function() { this.switchEnvironment("island"); }.bind(this.scene));

    // Camera positions
    this.inputManager.registerCallback('keyboard', 'r', 'Rotate Camera', this.scene.toggleRotation.bind(this.scene)); // enable / disable camera rotation

    this.inputManager.registerCallback('keyboard', 'q', 'Fly Close', function () { // fly to close up shot
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

    this.inputManager.registerCallback('keyboard', 'w', 'Fly Medium', function () { // fly to medium shot
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

    this.inputManager.registerCallback('keyboard', 'e', 'Fly Wide', function () { // fly to wide shot
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

    // this.inputManager.registerCallback('keyboard', 'a', 'Cut Close', this.cutClose.bind(this)); //cut to close up shot

    // this.inputManager.registerCallback('keyboard', 's', 'Cut Medium', this.cutMedium.bind(this)); //cut to medium shot

    // this.inputManager.registerCallback('keyboard', 'd', 'Cut Wide', function() { //cut to wide shot
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

    this.inputManager.registerCallback('keyboard', 'g', 'Snorry Cam', this.inputManager.snorryCam.bind(this.inputManager)); // look at face

    this.inputManager.registerCallback('keyboard', 'f', 'First Person', this.inputManager.firstPerson.bind(this.inputManager)); // first person view

    this.inputManager.registerCallback('keyboard', 't', 'Track Performer', this.inputManager.trackPerformer.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'y', 'Top View', this.inputManager.flyTop.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'u', '3/4 View', this.inputManager.cutThreeQ.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'i', 'Fly Out', this.inputManager.flyOut.bind(this.inputManager)); // follow x position of performer

    // this.inputManager.registerCallback('keyboard', 'z', 'Env Input', function() { //toggle environment input
    // 	this.scene.environments.toggle("usePerformerInput");
    // }.bind(this));

    // this.inputManager.registerCallback('keyboard', 'x', 'Toggle Wireframe', function() { //toggle environment input
    // 	this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].toggleWireframe();
    // }.bind(this));
  }
}

module.exports = DefaultPreset;
