import Common from './../../util/Common';
import Config from './../../config';

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
      case 'osccontroller':
        this.initOSCControllerCallbacks();
        break;
      case 'posenet':
        this.initPoseNetCallbacks();
        break;
      case 'iphonex':
        this.initIPhoneXCallbacks();
        break;
    }
  }

  initPoseNetCallbacks() {
    this.inputManager.registerCallback('posenet', 'message', 'PoseNet', this.main.updatePerformers.bind(this.main));
  }

  initIPhoneXCallbacks() {
    // this.inputManager.registerCallback('iphonex', 'message', 'iPhone X', this.main.updateHead.bind(this.main));
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
        if (
          leftStick[0].x.value !== previous.lStickX ||
          leftStick[0].y.value !== previous.lStickY
        ) {
          console.log('Left Stick Moved: ', leftStick);
        }
      }

      const rightStick = _.merge(_.map(_.filter(data, d => d.id.slice(0, 5) === 'Right'), (d) => {
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

      const dPad = _.merge(_.map(_.filter(data, d => d.id.slice(0, 4) === 'DPad'), (d) => {
        const obj = {};
        obj[d.id.slice(d.id.length - 1, d.id.length).toLowerCase()] = d;
        return obj;
      }));
      if (dPad.length > 0) {
        if (dPad[0].x) {
          if (dPad[0].x.direction !== previous.dpadX) {
            if (dPad[0].x.direction === 1) {
              console.log('D-Pad Right: ', dPad[0].x.direction);
            }

            if (dPad[0].x.direction === -1) {
              console.log('D-Pad Left: ', dPad[0].x.direction);
            }

            previous.dpadX = dPad[0].x.direction;
          }
        }
        if (dPad[0].y) {
          if (dPad[0].y.direction !== previous.dpadY) {
            if (dPad[0].y.direction === 1) {
              console.log('D-Pad Up: ', dPad[0].y.direction);
            }

            if (dPad[0].y.direction === -1) {
              console.log('D-Pad Down: ', dPad[0].y.direction);
            }

            previous.dpadY = dPad[0].y.direction;
          }
        }
      }

      const aButton = _.filter(data, d => d.id === 'A');
      if (aButton.length > 0) {
        if (aButton[0].pressed !== previous.a) {
          if (aButton[0].pressed) {
            console.log('A Button Pressed: ', aButton[0].pressed);
          }
        }
        previous.a = aButton[0].pressed;
      }

      const bButton = _.filter(data, d => d.id === 'B');
      if (bButton.length > 0) {
        if (bButton[0].pressed !== previous.b) {
          if (bButton[0].pressed) {
            console.log('B Button Pressed: ', bButton[0].pressed);
          }
        }
        previous.b = bButton[0].pressed;
      }

      const xButton = _.filter(data, d => d.id === 'X');
      if (xButton.length > 0) {
        if (xButton[0].pressed !== previous.x) {
          if (xButton[0].pressed) {
            console.log('X Button Pressed: ', xButton[0].pressed);
          }
        }
        previous.x = xButton[0].pressed;
      }

      const yButton = _.filter(data, d => d.id === 'Y');
      if (yButton.length > 0) {
        if (yButton[0].pressed !== previous.y) {
          if (yButton[0].pressed) {
            console.log('Y Button Pressed: ', yButton[0].pressed);
          }
        }
        previous.y = yButton[0].pressed;
      }

      const lbButton = _.filter(data, d => d.id === 'LB');
      if (lbButton.length > 0) {
        if (lbButton[0].pressed !== previous.lb) {
          if (lbButton[0].pressed) {
            console.log('LB Button Pressed: ', lbButton[0].pressed);
          }
        }
        previous.lb = lbButton[0].pressed;
      }

      const rbButton = _.filter(data, d => d.id === 'RB');
      if (rbButton.length > 0) {
        if (rbButton[0].pressed !== previous.rb) {
          if (rbButton[0].pressed) {
            console.log('RB Button Pressed: ', rbButton[0].pressed);
          }
        }
        previous.rb = rbButton[0].pressed;
      }

      const ltButton = _.filter(data, d => d.id === 'LT');
      if (ltButton.length > 0) {
        if (ltButton[0].pressed !== previous.lt) {
          if (ltButton[0].pressed) {
            console.log('LT Button Pressed: ', ltButton[0].pressed);
          }
        }
        previous.lt = ltButton[0].pressed;
      }

      const rtButton = _.filter(data, d => d.id === 'RT');
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

  initOSCControllerCallbacks() {
    this.performerIdx = 0;
    this.inputManager.registerCallback('oscController', 'message', 'OSC Controller', (data) => {
      // console.log(data);
      const controlPath = data[0].split('/');
      // console.log(controlPath);
      switch(controlPath[1]) { // page
        default:
          console.log('OSC Page not found: ', controlPath[1]);
          break;
        case 'controls':
          switch(controlPath[2]) { // group
            default:
              console.log('OSC Group not found: ', controlPath[2]);
              break;
            case 'circle':
              switch(parseInt(controlPath[3])) { // row
                default:
                  console.log('OSC Row not found: ', parseInt(controlPath[3]));
                  break;
                case 1:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[4]));
                      break;
                    case 1:
                      this.inputManager.resetPosRot(0);
                      break;
                    case 2:
                      this.inputManager.circleClonesById(0);
                      break;
                  }
                  break;
              }
              break;
            case 'effect':
              switch(parseInt(controlPath[3])) { // row
                default:
                  console.log('OSC Row not found: ', parseInt(controlPath[3]));
                  break;
                case 2:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[4]));
                      break;
                    case 1:
                      if (parseInt(data[1])) {
                        this.inputManager.removeEffects();
                      }
                      break;
                    case 2:
                      if (parseInt(data[1])) {
                        this.inputManager.removeEffects();
                        this.inputManager.addEffectToClonesAndLeader(0, 'ribbons');
                      }
                      break;
                  }
                  break;
              }
            break;
            case 'clip':
              switch(parseInt(controlPath[3])) { // row
                default:
                  console.log('OSC Row not found: ', parseInt(controlPath[3]));
                  break;
                case 1:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[4]));
                      break;
                    case 1:
                      if (parseInt(data[1])) {
                        this.main.BVHPlayers[0].switchClip(0);
                      }
                      break;
                    case 2:
                      if (parseInt(data[1])) {
                        this.scene.unsetRotation();
                        this.main.BVHPlayers[0].switchClip(1);
                      }
                      break;
                    case 3:
                      if (parseInt(data[1])) {
                        this.scene.unsetRotation();
                        this.main.BVHPlayers[0].switchClip(2);
                      }
                      break;
                    case 4:
                      if (parseInt(data[1])) {
                        this.scene.unsetRotation();
                        this.main.BVHPlayers[0].switchClip(3);
                      }
                      break;
                    case 5:
                      if (parseInt(data[1])) {
                        this.scene.unsetRotation();
                        this.main.BVHPlayers[0].switchClip(4);
                      }
                      break;
                    case 6:
                      if (parseInt(data[1])) {
                        this.scene.unsetRotation();
                        this.main.BVHPlayers[0].switchClip(5);
                      }
                      break;
                  }
                  break;
              }
              break;
            case 'camera':
              switch(parseInt(controlPath[3])) { // row
                default:
                  console.log('OSC Row not found: ', parseInt(controlPath[3]));
                  break;
                case 1:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[4]));
                      break;
                    case 1:
                      if (parseInt(data[1])) {
                        this.inputManager.rotate(7);
                      }
                      break;
                    case 2:
                      if (parseInt(data[1])) {
                        this.scene.unsetRotation();
                        this.inputManager.trackPerformer(0, 7);
                      }
                      break;
                    case 3:
                      if (parseInt(data[1])) {
                        this.scene.unsetRotation();
                        this.inputManager.cutTop(0, 7);
                      }
                      break;
                    case 4:
                      if (parseInt(data[1])) {
                        this.scene.unsetRotation();
                        this.inputManager.snorry(2000);
                      }
                      break;
                  }
                  break;
              }
              break;
              case 'visible':
              switch(parseInt(controlPath[3])) { // row
                default:
                  console.log('OSC Row not found: ', parseInt(controlPath[3]));
                  break;
                case 1:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[3]));
                      break;
                    case 1:
                      this.main.performers.hidePerformers();
                      break;
                    case 2:
                      this.main.performers.showPerformers();
                      break;
                  }
                  break;
              }
              break;
            case 'wireframe':
              switch(parseInt(controlPath[3])) { // row
                default:
                  console.log('OSC Row not found: ', parseInt(controlPath[3]));
                  break;
                case 1:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[4]));
                      break;
                    case 1:
                      this.main.performers.hideWireframe();
                      break;
                    case 2:
                      this.main.performers.showWireframe();
                      break;
                  }
                  break;
              }
              break;
            case 'rotSpace':
              this.inputManager.spreadClonesById(0, data[2] * 127);
              this.inputManager.rotateClonesById(0, data[1] * 127);
              break;
            case 'scale':
              this.inputManager.scaleClonesById(0, data[1] * 127);
              break;
            case 'delay':
              this.inputManager.delayClonesById(0, data[1] * 127);
              break;
            case 'color':
              // console.log(parseInt(controlPath[3]));
              switch(parseInt(controlPath[3])) { // row
                default:
                  console.log('OSC Row not found: ', parseInt(controlPath[3]));
                  break;
                case 2:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[4]));
                      break;
                    case 1:
                      if (parseInt(data[1])) {
                        this.main.setColor(0);
                      }
                      break;
                    case 2:
                      if (parseInt(data[1])) {
                        this.main.setColor(1);
                      }
                      break;
                    case 3:
                      if (parseInt(data[1])) {
                        this.main.setColor(2);
                      }
                      break;
                  }
                  break;
                case 1:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[4]));
                      break;
                    case 1:
                      if (parseInt(data[1])) {
                        this.main.setColor(3);
                      }
                      break;
                    case 2:
                      if (parseInt(data[1])) {
                        this.main.setColor(4);
                      }
                      break;
                    case 3:
                      if (parseInt(data[1])) {
                        this.main.setColor(5);
                      }
                      break;
                  }
                  break;
              }
              break;
          }
          break;
        case 'admin':
          switch(controlPath[2]) { // group
            default:
              console.log('OSC Group not found: ', controlPath[2]);
              break;
            case 'init':
              switch(parseInt(controlPath[3])) { // row
                default:
                  console.log('OSC Row not found: ', parseInt(controlPath[3]));
                  break;
                case 1:
                  switch(parseInt(controlPath[4])) { // col
                    default:
                      console.log('OSC Col not found: ', parseInt(controlPath[4]));
                      break;
                    case 1: // id
                      console.log('Admin Button 4: ', data[1]);
                      if (parseInt(data[1])) {
                        this.resetAll();
                      }
                      break;
                  }
                  break;
              }
              break;
          }
          break;
      }
      // const row = controlPath[3];
      // const col = controlPath[4];
      // const val = data[0];
    });
  }

  resetAll() {
    for (let i=0; i< 5; i++) {
      this.main.performers.add(
        this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].name + ' Clone ' + i,
        'clone_' + this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].type,
        this.main.performers.performers[Object.keys(this.main.performers.performers)[0]],
        null,
        {
          wireframe: false,
          color: 'ffffff',
          material: 'basic',
          visible: true,
          tracking: false,
          intensity: 1,
          style: 'default',
          offset: new THREE.Vector3(),
        },
      );
    }
  }

  initMidiControllerCallbacks() {
    this.performerIdx = 0;
    this.inputManager.registerCallback('midiController', 'message', 'Midi Controller', (data) => {
      switch (data.name) {
        default:
          console.log('Midi button not found.');
          break;
        case 'cycle':
          this.inputManager.resetScale();
          break;

        case 'marker set': // start overlay
          this.inputManager.fixedTracking();
          break;
        case 'marker left': // black overlay
          this.inputManager.shrink();
          break;
        case 'marker right': // end overlay
          this.inputManager.grow();
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
          this.inputManager.trackPerformer(0, 14);
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
          this.inputManager.trackPerformer(1, 14);
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
          this.inputManager.trackPerformer(2, 14);
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
          this.inputManager.trackPerformer(3, 14);
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
          this.inputManager.trackPerformer(4, 14);
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
          this.inputManager.trackPerformer(5, 14);
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
          this.inputManager.trackPerformer(6, 14);
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
          this.inputManager.trackPerformer(7, 14);
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
    this.inputManager.registerCallback('kinecttransport', 'bodies', 'Kinect Body', this.main.updatePerformers.bind(this.main));
  }

  initKeyboardCallbacks() { // Uses mousetrap: https://github.com/ccampbell/mousetrap
    this.inputManager.registerCallback('keyboard', 'esc', 'Hide / Show Keyboard Shortcuts', this.main.openKeyboardModal.bind(this.main));

    this.inputManager.registerCallback('keyboard', '-', 'Toggle GUI', this.main.toggleGUI.bind(this.main));
    this.inputManager.registerCallback('keyboard', '=', 'Toggle Fullscreen', this.main.toggleFullscreen.bind(this.main));

    this.inputManager.registerCallback('keyboard', 'l', 'Tracking Camera - Low Angle', () => {
      if (!this.scene.cameraControl.trackingObj) {
        this.scene.cameraControl.track(
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].performer.meshes.robot_hips,
          new THREE.Vector3(0, 0.5, 0),
          new THREE.Vector3(0, 0, 7),
        );
      } else {
        this.scene.cameraControl.clearTrack();
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

    this.inputManager.registerCallback('keyboard', 'space', 'Toggle Floor', () => { this.scene.environments.environments[0].toggleVisible(); });

    // Camera positions
    this.inputManager.registerCallback('keyboard', 'r', 'Rotate Camera', this.scene.toggleRotation.bind(this.scene)); // enable / disable camera rotation

    // this.inputManager.registerCallback('keyboard', 'q', 'Fly Close', () => { // fly to close up shot
    //   this.scene.cameraControl.fly_to(
    //     Config.camera.closeShot.position,
    //     new THREE.Vector3(0, 0, 0),
    //     Config.camera.closeShot.look,
    //     TWEEN.Easing.Quadratic.InOut,
    //     'path',
    //     3000,
    //     1,
    //     () => { console.log('Camera moved!'); },
    //   );
    // });

    // this.inputManager.registerCallback('keyboard', 'w', 'Fly Medium', () => { // fly to medium shot
    //   this.scene.cameraControl.fly_to(
    //     Config.camera.mediumShot.position,
    //     new THREE.Vector3(0, 0, 0),
    //     Config.camera.mediumShot.look,
    //     TWEEN.Easing.Quadratic.InOut,
    //     'path',
    //     3000,
    //     1,
    //     () => { console.log('Camera moved!'); },
    //   );
    // });

    this.inputManager.registerCallback('keyboard', 'e', 'Fly Wide', () => { // fly to wide shot
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

    this.inputManager.registerCallback('keyboard', 't', 'Track Performer', this.inputManager.trackPerformer.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'y', 'Top View', this.inputManager.flyTop.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'u', '3/4 View', this.inputManager.cutThreeQ.bind(this.inputManager)); // follow x position of performer

    this.inputManager.registerCallback('keyboard', 'i', 'Fly Out', this.inputManager.flyOut.bind(this.inputManager)); // follow x position of performer

    const spread = 0.5;
    const scale = 0.001;
    const delay = 0.25;
    this.inputManager.registerCallback('keyboard', 'left', 'Fly Out', this.inputManager.cannonize.bind(this.inputManager, new THREE.Vector3(-1,0,0), spread, scale, delay));
    this.inputManager.registerCallback('keyboard', 'up', 'Fly Out', this.inputManager.cannonize.bind(this.inputManager, new THREE.Vector3(0,0,-1), spread, scale, delay));
    this.inputManager.registerCallback('keyboard', 'right', 'Fly Out', this.inputManager.cannonize.bind(this.inputManager, new THREE.Vector3(1,0,0), spread, scale, delay));
    this.inputManager.registerCallback('keyboard', 'down', 'Fly Out', this.inputManager.cannonize.bind(this.inputManager, new THREE.Vector3(0,0,1), spread, scale, delay));
  }
}

module.exports = DefaultPreset;
