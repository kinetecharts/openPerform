/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 01:47:30
 * @modify date 2018-08-26 01:47:30
 * @desc [Menu to control The Ghosting Effect.]
*/



import DatGui, { DatNumber, DatBoolean, DatFolder } from 'react-dat-gui';
require('react-dat-gui/build/react-dat-gui.css');

class GhostingMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      data: this.props.data,
    };
  }
  updateOptions(d) {
    this.setState({
      data: d,
    });
    this.props.updateOptions(d);
  }
  render() {
    return (
      <div>
        <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
          {/* <DatFolder title="Settings"> */}
            {/* <DatBoolean path="isPlaying" label="Enabled" /> */}
            <DatNumber min={0.5} max={10} step={0.5} path="rate" label="Clone Rate" />
            <DatNumber min={0.5} max={10} step={0.5} path="life" label="Clone Life" />
            <DatNumber min={0.5} max={10} step={0.5} path="size" label="Clone Size" />
          {/* </DatFolder> */}
        </DatGui>
      </div>
    );
  }
}

module.exports = GhostingMenu;