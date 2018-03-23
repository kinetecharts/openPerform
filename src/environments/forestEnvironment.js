import _ from 'lodash';
import dat from 'dat-gui';

require('three/examples/js/loaders/OBJLoader.js');
require('three/examples/js/loaders/DDSLoader.js');
require('three/examples/js/loaders/MTLLoader.js');

import config from './../config';

class ForestEnvironment {
  constructor(renderer, parent, performers, type) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;

    this.elements = [];

    this.name = "Forest";
    this.modalID = this.name+"_Settings";
    this.visible = true;

    this.spotLight = null;

    this.params = {
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

    // this.setColor(this.color);
    // this.initGUI();
    this.initFloor(200);
    this.initLights(200);

    this.loadMtl('models/mtl/forest.mtl', (materials) => {
      materials.preload();
      this.loadObj('models/obj/forest.obj', materials/*{
        color: 0xFF0000,
        opacity: 0.01,
        wireframe: false,
        transparent: false,
        side: THREE.BackSide,
        depthTest: false,
      }*/, (obj) => {
        this.parent.add(obj);
      });
    });
  }

  setColor(color) {
    this.renderer.setClearColor( color );
  }

  // initGUI() {
  //   this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
  //   this.guiDOM = this.gui.domElement;
  //   this.guiFolder = this.gui.addFolder("Grid Environment");
  //   this.guiFolder.open();
  //   this.guiFolder.add(this, 'floorSize', 1, 100).step(1).name('Size').listen()
  //     .onChange(this.redrawGrid.bind(this));
  //   this.guiFolder.add(this, 'numLines', 1, 100).step(1).name('# Lines').listen()
  //     .onChange(this.redrawGrid.bind(this));
  // }

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

  loadMtl(url, cb) {
    let onProgress = (xhr) => {
      if ( xhr.lengthComputable ) {
        var percentComplete = xhr.loaded / xhr.total * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    };
    let onError = (xhr) => {};
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    var mtlLoader = new THREE.MTLLoader();
    mtlLoader.load(url, cb);
  }

  loadObj(url, materials, cb) {
    let objLoader = new THREE.OBJLoader(new THREE.LoadingManager());
    objLoader.setMaterials(materials);
    objLoader.load(url, (object) => {
      cb(object);
    }, (xhr) => {
      if (xhr.lengthComputable) {
        const percentComplete = (xhr.loaded / xhr.total) * 100;
        console.log(Math.round(percentComplete, 2) + '% downloaded');
      }
    }, (xhr) => {
      console.log('OBJLoader Error: ', xhr);
    });
  }

  initFloor(size) {
    var geoFloor = new THREE.PlaneBufferGeometry( size, size, 1 );
    var matStdFloor = new THREE.ShadowMaterial();
    matStdFloor.opacity = 0.9;
    this.gridFloor = new THREE.Mesh(geoFloor, matStdFloor);
    this.gridFloor.rotation.x = -Math.PI/2;
    this.gridFloor.receiveShadow = true;
    this.parent.add(this.gridFloor);
    this.elements.push(this.gridFloor);
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

    this.spotLight.color.setHex(this.params.lColor);
    this.spotLight.intensity = this.params.lIntense;
    this.spotLight.distance = this.params.lDist;
    this.spotLight.angle = this.params.lAngle;
    this.spotLight.penumbra = this.params.lPen;
    this.spotLight.decay = this.params.lDecay;
    this.spotLight.shadow.bias = this.params.shadowBias;

    this.parent.add(this.spotLight);
    this.elements.push(this.spotLight);

    // this.spotLightHelper = new THREE.SpotLightHelper(this.spotLight);
    // this.parent.add(this.spotLightHelper);

    this.setSpotlightPos(this.params.lRot, this.params.lHeight, this.params.lRadius);

    var light = new THREE.AmbientLight(0x404040); // soft white light
    this.parent.add(light);
    this.elements.push(light);
  }

  remove() {
    this.elements.forEach((element) => {
      this.parent.remove(element);
    });
  }

  redrawGrid() {
    this.parent.remove(this.gridFloor);
    this.initFloor(this.floorSize, this.numLines);
  }

  toggleGrid() {
    this.gridFloor.visible = !this.gridFloor.visible;
  }

  hide() {
    this.gridFloor.visible = true;
  }

  show() {
    this.gridFloor.visible = false;
  }

  toggle(variableName) {
    if (this.toggles[variableName]) {
      this.toggles[variableName] = !this.toggles[variableName];
    }
  }

  updateParameters(data) {
    	switch (data.parameter) {
    		case 'size':
    			this.floorSize = data.value * 100;
    			this.redrawGrid();
    			break;
    		case 'lines':
        this.numLines = data.value * 100;
        this.redrawGrid();
    			break;
    	}
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = ForestEnvironment;
