import Common from './../../util/Common';
import Config from './../../config';

class TransformWorkPreset {
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
    const previous = {
      dpadX: 0,
      dpadY: 0,
      lStickX: 0,
      lStickY: 0,
      rStickX: 0,
      rStickY: 0,
      x: 0,
      y: 0,
      a: 0,
      b: 0,
      lb: 0,
      rb: 0,
      lt: 0,
      rt: 0,
    };

    this.inputManager.registerCallback('gamepads', 'message', 'Gamepad', (data) => {
      const leftStick = _.merge(_.map(_.filter(data, d => d.id.slice(0, 4) === 'Left'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d;
        return obj;
      }));
      if (leftStick.length > 0) {
        if (leftStick[0].x) {
          if (leftStick[0].x.value !== previous.lStickX) {
            this.inputManager.updateIntensity(
              1,
              Common.mapRange(Math.abs(leftStick[0].x.value), 0, 1, 0.1, 10),
            );
          }
          previous.lStickX = leftStick[0].x.value;
        }
      }


      const rightStick = _.merge(_.map(_.filter(data, d => d.id.slice(0, 5) === 'Right'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d;
        return obj;
      }));
      if (rightStick.length > 0) {
        if (rightStick[0].x) {
          if (rightStick[0].x.value !== previous.rStickX) {
            this.inputManager.updateIntensity(
              2,
              Common.mapRange(Math.abs(rightStick[0].x.value), 0, 1, 0.1, 10),
            );
          }
          previous.rStickX = rightStick[0].x.value;
        }
      }

      const dPad = _.merge(_.map(_.filter(data, d => d.id.slice(0, 4) === 'DPad'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d;
        return obj;
      }));
      if (dPad.length > 0) {
        if (dPad[0].x) {
          if (dPad[0].x.direction !== previous.dpadX) {
            if (dPad[0].x.direction === 1) {
              this.inputManager.timedStyleSwap('diff');
            }

            if (dPad[0].x.direction === -1) {
              this.inputManager.timedStyleSwap('same');
            }

            previous.dpadX = dPad[0].x.direction;
          }
        }
        if (dPad[0].y) {
          if (dPad[0].y.direction !== previous.dpadY) {
            if (dPad[0].y.direction === 1) {
              console.log('Up dpad pressed');
            }

            if (dPad[0].y.direction === -1) {
              console.log('Up dpad pressed');
            }

            previous.dpadY = dPad[0].y.direction;
          }
        }
      }

      const aButton = _.filter(data, d => d.id === 'A');
      if (aButton.length > 0) {
        if (aButton[0].pressed !== previous.a) {
          if (aButton[0].pressed) {
            this.main.performers.performers[
              Object.keys(this.main.performers.performers)[0]
            ].performerEffects.effects[0].clonePerformer();
          }
        }
        previous.a = aButton[0].pressed;
      }

      const bButton = _.filter(data, d => d.id === 'B');
      if (bButton.length > 0) {
        if (bButton[0].pressed !== previous.b) {
          if (bButton[0].pressed) {
            console.log('B button pressed');
          }
        }
        previous.b = bButton[0].pressed;
      }

      const xButton = _.filter(data, d => d.id === 'X');
      if (xButton.length > 0) {
        if (xButton[0].pressed !== previous.x) {
          if (xButton[0].pressed) {
            this.inputManager.switchScene('default');
          }
        }
        previous.x = xButton[0].pressed;
      }

      const yButton = _.filter(data, d => d.id === 'Y');
      if (yButton.length > 0) {
        if (yButton[0].pressed !== previous.y) {
          if (yButton[0].pressed) {
            this.main.toggleStartOverlay();
          }
        }
        previous.y = yButton[0].pressed;
      }

      const lbButton = _.filter(data, d => d.id === 'LB');
      if (lbButton.length > 0) {
        if (lbButton[0].pressed !== previous.lb) {
          if (lbButton[0].pressed) {
            this.main.cycleColors(4709);
          }
        }
        previous.lb = lbButton[0].pressed;
      }

      const rbButton = _.filter(data, d => d.id === 'RB');
      if (rbButton.length > 0) {
        if (rbButton[0].pressed !== previous.rb) {
          if (rbButton[0].pressed) {
            this.main.cycleColors(4709 / 2);
          }
        }
        previous.rb = rbButton[0].pressed;
      }

      const ltButton = _.filter(data, d => d.id === 'LT');
      if (ltButton.length > 0) {
        if (ltButton[0].pressed !== previous.lt) {
          if (ltButton[0].pressed) {
            this.inputManager.prevScene();
          }
        }
        previous.lt = ltButton[0].pressed;
      }

      const rtButton = _.filter(data, d => d.id === 'RT');
      if (rtButton.length > 0) {
        if (rtButton[0].pressed !== previous.rt) {
          if (rtButton[0].pressed) {
            this.inputManager.nextScene();
          }
        }
        previous.rt = rtButton[0].pressed;
      }
    });
  }

  initMidiControllerCallbacks() {
    this.inputManager.performerIdx = 0;
    this.inputManager.registerCallback('midiController', 'message', 'Midi Controller', (data) => {
      switch (data.name) {
        default:
          console.log('Midi button not found.');
          break;
        case 'cycle':
          this.inputManager.resetScale();
          break;
        case 'marker set': // start overlay
          this.inputManager.fixedFollowing();
          break;
        case 'marker left': // black overlay
          this.inputManager.shrink();
          break;
        case 'marker right': // end overlay
          this.inputManager.grow();
          break;

        case 'rewind':
          this.inputManager.performerIdx--;
          if (this.inputManager.performerIdx < 0) {
            this.inputManager.performerIdx = this.main.BVHPlayers.length - 1;
          }
          break;

        case 'fast forward':
          this.inputManager.performerIdx++;
          if (this.inputManager.performerIdx > this.main.BVHPlayers.length - 1) {
            this.inputManager.performerIdx = 0;
          }
          break;

        case 'stop':
          this.main.BVHPlayers[this.inputManager.performerIdx].stop();
          break;

        case 'play':
          this.main.BVHPlayers[this.inputManager.performerIdx].play();
          break;

        case 'record':
          if (this.main.BVHPlayers.length <= 8) {
            this.main.addBVHPerformer(this.main.BVHFiles[
              this.main.BVHPlayers.length
            ]);
          } else {
            console.log('BVH Limit Reached!');
          }
          break;


        case 'solo 1':
          this.inputManager.followPerformer(0, 14);
          break;
        case 'mute 1':
          this.inputManager.prevStyle(0);
          break;
        case 'record 1':
          this.inputManager.nextStyle(0);
          break;
        case 'slider 1':
          this.inputManager.scalePerformer(0, data.value);
          break;
        case 'knob 1':
          this.inputManager.updateIntensity(0, data.value);
          break;

          /** ************************************** */

        case 'solo 2':
          this.inputManager.followPerformer(1, 14);
          break;
        case 'mute 2':
          this.inputManager.prevStyle(1);
          break;
        case 'record 2':
          this.inputManager.nextStyle(1);
          break;
        case 'slider 2':
          this.inputManager.scalePerformer(1, data.value);
          break;
        case 'knob 2':
          this.inputManager.updateIntensity(1, data.value);
          break;

          /** ************************************** */

        case 'solo 3':
          this.inputManager.followPerformer(2, 14);
          break;
        case 'mute 3':
          this.inputManager.prevStyle(2);
          break;
        case 'record 3':
          this.inputManager.nextStyle(2);
          break;
        case 'slider 3':
          this.inputManager.scalePerformer(2, data.value);
          break;
        case 'knob 3':
          this.inputManager.updateIntensity(2, data.value);
          break;

          /** ************************************** */

        case 'solo 4':
          this.inputManager.followPerformer(3, 14);
          break;
        case 'mute 4':
          this.inputManager.prevStyle(3);
          break;
        case 'record 4':
          this.inputManager.nextStyle(3);
          break;
        case 'slider 4':
          this.inputManager.scalePerformer(3, data.value);
          break;
        case 'knob 4':
          this.inputManager.updateIntensity(3, data.value);
          break;

          /** ************************************** */

        case 'solo 5':
          this.inputManager.followPerformer(4, 14);
          break;
        case 'mute 5':
          this.inputManager.prevStyle(4);
          break;
        case 'record 5':
          this.inputManager.nextStyle(4);
          break;
        case 'slider 5':
          this.inputManager.scalePerformer(4, data.value);
          break;
        case 'knob 5':
          this.inputManager.updateIntensity(4, data.value);
          break;

          /** ************************************** */

        case 'solo 6':
          this.inputManager.followPerformer(5, 14);
          break;
        case 'mute 6':
          this.inputManager.prevStyle(5);
          break;
        case 'record 6':
          this.inputManager.nextStyle(5);
          break;
        case 'slider 6':
          this.inputManager.scalePerformer(5, data.value);
          break;
        case 'knob 6':
          this.inputManager.updateIntensity(5, data.value);
          break;

          /** ************************************** */

        case 'solo 7':
          this.inputManager.followPerformer(6, 14);
          break;
        case 'mute 7':
          this.inputManager.prevStyle(6);
          break;
        case 'record 7':
          this.inputManager.nextStyle(6);
          break;
        case 'slider 7':
          this.inputManager.scalePerformer(6, data.value);
          break;
        case 'knob 7':
          this.inputManager.updateIntensity(6, data.value);
          break;

          /** ************************************** */

        case 'solo 8':
          this.inputManager.followPerformer(7, 14);
          break;
        case 'mute 8':
          this.inputManager.prevStyle(7);
          break;
        case 'record 8':
          this.inputManager.nextStyle(7);
          break;
        case 'slider 8':
          this.inputManager.scalePerformer(7, data.value);
          break;
        case 'knob 8':
          this.inputManager.updateIntensity(7, data.value);
          break;

        /** ************************************** */
      }
    });
  }

  initPerceptionNeuronCallbacks() {
    this.inputManager.registerCallback('perceptionNeuron', 'message', 'Perception Neuron', this.main.updatePerformers.bind(this.main));
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
    
    this.inputManager.registerCallback('keyboard', '`', 'Switch to Default scene.', this.inputManager.switchScene.bind(this.inputManager, 'defaut'));
    this.inputManager.registerCallback('keyboard', '1', 'Switch to 1st scene.', this.inputManager.switchScene.bind(this.inputManager, 1));
    this.inputManager.registerCallback('keyboard', '2', 'Switch to 2nd scene.', this.inputManager.switchScene.bind(this.inputManager, 2));
    this.inputManager.registerCallback('keyboard', '3', 'Switch to 3rd scene.', this.inputManager.switchScene.bind(this.inputManager, 3));
    this.inputManager.registerCallback('keyboard', '4', 'Switch to 4th scene.', this.inputManager.switchScene.bind(this.inputManager, 4));
    this.inputManager.registerCallback('keyboard', '5', 'Switch to 5th scene.', this.inputManager.switchScene.bind(this.inputManager, 5));
    this.inputManager.registerCallback('keyboard', '6', 'Switch to 6th scene.', this.inputManager.switchScene.bind(this.inputManager, 6));
    this.inputManager.registerCallback('keyboard', '7', 'Switch to 7th scene.', this.inputManager.switchScene.bind(this.inputManager, 7));
    this.inputManager.registerCallback('keyboard', '8', 'Switch to 8th scene.', this.inputManager.switchScene.bind(this.inputManager, 8));
    this.inputManager.registerCallback('keyboard', '9', 'Switch to 9th scene.', this.inputManager.switchScene.bind(this.inputManager, 9));
    this.inputManager.registerCallback('keyboard', '0', 'Switch to 10th scene.', this.inputManager.switchScene.bind(this.inputManager, 0));

    this.inputManager.registerCallback('keyboard', 'l', 'Following Camera - Low Angle', () => {
      if (!this.scene.cameraControl.followingObj) {
        this.scene.cameraControl.follow(
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].performer.meshes.mixamorighips,
          new THREE.Vector3(0, 0.5, 0),
          new THREE.Vector3(0, 0, 7),
        );
      } else {
        this.scene.cameraControl.clearFollow();
      }
    });

    this.inputManager.registerCallback('keyboard', 'c', 'Vogue Clone', () => {
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].performerEffects.effects[0].clonePerformer();
    });

    this.inputManager.registerCallback('keyboard', 'q', 'Randomize All Mesh Scale', () => {
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].randomizeAll(5000);
    });

    this.inputManager.registerCallback('keyboard', 'w', 'Random Limb Scale', () => {
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].randomizeLimbs(5000);
    });

    this.inputManager.registerCallback('keyboard', 'n', 'Detach Left Arm', () => { // toggle environment input
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].unParentPart('leftshoulder', false);
    });

    this.inputManager.registerCallback('keyboard', 'm', 'Detach Right Arm', () => { // toggle environment input
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].unParentPart('rightshoulder', false);
    });

    this.inputManager.registerCallback('keyboard', ',', 'Detach Left Leg', () => { // toggle environment input
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].unParentPart('leftupleg', false);
    });

    this.inputManager.registerCallback('keyboard', '.', 'Detach Right Leg', () => { // toggle environment input
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].unParentPart('rightupleg', false);
    });

    this.inputManager.registerCallback('keyboard', '/', 'Detach Head', () => { // toggle environment input
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].unParentPart('head', false);
    });

    this.inputManager.registerCallback('keyboard', 'space', 'Show Overlay', this.main.toggleStartOverlay.bind(this.main));
    // Camera positions
    this.inputManager.registerCallback('keyboard', 'r', 'Rotate Camera', this.scene.toggleRotation.bind(this.scene)); // enable / disable camera rotation

    this.inputManager.registerCallback('keyboard', 'q', 'Fly Close', () => { // fly to close up shot
      if (this.scene.camera.parent.type !== 'Scene') {
        this.scene.cameraControl.changeParent(this.scene);
      }
      this.scene.cameraControl.fly_to(
        Config.camera.closeShot.position,
        new THREE.Vector3(0, 0, 0),
        Config.camera.closeShot.look,
        TWEEN.Easing.Quadratic.InOut,
        'path',
        3000,
        1,
        () => { console.log('Camera moved!'); },
      );
    });

    this.inputManager.registerCallback('keyboard', 'w', 'Fly Medium', () => { // fly to medium shot
      if (this.scene.camera.parent.type !== 'Scene') {
        this.scene.cameraControl.changeParent(this.scene);
      }
      this.scene.cameraControl.fly_to(
        Config.camera.mediumShot.position,
        new THREE.Vector3(0, 0, 0),
        Config.camera.mediumShot.look,
        TWEEN.Easing.Quadratic.InOut,
        'path',
        3000,
        1,
        () => { console.log('Camera moved!'); },
      );
    });

    this.inputManager.registerCallback('keyboard', 'e', 'Fly Wide', () => { // fly to wide shot
      if (this.scene.camera.parent.type !== 'Scene') {
        this.scene.cameraControl.changeParent(this.scene);
      }
      this.scene.cameraControl.fly_to(
        Config.camera.wideShot.position,
        new THREE.Vector3(0, 0, 0),
        Config.camera.wideShot.look,
        TWEEN.Easing.Quadratic.InOut,
        'path',
        3000,
        1,
        () => { console.log('Camera moved!'); },
      );
    });

    this.inputManager.registerCallback('keyboard', 'g', 'Snorry Cam', this.inputManager.snorryCam.bind(this.inputManager)); // look at face

    this.inputManager.registerCallback('keyboard', 'f', 'First Person', this.inputManager.firstPerson.bind(this.inputManager)); // first person view

    this.inputManager.registerCallback('keyboard', 't', 'Follow Performer', this.inputManager.followPerformer.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'y', 'Top View', this.inputManager.flyTop.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'u', '3/4 View', this.inputManager.cutThreeQ.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'i', 'Fly Out', this.inputManager.flyOut.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'left', 'Previous Colors', this.main.prevColors.bind(this.main));
    this.inputManager.registerCallback('keyboard', 'right', 'Next Colors', this.main.nextColors.bind(this.main));
  }
}

module.exports = TransformWorkPreset;
