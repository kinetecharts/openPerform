/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:40:11
 * @modify date 2018-09-02 03:40:11
 * @desc [description]
*/

import GridMenu from '../react/menus/environment/GridMenu';

class GridEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = "Grid";

    this.elements = [];
    this.lights = [];

    this.visible = true;

    this.options = {
      bgColor: '#' + this.defaults.backgroundColor,
      floorColor: '#' + this.defaults.floorColor,
      floorSize: 50,
      numLines: 25,
    };

    this.gridFloor = null;
    this.hemiLight = null;
    this.dirLight = null;

    this.setBgColor(new THREE.Color(this.options.bgColor));
    this.initFloor(this.options.floorsize, this.options.numLines, new THREE.Color(this.options.floorColor));
    this.initShadowFloor(this.options.floorsize);
    this.initLights();
  }

  setBgColor(color) {
    this.renderer.setClearColor(color);
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

  initFloor(floorSize, numLines, color) {
    this.removeElements();

    this.gridFloor = new THREE.GridHelper(floorSize / 2, numLines, color, color);
    this.gridFloor.castShadow = true;
    this.gridFloor.receiveShadow = true;
    this.gridFloor.visible = true;
    this.elements.push(this.gridFloor);
    this.parent.add(this.gridFloor);
  }

  initShadowFloor(size) {
    this.shadowFloor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( size, size, 1 ),
      new THREE.ShadowMaterial({ opacity: 0.9 })
    );
    this.shadowFloor.rotation.x = -Math.PI/2;
    this.shadowFloor.receiveShadow = true;
    this.parent.add(this.shadowFloor);
    this.elements.push(this.shadowFloor);
  }

  initLights() {
    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.position.set(-5, 10, 10);
    this.dirLight.castShadow = true;
    this.parent.add(this.dirLight);
    this.lights.push(this.dirLight);

    this.dirLight.shadow.mapSize.width = 512;  // default
    this.dirLight.shadow.mapSize.height = 512; // default
    this.dirLight.shadow.camera.near = 0.5;    // default
    this.dirLight.shadow.camera.far = 500;     // default
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
    this.setBgColor(new THREE.Color(this.options.bgColor));
    this.initFloor(this.options.floorsize, this.options.numLines, new THREE.Color(this.options.floorColor));
  }

  getGUI() {
    return <GridMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)} />;
  }
}

module.exports = GridEnvironment;
