import React from 'react';
import _ from 'lodash';

import DatGui, { DatBoolean, DatButton, DatNumber, DatString, DatColor } from 'react-dat-gui';
import datGuiCss from 'react-dat-gui/build/react-dat-gui.css';
import { ListGroup, ListGroupItem, DropdownButton, MenuItem, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

import Trail from './../../libs/trail';
import Common from './../../util/Common';

import config from './../../config';

class Trails {
  constructor(effectId, parent, color) {
    this.id = effectId;
    this.name = 'trails';
    this.parent = parent;

    this.targets = ['righthand', 'lefthand'];
    this.possibleTargets = ["hips",
			"rightupleg", "rightleg", "rightfoot",
			"leftupleg", "leftleg", "leftfoot",
			"spine", "spine3", "head",
			"rightarm", "rightforearm", 'righthand',
      "leftarm", "leftforearm", 'lefthand',
    ];

    this.trails = [];

    // initialize the trail
    this.options = {
      thickness: 2,
      length: 75,
      headColor: '#352f9d',
      tailColor: '#ff0000',
      headAlpha: 0.75,
      tailAlpha: 0.35,
    };
  }

  addTrail(parent, part, options) {
    // specify points to create planar trail-head geometry
    this.circlePoints = [];
    this.twoPI = Math.PI * 2;
    this.index = 10;
    this.scale = options.thickness;
    this.inc = this.twoPI / 32.0;

    for (let i = 0; i <= this.twoPI + this.inc; i += this.inc) {
      this.vector = new THREE.Vector3();
      this.vector.set(Math.cos(i) * this.scale, Math.sin(i) * this.scale, 0);
      this.circlePoints[this.index] = this.vector;
      this.index++;
    }
    this.trailHeadGeometry = this.circlePoints;

    // create the trail renderer object
    const trail = new THREE.TrailRenderer(parent, false);

    // create material for the trail renderer
    const trailMaterial = THREE.TrailRenderer.createBaseMaterial();

    const headColor = Common.hexToRgb(options.headColor);
    const tailColor = Common.hexToRgb(options.tailColor);
    trailMaterial.uniforms.headColor.value.set(
      Common.mapRange(headColor[0], 0, 255, 0, 1),
      Common.mapRange(headColor[1], 0, 255, 0, 1),
      Common.mapRange(headColor[2], 0, 255, 0, 1),
      options.headAlpha,
    );
    
    trailMaterial.uniforms.tailColor.value.set(
      Common.mapRange(tailColor[0], 0, 255, 0, 1),
      Common.mapRange(tailColor[1], 0, 255, 0, 1),
      Common.mapRange(tailColor[2], 0, 255, 0, 1),
      options.tailAlpha,
    );


    trail.initialize(trailMaterial, options.length, false, 0, this.trailHeadGeometry, part);
    trail.activate();

    return trail;
  }

  remove() {
    // console.log('Deleting trails...');
    _.each(this.trails, (trail) => {
      trail.deactivate();
      trail.reset();
      trail.destroyMesh();
    });
    this.trails = [];
  }

  updateParameters(data) {
    // switch(data.parameter) {
    // 	case 'life':
    // 		this.options.lifetime = data.value*100;
    // 		break;
    // 	case 'rate':
    // 		this.spawnerOptions.spawnRate = data.value*3000;
    // 		break;
    // 	case 'size':
    // 		this.options.size = data.value*200;
    // 		break;
    // 	case 'color':
    // 		this.options.colorRandomness = data.value*10;
    // 		break;
    // }
  }

  update(data, currentPose, distances) {
    let idx = 0;
    data.traverse((d) => {
      if (_.filter(this.targets, t => `robot_${t}` == d.name.toLowerCase()).length > 0) {
        if (this.trails[idx]) {
          const time = performance.now();
          if (time - this.trails[idx].lastTrailUpdateTime > 50) {
            this.trails[idx].advance();
            this.trails[idx].lastTrailUpdateTime = time;
          } else {
            this.trails[idx].updateHead();
          }

          if (this.trails[idx].refresh == true) {
            this.trails[idx].deactivate();
          }
        }

        if (!this.trails[idx]) {
          this.trails[idx] = this.addTrail(this.parent, d, this.options);
          this.trails[idx].lastTrailUpdateTime = performance.now();
          this.trails[idx].refresh = false;
        }
        idx++;
      }
    });
  }

  updateParts(data) {
    this.targets = data;
    this.remove();
  }

  updateOptions(data) {
    this.options = data;
    this.remove();
  }

  getGUI() {
    return <GUI data={this.options}
    currentTargets={this.targets}
    possibleTargets={this.possibleTargets}
    updateOptions={this.updateOptions.bind(this)}
    updateParts={this.updateParts.bind(this)}/>;
  }
}

module.exports = Trails;

class GUI extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  render() {
    return (
      <div>
        <ToggleButtonGroup id="trailParts" onChange={this.props.updateParts.bind(this)} type="checkbox" name="options" defaultValue={this.props.currentTargets}>
          {_.map(this.props.possibleTargets, (t, idx) => {
            return (<ToggleButton bsSize="xsmall" key={idx} value={t}>{t}</ToggleButton>);
          })}
        </ToggleButtonGroup>

        <DatGui data={this.props.data} onUpdate={this.props.updateOptions.bind(this)}>
          <DatNumber min={0.5} max={10} step={0.5} path='thickness' label='Thickness' />
          <DatNumber labelWidth={30} min={1} max={500} step={1} path='length' label='Length' />
          <DatColor label="Head Color" path='headColor'/>
          <DatNumber min={0} max={1} step={0.1} path='headAlpha' label='Head Alpha' />
          <DatColor label="Tail Color" path='tailColor'/>
          <DatNumber min={0} max={1} step={0.1} path='tailAlpha' label='Tail Alpha' />
        </DatGui>
      </div>
    );
  }
}