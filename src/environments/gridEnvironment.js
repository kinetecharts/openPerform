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
      floorColor: '#' + this.defaults.floorColor,
      floorSize: 100,
      numLines: 25,
    };

    this.gridFloor = null;
    this.hemiLight = null;
    this.dirLight = null;

    this.updateBackgroundColor(new THREE.Color(this.options.bgColor));
    this.initFloor(this.options.floorSize, this.options.numLines, new THREE.Color(this.options.floorColor));
    // this.initShadowFloor(this.options.floorSize);
    // this.initSpotlights();
    // this.initAmbientLight();
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

  initFloor(floorSize, numLines, col) {
    this.removeElements();

    this.gridFloor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(floorSize, floorSize, 1),
      new THREE.MeshPhongMaterial({ color: col }),
    );
    this.gridFloor.rotation.x = -Math.PI/2;

    // this.gridFloor = new THREE.GridHelper(floorSize, numLines, color, color);

    this.gridFloor.castShadow = true;
    this.gridFloor.receiveShadow = true;
    this.gridFloor.visible = true;
    this.elements.push(this.gridFloor);
    this.parent.add(this.gridFloor);
  }

  initShadowFloor(floorSize) {
    this.shadowFloor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(floorSize, floorSize, 1),
      new THREE.ShadowMaterial(),
    );
    this.shadowFloor.rotation.x = -Math.PI/2;
    this.shadowFloor.receiveShadow = true;
    this.shadowFloor.visible = true;
    this.parent.add(this.shadowFloor);
    // this.elements.push(this.shadowFloor);
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

  initAmbientLight() {
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
    // this.ambientLight.shadow.mapSize.width = 2048;  // 512 default
    // this.ambientLight.shadow.mapSize.height = 2048; // 512 default
    // this.ambientLight.shadow.camera.near = 0.1;    // 0.5 default
    // this.ambientLight.shadow.camera.far = 10000;     // 500 default

    // var helper = new THREE.AmbientLightHelper( this.ambientLight, 5 );
    // this.parent.add( helper );

    this.lights.push(this.ambientLight);
    this.parent.add(this.ambientLight);
  }

  initSpotlights() {
    // this.dirLight = new THREE.SpotLight(
    //   0xffffff, // color
    //   0.5, // intensity
    //   20, // distance
    //   0.1, // angle
    //   1, // penumbra
    //   2, // decay
    // );
    // this.dirLight.position.set(-5, 10, 10);
    // this.dirLight.castShadow = true;
    // this.dirLight.shadow.camera = new THREE.PerspectiveCamera(20, $('#scenes').width() / $('#scenes').height(), 0.01, 10000);
    // this.parent.add(this.dirLight);
    // this.lights.push(this.dirLight);

    // this.lightTarget = new THREE.Object3D();
    // this.parent.add(this.lightTarget);
    // this.dirLight.target = this.lightTarget;

    // this.dirLight.shadow.mapSize.width = 2048;  // 512 default
    // this.dirLight.shadow.mapSize.height = 2048; // 512 default
    // this.dirLight.shadow.camera.near = 0.1;    // 0.5 default
    // this.dirLight.shadow.camera.far = 10000;     // 500 default

    // var helper = new THREE.SpotLightHelper( this.dirLight, 5 );
    // this.parent.add( helper );

    let spotLight1 = this.createSpotlight( 0xFF7F00 );
    let spotLight2 = this.createSpotlight( 0x00FF7F );
    let spotLight3 = this.createSpotlight( 0x7F00FF );

    spotLight1.position.set( 15, 40, 45 );
    spotLight2.position.set( 0, 40, 35 );
    spotLight3.position.set( - 15, 40, 45 );

    // let lightHelper1 = new THREE.SpotLightHelper( spotLight1 );
    // let lightHelper2 = new THREE.SpotLightHelper( spotLight2 );
    // let lightHelper3 = new THREE.SpotLightHelper( spotLight3 );

    this.parent.add( spotLight1, spotLight2, spotLight3 );
	  // this.parent.add( lightHelper1, lightHelper2, lightHelper3 );
  }

  createSpotlight( color ) {
    var newObj = new THREE.SpotLight( color, 2 );
    newObj.castShadow = true;
    newObj.angle = 0.3;
    newObj.penumbra = 0.2;
    newObj.decay = 2;
    newObj.distance = 50;
    newObj.shadow.mapSize.width = 1024;
    newObj.shadow.mapSize.height = 1024;
    return newObj;
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
    this.initFloor(this.options.floorSize, this.options.numLines, new THREE.Color(this.options.floorColor));
  }

  getGUI() {
    return <GridMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)} />;
  }
}

module.exports = GridEnvironment;
