/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 01:47:30
 * @modify date 2018-08-26 01:47:30
 * @desc [Menu to control The Ribbons Effect.]
*/

import DatGui, { DatNumber, DatColor, DatFolder } from 'react-dat-gui';
require('react-dat-gui/build/react-dat-gui.css');

import PartsPickerMenu from './PartsPickerMenu';

// react gui returned to effects menu
class RibbonsMenu extends React.Component {
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
        <PartsPickerMenu updateParts={this.updateParts.bind(this)} currentTargets={this.state.currentTargets} possibleTargets={this.state.possibleTargets} />
        <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
          {/* <DatFolder title="Settings"> */}
            <DatNumber min={0.5} max={10} step={0.5} path="thickness" label="Thickness" />
            <DatNumber labelWidth={30} min={1} max={500} step={1} path="length" label="Length" />
            <DatColor label="Head Color" path="headColor"/>
            <DatNumber min={0} max={1} step={0.1} path="headAlpha" label="Head Alpha" />
            <DatColor label="Tail Color" path="tailColor"/>
            <DatNumber min={0} max={1} step={0.1} path="tailAlpha" label="Tail Alpha" />
          {/* </DatFolder> */}
        </DatGui>
      </div>
    );
  }
}

module.exports = RibbonsMenu;
