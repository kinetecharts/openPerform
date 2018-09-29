/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:33:32
 * @modify date 2018-09-02 03:34:25
 * @desc [description]
*/

import FileLoader from '../util/Loader.js';
import ForestMenu from '../react/menus/environment/ForestMenu';

class ForestEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = "Forest";

    this.elements = [];
    this.lights = [];

    this.visible = true;

    this.options = {};

    this.loader = new FileLoader();

    this.spotLight = null;

    this.spotlightParams = {
      shadowBias: 0.001,
      lRotate: false,
      lFollow: true,
      lHeight: 4,
      lRot: 1.55,
      lRadius: 5,
      lColor: 0xFFFFFF,
      lIntense: 1,
      lDist: 200,
      lAngle: 1,//Math.PI / 4,
      lPen: 1,
      lDecay: 10,
    };

    this.initForest();
    this.initLights(200);
  }

  initForest() {
    this.loader.loadMTL('models/mtl/forest.mtl', {}, (materials) => {
      materials.preload();
      this.loader.loadOBJ('models/obj/forest.obj', { materials: materials }, (obj) => {
        this.parent.add(obj);
        this.elements.push(obj);
      });
    });
  }

  toggleVisible(val) {
    this.setVisible(!this.getVisible());
  }

  getVisible() {
    return this.visible;
  }

  setVisible(val) {
    this.visible = val;
    this.elements.forEach((element) => {
      element.visible = val;
    });
  }

  setSpotlightPos(t, y, r) {
    const lx = r * Math.cos(t);
    const lz = r * Math.sin(t);
    // var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
    const spotOffset = new THREE.Vector3(lx, y, lz);
    this.spotLight.position.copy(spotOffset);
    this.spotLight.lookAt(new THREE.Vector3());
  }

  updateMaterial(options) {
    return new THREE.MeshPhongMaterial({
      color: options.color || 0xFFFFFF,
      wireframe: options.wireframe || false,
      opacity: options.opacity || 0.75,
      transparent: options.transparent || false,
      side: THREE.DoubleSide,
      depthTest: options.depthTest || false,
    });
  }

  initLights(floorSize) {
    this.spotLight = new THREE.SpotLight(0xffffff);
    this.spotLight.castShadow = true;

    //Set up shadow properties for the light
    this.spotLight.shadow.mapSize.width = 2048;  // default
    this.spotLight.shadow.mapSize.height = 2048; // default
    this.spotLight.shadow.camera.near = 0.5;       // default
    this.spotLight.shadow.camera.far = 500      // default
    this.spotLight.shadow.camera.left = -floorSize;
    this.spotLight.shadow.camera.right = floorSize;
    this.spotLight.shadow.camera.top = floorSize;
    this.spotLight.shadow.camera.bottom = -floorSize;

    this.spotLight.color.setHex(this.spotlightParams.lColor);
    this.spotLight.intensity = this.spotlightParams.lIntense;
    this.spotLight.distance = this.spotlightParams.lDist;
    this.spotLight.angle = this.spotlightParams.lAngle;
    this.spotLight.penumbra = this.spotlightParams.lPen;
    this.spotLight.decay = this.spotlightParams.lDecay;
    this.spotLight.shadow.bias = this.spotlightParams.shadowBias;

    this.parent.add(this.spotLight);
    this.lights.push(this.spotLight);

    this.setSpotlightPos(this.spotlightParams.lRot, this.spotlightParams.lHeight, this.spotlightParams.lRadius);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    this.parent.add(light);
    this.lights.push(light);
  }

  removeElements() {
    this.elements.forEach((element) => {
      this.parent.remove(element);
    });
  }

  removeLights() {
    this.lights.forEach((light) => {
      this.parent.remove(light);
    });
  }

  remove() {
    this.removeElements();
    this.removeLights();
  }

  update(timeDelta) {
    // put frame updates here.
  }

  // updated options from gui
  updateOptions(data) {
    this.options = data;
  }

  // returns react gui object when effect is selected
  getGUI() {
    return <ForestMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)}/>;
  }
}

module.exports = ForestEnvironment;
