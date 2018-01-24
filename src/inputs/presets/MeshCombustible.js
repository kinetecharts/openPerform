import Common from './../../util/Common';

class MeshCombustiblePreset {
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

  initMidiControllerCallbacks() {
    this.inputManager.registerCallback('midiController', 'message', 'Midi Controller', (data) => {
      switch (data.name) {
        default:
          console.log('Midi button not found.');
          break;
        case 'cycle':
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].resetScale();
          break;

        case 'track left': // scene 1
          this.scene.switchEnvironment('grid-dark');
          this.main.performers.showWireframe();
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(['trails']);
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(['cloner']);

          this.inputManager.snorryCam();

          break;
        case 'track right': // scene 2
          this.scene.switchEnvironment('water');
          this.main.performers.hideWireframe();
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(['cloner']);
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(['trails']);

          this.inputManager.firstPerson();
          break;

        case 'marker set': // start overlay
          this.scene.cameraControl.trackZ(
            this.main.performers.performers[
              Object.keys(this.main.performers.performers)[0]
            ].performer.robot_hips,
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0, 0, 8),
          );
          break;
        case 'marker left': // black overlay
          this.scene.cameraControl.trackZoom(
            new THREE.Vector3(0, 0, 105),
            TWEEN.Easing.Quadratic.InOut,
            6400,
          );
          break;
        case 'marker right': // end overlay
          this.scene.cameraControl.trackZoom(
            new THREE.Vector3(0, 0, 5),
            TWEEN.Easing.Quadratic.InOut,
            5700,
          );
          break;

        case 'stop':
          this.scene.unsetRotation();
          break;
        case 'play':
          this.scene.setRotation();
          break;

        case 'solo 1':
          this.inputManager.snorryCam();
          break;

        case 'solo 2':
          this.inputManager.cutMedium();
          break;

        case 'solo 3':
          this.inputManager.cutMedium();
          this.inputManager.trackPerformer();
          break;

        case 'solo 4':
          this.inputManager.flyTop();
          break;

        case 'solo 5':
          this.inputManager.cutThreeQ();
          break;

        case 'solo 6':
          this.inputManager.firstPerson();
          break;

        case 'solo 7':
          this.inputManager.cutMedium();
          this.scene.cameraControl.track(
            this.main.performers.performers[
              Object.keys(this.main.performers.performers)[0]
            ].performer.robot_hips,
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0, 0, 7),
          );
          break;

        case 'solo 8':
          this.inputManager.rotate();
          break;

        case 'record 1':
          this.inputManager.trackClose();
          break;

        case 'record 2':
          this.inputManager.flyOut();
          break;

        case 'slider 8':
          data.parameter = 'waves';
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
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].randomizeLimbs(Common.mapRange(data.value, 0, 127, 1, 5000));
          break;

        case 'slider 7':
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].randomizeAll(Common.mapRange(data.value, 0, 127, 1, 5000));
          break;

        case 'mute 1':
          this.scene.cameraControl.trackZoom(
            new THREE.Vector3(0, 0, 24),
            TWEEN.Easing.Quadratic.InOut,
            1000,
          );
          break;

        case 'mute 2':
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].randomizeLimbs(5000);
          break;

        case 'mute 3':
          this.scene.cameraControl.trackZoom(
            new THREE.Vector3(0, 0, 7),
            TWEEN.Easing.Quadratic.InOut,
            20000,
          );
          break;

        case 'mute 4':
          this.scene.cameraControl.trackZoom(
            new THREE.Vector3(0, 0, 3),
            TWEEN.Easing.Quadratic.InOut,
            20000,
          );
          break;

        case 'mute 5':
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].randomizeAll(5000);
          break;

        case 'mute 6':
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].scalePart('hips', 500, 1000);
          break;
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
    // https://github.com/stimulant/MS-Cube-SDK/tree/research/KinectTransport
    // Returns either depth or bodies object.
    this.inputManager.registerCallback('kinecttransport', 'depth', 'Kinect Depth', this.scene.viewKinectTransportDepth.bind(this.scene));
    this.inputManager.registerCallback('kinecttransport', 'bodies', 'Kinect Body', this.scene.viewKinectTransportBodies.bind(this.scene));
  }

  initKeyboardCallbacks() { // Uses mousetrap: https://github.com/ccampbell/mousetrap
    this.inputManager.registerCallback('keyboard', 'esc', 'Hide / Show Keyboard Shortcuts', this.main.openKeyboardModal.bind(this.main));

    this.inputManager.registerCallback('keyboard', '-', 'Toggle GUI', this.main.toggleGUI.bind(this.main));
    this.inputManager.registerCallback('keyboard', '=', 'Toggle Fullscreen', this.main.toggleFullscreen.bind(this.main));

    this.inputManager.registerCallback('keyboard', 'l', 'low track', () => {
      this.scene.cameraControl.track(
        this.main.performers.performers[
          Object.keys(this.main.performers.performers)[0]
        ].performer.robot_hips,
        new THREE.Vector3(0, 0.5, 0),
        new THREE.Vector3(0, 0, 7),
      );
    });

    this.inputManager.registerCallback('keyboard', ';', 'zoom out', () => {
      this.scene.cameraControl.trackZoom(
        new THREE.Vector3(0, 0, 100),
        TWEEN.Easing.Quadratic.InOut,
        5000,
      );
    });

    this.inputManager.registerCallback('keyboard', "'", 'zoom in', () => {
      this.scene.cameraControl.trackZoom(
        new THREE.Vector3(0, 0, 3),
        TWEEN.Easing.Quadratic.InOut,
        5000,
      );
    });

    this.inputManager.registerCallback('keyboard', 'q', 'randomize limb scale', () => {
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].randomizeAll(5000);
    });

    this.inputManager.registerCallback('keyboard', 'w', 'randomize limb scale', () => {
      this.main.performers.performers[
        Object.keys(this.main.performers.performers)[0]
      ].randomizeLimbs(5000);
    });

    this.inputManager.registerCallback('keyboard', 'space', 'Hide Floor', () => { this.scene.environments.environments[0].toggleGrid(); });

    this.inputManager.registerCallback('keyboard', 'n', 'Unparent', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('leftshoulder', false);
    });

    this.inputManager.registerCallback('keyboard', 'm', 'Unparent', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('rightshoulder', false);
    });

    this.inputManager.registerCallback('keyboard', ',', 'Unparent', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('leftupleg', false);
    });

    this.inputManager.registerCallback('keyboard', '.', 'Unparent', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('rightupleg', false);
    });

    this.inputManager.registerCallback('keyboard', '/', 'Unparent', () => { // toggle environment input
      this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].unParentPart('head', false);
    });
  }
}

module.exports = MeshCombustiblePreset;
