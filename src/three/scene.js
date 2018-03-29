require('imports-loader?THREE=three!three/examples/js/controls/TrackballControls.js');
const Stats = require('imports-loader?THREE=three!three/examples/js/libs/stats.min.js');
const dat = require('imports-loader?THREE=three!three/examples/js/libs/dat.gui.min.js');
require('imports-loader?THREE=three!./../libs/three.ar.min.js');

import Common from './../util/Common';

import DepthDisplay from './displayComponents/DepthDisplay';
import CameraControl from './../camera/cameraControl';
import Environments from './../environments';

import VR from './vr/vr.js';
import ARPlanes from './ar/ARPlanes';

class Scene {
  constructor() {
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.controls = null;

    this.sceneGroup = new THREE.Object3D();

    this.container;
    this.w;
    this.h;

    this.stats = null;

    this.vr = null;
    this.arDisplay = null;

    this.environments = null;

    this.statsEnabled = false;
    this.performer = null;
  }
  initScene(inputs, statsEnabled, performers, backgroundColor, callback) {
    this.statsEnabled = statsEnabled;
    this.performer = performers;
    this.container = $('#scenes');

    this.w = this.container.width();
    this.h = this.container.height();

    THREE.ARUtils.getARDisplay().then((display) => {
      if (display) {
        this.arDisplay = display;
        this.initArScene(inputs, backgroundColor, callback);
      } else {
        // THREE.ARUtils.displayUnsupportedMessage();
        this.initVRScene(inputs, backgroundColor, callback);
      }
    });
  }

  initArScene(inputs, backgroundColor, callback) {
    this.renderer = new THREE.WebGLRenderer({ antialias:true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearAlpha(0);
    this.renderer.autoClear = false;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // / Global : this.scene
    this.scene = new THREE.Scene();
    window.scene = this.scene;

    this.arView = new THREE.ARView(this.arDisplay, this.renderer);

    this.camera = new THREE.ARPerspectiveCamera(
      this.arDisplay,
      20,
      this.w / this.h,
      0.01,
      10000
    );

    this.arControls = new THREE.VRControls(this.camera);

    if (this.showArDebug) {
      this.arDebug = new THREE.ARDebug(this.arDisplay, this.scene, {
        showLastHit: false,
        showPoseStatus: false,
        showPlanes: true,
      });
      document.body.appendChild(this.arDebug.getElement());
    }

    this.params = {
      numPlanes: 0,
      showPlanes: true,
      showShadows: true,
    };
    window.params = this.params;

    this.planes = new ARPlanes(this.arDisplay, (size) => {
      this.params.numPlanes = size;
    });
    window.planes = this.planes;
    this.scene.add(this.planes);

    this.addCreateCommon();
    this.initARGui();
    // initiating renderer
    this.renderAR();

    this.addEventListeners();

    callback(this.scene);
  }

  initVRScene(inputs, backgroundColor, callback) {
    // / Global : this.renderer
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(this.w, this.h);
    this.renderer.setClearColor(backgroundColor);
    this.renderer.autoClear = true;
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMapSoft = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    this.renderer.domElement.id = "threeCanvas";

    // / Global : this.scene
    this.scene = new THREE.Scene();
    window.scene = this.scene;

    // / Global : this.camera
    this.camera = new THREE.PerspectiveCamera(20, this.w / this.h, 0.01, 10000);
    window.camera = this.camera;
    this.camera.position.set(0, 1.5000000041026476, 19.999990045581438);
    this.scene.add(this.camera);

    this.addCreateCommon(); 

    this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );
    this.controls.target = new THREE.Vector3(0,1.5,0);
    window.controls = this.controls;

    this.controls.rotateSpeed = 1.0;
    this.controls.zoomSpeed = 1.2;
    this.controls.panSpeed = 0.8;
    this.controls.noZoom = false;
    this.controls.noPan = false;
    this.controls.staticMoving = true;
    this.controls.dynamicDampingFactor = 0.3;

    this.cameraControl = new CameraControl(this.scene, this.camera, this.controls);

    this.vr = new VR(this.renderer, this.camera, this.scene, this.controls);

    // initiating renderer
    this.render();

    this.addEventListeners();

    callback(this.scene);
  }

  initARGui() {
    // GUI
    this.gui = new dat.GUI({ autoPlace: false });

    var customContainer = document.getElementById('arMenuBody');
    customContainer.appendChild(this.gui.domElement);

    this.gui.open();
    
    let ARFolder = this.gui.addFolder('AR');

    ARFolder.add(this.params, 'numPlanes').name('Planes Detected').listen();
    ARFolder.add(this.params, 'showPlanes').name('Show Planes').listen().onChange((val) => {
      if (val == true) {
        this.planes.showPlanes();
      } else {
        this.planes.hidePlanes();
      }
    });
    // // ARFolder.add(this.params, 'showShadows').name('Show Shadows').onChange((val) => {
    // //   if (val == true) {
    // //     this.planes.showShadows();
    // //   } else {
    // //     this.planes.hideShadows();
    // //   }
    // // });

    // let PerformerFolder = this.gui.addFolder('Performer');

    // PerformerFolder.add(this.params, 'pScale', 1, 10).name('Size').step(0.1).listen().onChange((val) => {
    //   this.sceneGroup.scale.set(val, val, val);
    // });

    // PerformerFolder.addColor(this.params, 'pColor').name('Color').listen().onChange((val) => {
    //   this.opLite.updateMaterials(this.opLite.performerBody, new THREE.Color(val));
    // });

    // let LightFolder = this.gui.addFolder('Light');
    // LightFolder.add(this.params, 'lFollow').name('Follow').listen();

    // LightFolder.add(this.params, 'lRotate').name('Rotate').listen();

    // LightFolder.add(this.params, 'lRot', 0, Math.PI*2).step(0.01).name('Angle').listen().onChange((val) => {
    //   this.setSpotlightPos(val, this.params.lHeight, this.params.lRadius);
    // });

    // LightFolder.add(this.params, 'lRadius', 0, 10).step(0.1).name('Radius').listen().onChange((val) => {
    //   this.setSpotlightPos(this.params.lRot, this.params.lHeight, val);
    // });

    // LightFolder.add(this.params, 'lHeight', 0, 2).step(0.01).name('Height').listen().onChange((val) => {
    //   this.setSpotlightPos(this.params.lRot, val, this.params.lRadius);
    // });

    // LightFolder.addColor(this.params, 'lColor').name('light color').listen().onChange((val) => {
    //   this.spotLight.color.setHex(val);
    // });
    // LightFolder.add(this.params, 'lIntense', 0, 2).name('intensity').step(0.1).listen().onChange((val) => {
    //   this.spotLight.intensity = val;
    // });
    // LightFolder.add(this.params, 'lDist', 50, 200).name('distance').step(1).listen().onChange((val) => {
    //   this.spotLight.distance = val;
    // });
    // LightFolder.add(this.params, 'lAngle', 0, Math.PI / 3).name('angle').step(0.1).listen().onChange((val) => {
    //   this.spotLight.angle = val;
    // });
    // LightFolder.add(this.params, 'lPen', 0, 1).name('penumbra').step(0.1).listen().onChange((val) => {
    //   this.spotLight.penumbra = val;
    // });
    // LightFolder.add(this.params, 'lDecay', 1, 10).name('decay').step(0.1).listen().onChange((val) => {
    //   this.spotLight.decay = val;
    // });

    // LightFolder.add(this.params, 'shadowDarkness', 0.01, 1).name('Shadow Darkness').step(0.01).listen().onChange((val) => {
    //   this.spotLight.shadowDarkness = val;
    // });

    // LightFolder.add(this.params, 'shadowBias', 0.001, 1).name('Shadow Bias').step(0.001).listen().onChange((val) => {
    //   this.spotLight.shadowBias = val;
    // });
  }

  addEventListeners() {
    window.addEventListener('resize', this.onWindowResize.bind(this), false);
    document.getElementById("threeCanvas").addEventListener('touchstart', this.onTouch.bind(this), false);
    // this.gui.domElement.addEventListener( 'mousedown', () => { this.controls.enabled = false; }, false );
    // document.addEventListener( 'mouseup', () => { this.controls.enabled = true; }, false );
  }

  addCreateCommon() {
    this.clock = new THREE.Clock();

    this.stats = new Stats();
    if (this.statsEnabled) {
      this.stats.dom.id = 'stats';
      $('#statsBox').append(this.stats.dom);
    }

    // attach renderer to DOM
    // must appear before controls or mouse events won't work
    this.container.append(this.renderer.domElement);
    
    this.scene.add(this.sceneGroup);
    
    this.environments = new Environments(this.renderer, this.sceneGroup, this.performers);
    window.environments = this.environments;

    // this.sceneGroup.scale.set(0.2, 0.2, 0.2)
    // const axesHelper = new THREE.AxesHelper(5);
    // this.sceneGroup.add(axesHelper);
  }

  toggleRotation() {
    this.controls.autoRotate = !this.controls.autoRotate;
  }

  setRotation() {
    this.controls.autoRotate = true;
  }

  unsetRotation() {
    this.controls.autoRotate = false;
  }

  setRotationSpeed(val) {
    this.controls.autoRotateSpeed = val;
  }

  switchEnvironment(env) {
    if (this.environments) {
      console.log(`Switching Environment to: ${env}`);
      this.environments.add(env);
    }
  }

  viewKinectTransportDepth(depthObj) {
    const imgWidth = 512; const imgHeight = 424; // width and hight of kinect depth camera

    if (!this.kinectPC) { // create point cloud depth display if one doesn't exist
      const dimensions = {
        width: imgWidth, height: imgHeight, near: 58, far: 120,
      };
      this.kinectPC = new DepthDisplay(this.sceneGroup, dimensions, 30, false);
    }

    // this.kinectPC.moveSlice();
    this.kinectPC.updateDepth('kinecttransport', depthObj.depth.buffer.data);
    this.kinectPC.updateColor('kinecttransport', depthObj.depth.buffer.data);
  }

  viewKinectTransportBodies(bodiesObj) {
    // console.log(bodiesObj.bodies.trackingIds.length);
    const bodies = bodiesObj.bodies.bodies;
    if (!this.bodies) {
      this.bodies = {};
    }

    _.each(bodies, (body, idx) => {
      // body.id;
      if (!this.bodies[idx]) {
        this.bodies[idx] = new Performer(this.sceneGroup, idx);
      }

      this.bodies[idx].updateJoints(body.joints);
    });
  }

  render() {
    this.updateCommon();

    this.controls.update();
    this.cameraControl.update();

    if (this.vr) { this.vr.update(); }
    if (this.scene) { this.renderer.render(this.scene, this.camera); }

    window.requestAnimationFrame(this.render.bind(this));
  }

  renderAR() {
    this.updateCommon();

    this.renderer.clearColor();

    this.arView.render();

    this.camera.updateProjectionMatrix();

    this.arControls.update();

    this.renderer.clearDepth();
    this.renderer.render(this.scene, this.camera);

    this.arDisplay.requestAnimationFrame(this.renderAR.bind(this));
  }

  updateCommon() {
    if (TWEEN) { TWEEN.update(); }
    if (this.statsEnabled) { this.stats.update(); }
    if (this.performer) { this.performer.update(this.clock.getDelta()); }
    if (this.environments) { this.environments.update(this.clock.getDelta()); }
  }

  onWindowResize() {
    this.controls.update();

    this.w = this.container.width();
    this.h = this.container.height();

    this.camera.aspect = this.w / this.h;
    this.camera.updateProjectionMatrix();

    this.renderer.setSize(this.w, this.h);
  }

  onTouch (e) {
    if (!e.touches[0]) {
      return;
    }
    var x = e.touches[0].pageX / window.innerWidth;
    var y = e.touches[0].pageY / window.innerHeight;
    console.log(x, y);

    var hits = this.arDisplay.hitTest(x, y);
    if (hits && hits.length) {
      const hit = hits[0];
      THREE.ARUtils.placeObjectAtHit(
        this.sceneGroup,
        hit,
        1,
        true,
     );
    }
  }
}

export default Scene;
