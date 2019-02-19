/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:40:11
 * @modify date 2018-09-02 03:40:11
 * @desc [description]
*/

import GridMenu from '../react/menus/environment/GridMenu';
import Common from './../util/Common';

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
      gridColor: '#' + this.defaults.gridColor,
      floorColor: '#' + this.defaults.floorColor,
      floorSize: 100,
      numLines: 25,
    };

    this.floor = null;
    this.hemiLight = null;
    this.dirLight = null;

    this.updateBackgroundColor(new THREE.Color(this.options.bgColor));
    this.initFloor(this.options.floorSize, this.options.numLines, new THREE.Color(this.options.floorColor), new THREE.Color(this.options.gridColor));
    this.initDirectionalLight();
  }

  updateBackgroundColor(color) {
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

  initFloor(floorSize, numLines, floorColor, gridColor) {
    this.removeElements();

    this.floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(floorSize, floorSize, 1),
      new THREE.MeshPhongMaterial({ color: floorColor }),
    );
    this.floor.rotation.x = -Math.PI/2;

    this.floor.castShadow = true;
    this.floor.receiveShadow = true;
    this.floor.visible = true;

    this.elements.push(this.floor);
    this.parent.add(this.floor);

    this.gridFloor = new THREE.GridHelper(floorSize, numLines, gridColor, gridColor);
    this.elements.push(this.gridFloor);
    this.parent.add(this.gridFloor);
  }

  initDirectionalLight() {
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);

    this.directionalLight.position.set( -5, 10, 10 );
    this.directionalLight.castShadow = true;

    this.directionalLight.shadow.mapSize.width = 512;  // default
    this.directionalLight.shadow.mapSize.height = 512; // default
    this.directionalLight.shadow.camera.near = 0.5;    // default
    this.directionalLight.shadow.camera.far = 500;     // default

    // var helper = new THREE.DirectionalLightHelper( this.directionalLight, 5 );
    // this.parent.add( helper );

    this.lights.push(this.directionalLight);
    this.parent.add(this.directionalLight);
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

  updateLightPosition(x, z) {
    this.dirLight.position.set(
      Common.mapRange(x, 1, 0, -10, 10),
      this.dirLight.position.y,
      -Common.mapRange(z, 1, 0, -10, 10),
    );
  }

  update(timeDelta) {
    // put frame updates here.
  }

  // updated options from gui
  updateOptions(data) {
    this.options = data;
    this.updateBackgroundColor(new THREE.Color(this.options.bgColor));
    this.initFloor(this.options.floorSize, this.options.numLines, new THREE.Color(this.options.floorColor), new THREE.Color(this.options.gridColor));
  }

  getGUI() {
    return <GridMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)} />;
  }
}

module.exports = GridEnvironment;
