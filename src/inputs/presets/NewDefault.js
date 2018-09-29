import Common from './../../util/Common';
import Config from './../../config';

class DualityPreset {
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
          console.log('Midi button not found');
          break;
        case 'cycle':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].resetScale();
          break;

        case 'track left': // scene 1
          // this.scene.switchEnvironment("grid");
          this.main.performers.hideWireframe();
          // this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(['ghosting']);

          this.main.performers.add(
            this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].name + ' Clone 1',
            'clone_' + this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].type,
            this.main.performers.performers[Object.keys(this.main.performers.performers)[0]],
            null,
            {
              wireframe: true,
              color: 'ffffff',
              material: 'basic',
              visible: true,
              following: false,
              intensity: 1,
              style: 'default',
              offset: new THREE.Vector3(),
            },
          );
          // this.main.performers.add(
          //   this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].name + ' Clone 2',
          //   'clone_' + this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].type,
          //   this.main.performers.performers[Object.keys(this.main.performers.performers)[0]],
          //   null,
          //   {
          //     wireframe: true,
          //     color: '5eacd7',
          //     material: 'basic',
          //     visible: true,
          //     following: false,
          //     intensity: 1,
          //     style: 'default',
          //     offset: new THREE.Vector3(),
          //   },
          // );

          // this.main.performers.add(
          //   this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].name + ' Clone 3',
          //   'clone_' + this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].type,
          //   this.main.performers.performers[Object.keys(this.main.performers.performers)[0]],
          //   null,
          //   {
          //     wireframe: true,
          //     color: '91bad0',
          //     material: 'basic',
          //     visible: true,
          //     following: false,
          //     intensity: 1,
          //     style: 'default',
          //     offset: new THREE.Vector3(),
          //   },
          // );

          // this.inputManager.snorry(170,
          // this.main.performers.performers[
          //   Object.keys(this.parent.performers.performers)[0]
          // ]);

          break;
        case 'track right': // scene 2
          this.scene.switchEnvironment("water");

          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[0]
          ].hideWireframe();
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[1]
          ].setVisible(true);
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[1]
          ].showWireframe();

          // this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(['ghosting']);
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].removeEffects(["ribbons"]);

          this.inputManager.firstPerson(this.main.performers.performers[
            Object.keys(this.parent.performers.performers)[0]
          ]);

          
          break;

        case 'marker set': // start overlay
          this.main.toggleStartOverlay();
          
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[1]
          ].setVisible(false);
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[2]
          ].setVisible(false);
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[3]
          ].setVisible(false);

          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[1]
          ].setScale(0.0000222);
          
          this.scene.cameraControl.followZ(
            this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].performer['mixamorighips'],
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0, 0, 8),
          );
          break;
        case 'marker left': // black overlay
          this.main.toggleBlackOverlay();
          this.scene.cameraControl.followZoom(
            new THREE.Vector3(0,0,105),
            TWEEN.Easing.Quadratic.InOut,
            6400
          );
          break;
        case 'marker right': // end overlay
          this.main.toggleEndOverlay();
          this.scene.cameraControl.followZoom(
            new THREE.Vector3(0,0,5),
            TWEEN.Easing.Quadratic.InOut,
            5700
          );
          break;

        case 'stop':
          this.scene.unsetRotation();
          break;
        case 'play':
          this.scene.setRotation();
          break;

        case 'solo 1':
          this.scene.camera.up.set(0, 1, 0);
          this.scene.unsetRotation();
          this.inputManager.snorry(450,
            this.main.performers.performers[
              Object.keys(this.parent.performers.performers)[0]
            ]);
          break;

        case 'solo 2':
          this.scene.camera.up.set(0, 1, 0);
          this.scene.unsetRotation();
          this.inputManager.cut(0, 10);
          break;

        case 'solo 3':
          this.main.performers.performers[Object.keys(this.main.performers.performers)[0]].addEffects(["ribbons"]);
          this.scene.camera.up.set(0, 1, 0);
          this.scene.unsetRotation();
          this.inputManager.cut(0, 10);
          this.inputManager.followPerformer(0, 10);
          break;

        case 'solo 4':
          this.scene.unsetRotation();
          this.inputManager.flyTop();
          break;

        case 'solo 5':
          this.scene.camera.up.set(0, 1, 0);
          this.inputManager.cutThreeQ(0);
          this.scene.setRotation();
          break;

        case 'solo 6':
          this.scene.camera.up.set(0, 1, 0);
          this.scene.unsetRotation();
          this.inputManager.firstPerson(this.main.performers.performers[
            Object.keys(this.parent.performers.performers)[0]
          ]);
          break;

        case 'solo 7':
          this.inputManager.cut(0, 10);
          this.scene.cameraControl.follow(
            this.main.performers.performers[
              Object.keys(this.main.performers.performers)[0]
            ].performer.meshes.mixamorighips,
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0,0,7)
          );
          break;

        case 'solo 8':
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[2]
          ].setVisible(true);
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[2]
          ].showWireframe();
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[3]
          ].setVisible(true);
          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[3]
          ].showWireframe();

          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[3]
          ].animateTo(new THREE.Vector3(-1, 0, 0), 1000);

          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[2]
          ].animateTo(new THREE.Vector3(1, 0, 0), 1000);
          break;
          
        case 'record 1':
          this.scene.cameraControl.clearFollow();
          this.scene.setRotation();
          break;

        case 'record 2':
          this.scene.unsetRotation();
          this.inputManager.cut(0, 10);
          this.scene.cameraControl.follow(
            this.main.performers.performers[
              Object.keys(this.main.performers.performers)[0]
            ].performer.meshes.mixamorighips,
            new THREE.Vector3(0, 0.5, 0),
            new THREE.Vector3(0,0,7)
          );

          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[2]
          ].setDelay(0.75);

          this.main.performers.performers[
            Object.keys(this.main.performers.performers)[3]
          ].setDelay(0.75);
          break;

        case 'record 3':
          this.inputManager.flyOut(13000);
          break;
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

    // this.inputManager.registerCallback('keyboard', 'g', 'Snorry Cam', this.inputManager.snorryCam.bind(this.inputManager)); // look at face

    // this.inputManager.registerCallback('keyboard', 'f', 'First Person', this.inputManager.firstPerson.bind(this.inputManager)); // first person view

    // this.inputManager.registerCallback('keyboard', 't', 'Follow Performer', this.inputManager.followPerformer.bind(this.inputManager)); // follow x position of performer

    // this.inputManager.registerCallback('keyboard', 'y', 'Top View', this.inputManager.flyTop.bind(this.inputManager)); // follow x position of performer

    // this.inputManager.registerCallback('keyboard', 'u', '3/4 View', this.inputManager.cutThreeQ.bind(this.inputManager)); // follow x position of performer

    // this.inputManager.registerCallback('keyboard', 'i', 'Fly Out', this.inputManager.flyOut.bind(this.inputManager)); // follow x position of performer 

    // this.inputManager.registerCallback('keyboard', 'l', 'Following Camera - Low Angle', () => {
    //   if (!this.scene.cameraControl.followingObj) {
    //     this.scene.cameraControl.follow(
    //       this.main.performers.performers[
    //         Object.keys(this.main.performers.performers)[0]
    //       ].performer.meshes.mixamorighips,
    //       new THREE.Vector3(0, 0.5, 0),
    //       new THREE.Vector3(0, 0, 7),
    //     );
    //   } else {
    //     this.scene.cameraControl.clearFollow();
    //   }
    // });

    // this.inputManager.registerCallback('keyboard', 'c', 'Vogue Clone', () => {
    //   this.main.performers.performers[
    //     Object.keys(this.main.performers.performers)[0]
    //   ].performerEffects.effects[0].clonePerformer();
    // });

    // this.inputManager.registerCallback('keyboard', 'q', 'Randomize All Mesh Scale', () => {
    //   this.main.performers.performers[
    //     Object.keys(this.main.performers.performers)[0]
    //   ].randomizeAll(5000);
    // });

    // this.inputManager.registerCallback('keyboard', 'w', 'Random Limb Scale', () => {
    //   this.main.performers.performers[
    //     Object.keys(this.main.performers.performers)[0]
    //   ].randomizeLimbs(5000);
    // });

    // this.inputManager.registerCallback('keyboard', 'n', 'Detach Left Arm', () => { // toggle environment input
    //   this.main.performers.performers[
    //     Object.keys(this.main.performers.performers)[0]
    //   ].unParentPart('leftshoulder', false);
    // });

    // this.inputManager.registerCallback('keyboard', 'm', 'Detach Right Arm', () => { // toggle environment input
    //   this.main.performers.performers[
    //     Object.keys(this.main.performers.performers)[0]
    //   ].unParentPart('rightshoulder', false);
    // });

    // this.inputManager.registerCallback('keyboard', ',', 'Detach Left Leg', () => { // toggle environment input
    //   this.main.performers.performers[
    //     Object.keys(this.main.performers.performers)[0]
    //   ].unParentPart('leftupleg', false);
    // });

    // this.inputManager.registerCallback('keyboard', '.', 'Detach Right Leg', () => { // toggle environment input
    //   this.main.performers.performers[
    //     Object.keys(this.main.performers.performers)[0]
    //   ].unParentPart('rightupleg', false);
    // });

    // this.inputManager.registerCallback('keyboard', '/', 'Detach Head', () => { // toggle environment input
    //   this.main.performers.performers[
    //     Object.keys(this.main.performers.performers)[0]
    //   ].unParentPart('head', false);
    // });

    // this.inputManager.registerCallback('keyboard', 'space', 'Toggle Floor', () => { this.scene.environments.environments[0].toggleVisible(); });

    // // Camera positions
    // this.inputManager.registerCallback('keyboard', 'r', 'Rotate Camera', this.scene.toggleRotation.bind(this.scene)); // enable / disable camera rotation

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

    // this.inputManager.registerCallback('keyboard', 'e', 'Fly Wide', () => { // fly to wide shot
    //   this.scene.cameraControl.fly_to(
    //     Config.camera.wideShot.position,
    //     new THREE.Vector3(0, 0, 0),
    //     Config.camera.wideShot.look,
    //     TWEEN.Easing.Quadratic.InOut,
    //     'path',
    //     3000,
    //     1,
    //     () => { console.log('Camera moved!'); },
    //   );
    // });

    // this.inputManager.registerCallback('keyboard', 'g', 'Snorry Cam', this.inputManager.snorryCam.bind(this.inputManager)); // look at face

    // this.inputManager.registerCallback('keyboard', 'f', 'First Person', this.inputManager.firstPerson.bind(this.inputManager)); // first person view

    // this.inputManager.registerCallback('keyboard', 't', 'Follow Performer', this.inputManager.followPerformer.bind(this.inputManager)); // follow x position of performer

    // this.inputManager.registerCallback('keyboard', 'y', 'Top View', this.inputManager.flyTop.bind(this.inputManager)); // follow x position of performer

    // this.inputManager.registerCallback('keyboard', 'u', '3/4 View', this.inputManager.cutThreeQ.bind(this.inputManager)); // follow x position of performer

    // this.inputManager.registerCallback('keyboard', 'i', 'Fly Out', this.inputManager.flyOut.bind(this.inputManager)); // follow x position of performer

    // const spread = 0.5;
    // const scale = 0.001;
    // const delay = 0.25;
    // this.inputManager.registerCallback('keyboard', 'left', 'Fly Out', this.inputManager.cannonize.bind(this.inputManager, new THREE.Vector3(-1,0,0), spread, scale, delay));
    // this.inputManager.registerCallback('keyboard', 'up', 'Fly Out', this.inputManager.cannonize.bind(this.inputManager, new THREE.Vector3(0,0,-1), spread, scale, delay));
    // this.inputManager.registerCallback('keyboard', 'right', 'Fly Out', this.inputManager.cannonize.bind(this.inputManager, new THREE.Vector3(1,0,0), spread, scale, delay));
    // this.inputManager.registerCallback('keyboard', 'down', 'Fly Out', this.inputManager.cannonize.bind(this.inputManager, new THREE.Vector3(0,0,1), spread, scale, delay));
  }
}

module.exports = DualityPreset;
