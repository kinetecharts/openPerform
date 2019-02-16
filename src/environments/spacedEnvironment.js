/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:46:15
 * @modify date 2018-09-02 03:46:15
 * @desc [description]
*/

import FileLoader from '../util/Loader.js';
import SpaceMenu from '../react/menus/environment/SpaceMenu';

class SpacedEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = "Space";

    this.elements = [];
    this.lights = [];

    this.visible = true;

    this.options = {};

    this.loader = new FileLoader();

    this.initSpace();
    this.initLights();
  }

  toggleVisible(val) {
    this.setVisible(!this.getVisible());
  }

  getVisible() {
    return this.visible;
  }

  setVisible(val) {
    console.log(val);
    this.visible = val;
    this.elements.forEach((element) => {
      element.visible = val;
    });
  }

  initSpace() {
    this.loader.loadGLTF('../models/gltf/mars/scene.gltf', {}, (gltf) => {
      // const s = 0.1;
      // gltf.scene.scale.set(s, s, s);
      window.gltf = gltf.scene;
      gltf.scene.position.y = -50;
      
      this.elements.push(gltf.scene);
      this.parent.add(gltf.scene);
    });
  }

  initFloor(size) {
    this.floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( size, size, 1 ),
      new THREE.ShadowMaterial({ opacity: 0.9 })
    );
    this.floor.rotation.x = -Math.PI/2;
    this.floor.receiveShadow = true;

    this.elements.push(this.floor);
    this.parent.add(this.floor);
  }

  initLights() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);

    directionalLight.position.set( -5, 10, 10 );
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 512;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 500;     // default

    this.lights.push(directionalLight);
    this.parent.add(directionalLight);
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
    this.removeLights();
    this.removeElements();
  }

  update(timeDelta) {
    // put frame updates here.
  }
  
  // updated options from gui
  updateOptions(data) {
    this.options = data;
    this.remove();
  }

  // returns react gui object when effect is selected
  getGUI() {
    return <SpaceMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)}/>;
  }
}

module.exports = SpacedEnvironment;
