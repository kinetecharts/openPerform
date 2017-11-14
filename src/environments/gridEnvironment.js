import _ from 'lodash';
import dat from 'dat-gui';

import config from './../config';

class GridEnvironment {
  constructor(renderer, parent, performers, type) {
    this.renderer = renderer;
    this.parent = parent;

    this.elements = [];

    this.name = "Grid";
    this.modalID = this.name+"_Settings";
    this.visible = true;

    this.color = 0x333333;
    this.floorSize = 50;
    this.numLines = 50;

    this.gridFloor;
    this.hemiLight;
    this.dirLight;

    this.colors = {
      light: {
        floor: 0x000000,
        background: 0xFFFFFF,
      },
      dark: {
        floor: 0xFFFFFF,
        background: 0x000000,
      },
    };

    this.setColor(this.color);
    this.initGUI();
    this.initFloor(this.floorSize, this.numLines, this.colors[type].floor);
    this.initLights();
  }

  setColor(color) {
    this.renderer.setClearColor( color );
  }

  initGUI() {
    this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
    this.guiDOM = this.gui.domElement;
    this.guiFolder = this.gui.addFolder("Grid Environment");
    this.guiFolder.open();
    this.guiFolder.add(this, 'floorSize', 1, 100).step(1).name('Size').listen()
      .onChange(this.redrawGrid.bind(this));
    this.guiFolder.add(this, 'numLines', 1, 100).step(1).name('# Lines').listen()
      .onChange(this.redrawGrid.bind(this));
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

  initFloor(floorSize, numLines, color) {
    this.gridFloor = new THREE.GridHelper(floorSize / 2, numLines, color, color);
    this.gridFloor.castShadow = true;
    this.gridFloor.receiveShadow = true;
    this.gridFloor.visible = true;
    this.elements.push(this.gridFloor);
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

    this.guiFolder.removeFolder('Grid');
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

module.exports = GridEnvironment;
