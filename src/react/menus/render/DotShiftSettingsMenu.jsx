/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 05:06:19
 * @modify date 2018-09-02 05:06:19
 * @desc [description]
*/

import { Popover, OverlayTrigger } from 'react-bootstrap';
import DatGui, { DatNumber } from 'react-dat-gui';
import Icon from 'react-fa';

class DotShiftSettingsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      data: this.props.data,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.forceUpdate === true) {
      this.setState({ forceUpdate: false });
      return true;
    }

    if (this.props && this.state) {
      if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
        this.props = nextProps;
        return true;
      }
      return false;
    }
    return false;
  }

  updateOptions(d) {
    this.setState({
      data: d,
    });
    this.props.updateOptions(d);
    this.forceUpdate();
  }

  render() {
    const popoverTop = (
      <Popover id="dotShift-settings-popover" title="Style">
        <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
          {/* <DatFolder title="Settings"> */}
            <DatNumber min={1} max={10} step={1} label="Dot Scale" path="dotScale" />
            <DatNumber min={0} max={1} step={0.001} label="Shift Amt" path="shiftAmt" />
          {/* </DatFolder> */}
        </DatGui>
      </Popover>
    );
    return (
      <OverlayTrigger
        trigger="click"
        placement="top"
        rootClose
        overlay={popoverTop}
      >
        <Icon name="cog" />
      </OverlayTrigger>
    );
  }
}

module.exports = DotShiftSettingsMenu;
