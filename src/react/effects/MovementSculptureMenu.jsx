/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 01:47:30
 * @modify date 2018-08-26 01:47:30
 * @desc [Menu to control The Movement Sculpture Effect.]
*/

import React from 'react';

import DatGui, { DatNumber, DatButton, DatFolder, DatSelect } from 'react-dat-gui';
require('react-dat-gui/build/react-dat-gui.css');

// react gui returned to effects menu
class MovementSculptureMenu extends React.Component {
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
        <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
          {/* <DatFolder title="Settings"> */}
            <DatNumber min={1} max={5} step={0.5} path='recordLength' label='Time' />
            <DatNumber min={0} max={25} step={5} path='maxClones' label='# Steps' />
            <DatSelect label="Filetype" path='type' options={this.state.data.types} />
            <DatButton label="Click to Record" onClick={this.props.record.bind(this)} />
          {/* </DatFolder> */}
        </DatGui>
      </div>
    );
  }
}

module.exports = MovementSculptureMenu;
