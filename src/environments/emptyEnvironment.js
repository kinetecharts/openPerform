/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:41:26
 * @modify date 2018-09-02 03:41:26
 * @desc [description]
*/

import EmptyMenu from '../react/menus/environment/EmptyMenu';

class EmptyEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = "Empty";

    this.elements = [];
    this.lights = [];

    this.visible = true;

    this.options = {};

    this.spotLight = null;

    this.initFloor(200);
    this.initLights();
  }

  toggleVisible() {
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

  initFloor(size) {
    this.floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(size, size, 1),
      new THREE.ShadowMaterial({
        opacity: 0.9,
      }),
    );
    this.floor.rotation.x = -Math.PI / 2;
    this.floor.receiveShadow = true;
    this.parent.add(this.floor);
    this.elements.push(this.floor);
  }

  initLights() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set(-5, 10, 10);
    directionalLight.castShadow = true;
    this.parent.add(directionalLight);

    directionalLight.shadow.mapSize.width = 512;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 500;     // default
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
    return <EmptyMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)}/>;
  }
}

module.exports = EmptyEnvironment;
