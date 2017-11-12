import _ from 'lodash';

import config from './../config';

class MuseEnvironment {
  constructor(renderer, parent, performers, guiFolder, type) {
    this.renderer = renderer;// threejs renderer
    this.parent = parent; // threejs scene
    this.guiFolder = guiFolder; // dat.gui folder

    this.floorSize = 50;
    this.numLines = 50;

    const f = this.guiFolder.addFolder('Muse');
    f.add(this, 'floorSize', 1, 100).step(1).name('Size').listen()
      .onChange(this.redrawGrid.bind(this));
    f.add(this, 'numLines', 1, 100).step(1).name('# Lines').listen()
      .onChange(this.redrawGrid.bind(this));

    this.gridFloor;
    this.hemiLight;
    this.dirLight;

    // this.renderer.setClearColor( 0x000000 );

    this.initFloor(this.floorSize, this.numLines, 0xFFFFFF);
    this.initLights();
  }

  initFloor(floorSize, numLines, color) {
    this.gridFloor = new THREE.GridHelper(floorSize / 2, numLines, color, color);
    this.gridFloor.castShadow = true;
    this.gridFloor.receiveShadow = true;
    this.gridFloor.visible = true;
    this.parent.add(this.gridFloor);
  }

  initLights(scene, camera) {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.hemiLight.color.setHSL(0.6250011825856442, 60.75949367088608, 30.980392156862745);
    this.hemiLight.groundColor.setHSL(4.190951334017909e-8, 33.68421052631579, 37.254901960784316);
    this.hemiLight.position.set(0, 500, 0);
    this.parent.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.position.set(-1, 0.75, 1);
    this.dirLight.position.multiplyScalar(50);
    this.dirLight.name = 'dirlight';

    this.parent.add(this.dirLight);

    this.dirLight.castShadow = true;

    this.dirLight.shadow.mapSize.width = this.dirLight.shadow.mapSize.height = 1024 * 2;

    const d = 300;

    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;

    this.dirLight.shadow.camera.far = 3500;
    this.dirLight.shadow.bias = -0.0001;
    this.dirLight.shadow.darkness = 0.35;

    this.dirLight.shadow.camera.visible = true;
  }

  remove() {
    this.parent.remove(this.gridFloor);
    this.parent.remove(this.hemiLight);
    this.parent.remove(this.dirLight);

    this.guiFolder.removeFolder('Muse');
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
    // hooked to main threejs render loop
  }
}

module.exports = MuseEnvironment;
