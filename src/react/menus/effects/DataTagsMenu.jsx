/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 01:47:30
 * @modify date 2018-08-26 01:47:30
 * @desc [Menu to control The DataTags Effect.]
*/



import DatGui, { DatBoolean, DatFolder } from 'react-dat-gui';
require('react-dat-gui/build/react-dat-gui.css');

import PartsPickerMenu from './PartsPickerMenu';

// react gui returned to effects menu
class DataTagsMenu extends React.Component {
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
            <DatBoolean path="showName" label="Show Name" />
            <DatBoolean path="showPosition" label="Show Position" />
            <DatBoolean path="showRotation" label="Show Rotation" />
          {/* </DatFolder> */}
        </DatGui>
      </div>
    );
  }
}

module.exports = DataTagsMenu;
