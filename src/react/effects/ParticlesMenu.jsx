/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 01:47:30
 * @modify date 2018-08-26 01:47:30
 * @desc [Menu to control The Particles Effect.]
*/

import React from 'react';

import DatGui, { DatNumber, DatFolder, DatColor } from 'react-dat-gui';
require('react-dat-gui/build/react-dat-gui.css');

import PartsPicker from './PartsPicker';

// react gui returned to effects menu
class ParticlesMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      data: this.props.data,
      currentTargets: this.props.currentTargets,
      possibleTargets: this.props.possibleTargets,
    };
  }
  updateOptions(d) {
    this.setState({
      data: d,
    });
    this.props.updateOptions(d);
  }
  updateParts(d) {
    this.setState({
      currentTargets: d,
    });
    this.props.updateParts(d);
  }
  render() {
    return (
      <div>
        <PartsPicker updateParts={this.updateParts.bind(this)} currentTargets={this.state.currentTargets} possibleTargets={this.state.possibleTargets} />
        <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
          {/* <DatFolder title="Settings"> */}
            <DatNumber min={1} max={200} step={0.5} path="size" label="Size" />
            <DatNumber min={0} max={250} step={0.5} path="sizeRandomness" label="Size Randomness" />
            <DatColor label="Color" path="color"/>
            <DatNumber min={0} max={10} step={0.5} path="colorRandomness" label="Color Randomness" />
            <DatNumber min={0} max={30} step={0.5} path="velocityRandomness" label="Velocity Randomness" />
            <DatNumber min={0} max={30} step={0.5} path="positionRandomness" label="Position Randomness" />
            <DatNumber min={0.1} max={100} step={0.5} path="lifetime" label="Lifetime" />
            <DatNumber min={0} max={10} step={0.5} path="turbulence" label="Turbulence" />
          {/* </DatFolder> */}
        </DatGui>
      </div>
    );
  }
}

module.exports = ParticlesMenu;
