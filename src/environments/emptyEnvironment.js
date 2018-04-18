import React from 'react';
import _ from 'lodash';

import dat from 'dat-gui';

import { ChromePicker } from 'react-color';

import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';

import config from './../config';

class EmptyEnvironment {
  constructor(renderer, parent, performers, type) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;

    this.elements = [];

    this.name = "Empty";
    this.modalID = this.name+"_Settings";
    this.visible = true;

    this.spotLight = null;

    this.color = config.defaults.backgroundColor;

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
    this.initLights();
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
    var lx = r * Math.cos( t );
    var lz = r * Math.sin( t );
    // var ly = 5.0 + 5.0 * Math.sin( t / 3.0 );
    let spotOffset = new THREE.Vector3( lx, y, lz );
    this.spotLight.position.copy(spotOffset);
    this.spotLight.lookAt(new THREE.Vector3());
  }

  initFloor(size) {
    var geoFloor = new THREE.PlaneBufferGeometry( size, size, 1 );
    var matStdFloor = new THREE.ShadowMaterial();
    matStdFloor.opacity = 0.9;
    this.floor = new THREE.Mesh(geoFloor, matStdFloor);
    this.floor.rotation.x = -Math.PI/2;
    this.floor.receiveShadow = true;
    this.parent.add(this.floor);
    this.elements.push(this.floor);
  }

  initLights() {
    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);
    directionalLight.position.set( -5, 10, 10 );
    directionalLight.castShadow = true;
    this.parent.add( directionalLight );

    directionalLight.shadow.mapSize.width = 512;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 500;     // default
  }

  remove() {
    this.elements.forEach((element) => {
      this.parent.remove(element);
    });
  }

  redrawGrid() {
    this.parent.remove(this.floor);
    this.initFloor(this.floorSize, this.numLines);
  }

  toggleGrid() {
    this.floor.visible = !this.floor.visible;
  }

  hide() {
    this.floor.visible = true;
  }

  show() {
    this.floor.visible = false;
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

  handleBackgroundColorChange(color, event) {
    this.color = color.hex;
    this.renderer.setClearColor(new THREE.Color(color.hex));
  }
  getStylesGui() {
    return <StylesGUI
      handleBackgroundColorChange={this.handleBackgroundColorChange.bind(this)}
      backgroundColor={this.color}
    />;
  }
}

module.exports = EmptyEnvironment;


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
                backgroundColor:this.props.backgroundColor
              }}></div>
            </OverlayTrigger>
          </ListGroupItem>
      </ListGroup>
    );
  }
}