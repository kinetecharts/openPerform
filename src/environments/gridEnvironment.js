/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:40:11
 * @modify date 2018-09-02 03:40:11
 * @desc [description]
*/

import GridMenu from '../react/menus/environment/GridMenu';
require('imports-loader?THREE=three!three/examples/js/objects/Reflector.js');

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
      floorSize: 100,
      numLines: 25,
    };

    this.gridFloor = null;
    this.hemiLight = null;
    this.dirLight = null;

    this.setBgColor(new THREE.Color(this.options.bgColor));
    this.initFloor(this.options.floorsize, this.options.numLines, new THREE.Color(this.options.floorColor));
    this.initShadowFloor(this.options.floorsize);
    this.initLights();
    this.initMirror();
  }

  initMirror() {
    const w = 1920/250;
    const h = 1080/250;
    var geo = new THREE.PlaneBufferGeometry( w * 2, h * 2 );
    let overflow = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0xFFFFFF}));
    overflow.position.z = -0.1;
    this.parent.add(overflow);
    this.elements.push(overflow);

    var geometry = new THREE.PlaneBufferGeometry( w, h );
    var verticalMirror = new THREE.Reflector( geometry, {
      // clipBias: 0.003,
      textureWidth: $('#scenes').width() * window.devicePixelRatio,
      textureHeight: $('#scenes').height() * window.devicePixelRatio,
      color: 0x889999,
      recursion: 1
    } );
    // window.verticalMirror = verticalMirror;
    verticalMirror.position.y = 1.25;
    verticalMirror.position.z = 5;
    this.parent.add(verticalMirror);
    this.elements.push(verticalMirror);
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
    // window.gridFloor = this.gridFloor;
    this.gridFloor.castShadow = true;
    this.gridFloor.receiveShadow = true;
    this.gridFloor.visible = true;
    this.gridFloor.position.z = 16;
    this.gridFloor.position.y = -0.8999999999999999;
    this.elements.push(this.gridFloor);
    this.parent.add(this.gridFloor);
  }

  initShadowFloor(size) {
    this.shadowFloor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( size, size, 1 ),
      new THREE.ShadowMaterial({ opacity: 0.9 })
    );
    this.shadowFloor.rotation.x = -Math.PI/2;
    this.shadowFloor.position.z = 16;
    this.shadowFloor.position.y = -0.8999999999999999;
    this.shadowFloor.receiveShadow = true;
    this.parent.add(this.shadowFloor);
    this.elements.push(this.shadowFloor);
  }

  initLights() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);

    // window.directionalLight = directionalLight;
    directionalLight.position.set(0, 2, 0);
    let lightTarget = new THREE.Object3D();
    this.parent.add(lightTarget);
    lightTarget.position.set(0, 0, 20);
    directionalLight.target = lightTarget
    directionalLight.castShadow = true;

    // let targetObj = new THREE.Object3D();
    // targetObj.position.set(0, 1.75, 0);
    // directionalLight.target = targetObj;
    // this.parent.add(directionalLight.target);

    directionalLight.shadow.mapSize.width = 512;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 500;     // default

    // var helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // this.parent.add(helper);

    this.lights.push(directionalLight);
    this.parent.add(directionalLight);

    let hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x797979, 0.75);

    this.lights.push(hemiLight);
    this.parent.add(hemiLight);
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
