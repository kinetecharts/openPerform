import React from 'react';
import _ from 'lodash';

import dat from 'dat-gui';

import { ChromePicker } from 'react-color';

import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';

import config from './../config';

class GridEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.elements = [];
    this.lights = [];

    this.name = "Grid";
    this.modalID = this.name+"_Settings";
    this.visible = true;

    this.bgColor = this.defaults.backgroundColor;
    this.floorColor = this.defaults.floorColor;
    this.floorSize = 50;
    this.numLines = 50;

    this.gridFloor;
    this.hemiLight;
    this.dirLight;

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

    this.setBgColor(new THREE.Color('#' + this.bgColor.toString(16)));
    // this.initGUI();
    this.initFloor(this.floorSize, this.numLines, this.floorColor);
    this.initShadowFloor(this.floorSize);
    this.initLights();
  }

  setBgColor(color) {
    this.renderer.setClearColor(color);
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

  initShadowFloor(size) {
    var geoFloor = new THREE.PlaneBufferGeometry( size, size, 1 );
    var matStdFloor = new THREE.ShadowMaterial();
    matStdFloor.opacity = 0.9;
    this.shadowFloor = new THREE.Mesh(geoFloor, matStdFloor);
    this.shadowFloor.rotation.x = -Math.PI/2;
    this.shadowFloor.receiveShadow = true;
    this.parent.add(this.shadowFloor);
    this.elements.push(this.shadowFloor);
  }

  setSpotlightPos(t, y, r) {
    var lx = r * Math.cos( t );
    var lz = r * Math.sin( t );
    // var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
    let spotOffset = new THREE.Vector3( lx, y, lz );
    this.spotLight.position.copy(spotOffset);
    this.spotLight.lookAt(new THREE.Vector3());
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

  remove() {
    this.elements.forEach((element) => {
      this.parent.remove(element);
    });
    this.lights.forEach((light) => {
      this.parent.remove(light);
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
      default:
        break;
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

  handleBackgroundColorChange(color, event) {
    this.bgColor = color.hex;
    this.setBgColor(new THREE.Color(this.bgColor));
  }

  getStylesGui() {
    return <StylesGUI
      handleBackgroundColorChange={this.handleBackgroundColorChange.bind(this)}
      backgroundColor={this.bgColor}
    />;
  }
}

module.exports = GridEnvironment;

class StylesGUI extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  render() {
    const cPicker = (
      <Popover id="popover-positioned-top" title="Background Color">
        <ChromePicker 
          color={this.props.backgroundColor}
          onChange={this.props.handleBackgroundColorChange}
        />
      </Popover>
    );
    return (
      <ListGroup>
          <ListGroupItem>
            <OverlayTrigger
              trigger="click"
              rootClose
              placement="top"
              overlay={cPicker}
            >
              <div id="colorSquare" style={{
                backgroundColor:'#'+this.props.backgroundColor.toString(16)
              }}></div>
            </OverlayTrigger>
          </ListGroupItem>
      </ListGroup>
    );
  }
}