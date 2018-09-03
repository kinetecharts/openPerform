/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 06:55:09
 * @modify date 2018-09-02 06:55:09
 * @desc [description]
*/

import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';
import DatGui, { DatColor, DatNumber } from 'react-dat-gui';
import Icon from 'react-fa';

class SketchSettingsMenu extends React.Component {
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
      <Popover id="sketch-settings-popover" title="Style">
        <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
          <DatColor label="Edge Color" path="edgeColor"/>
          <DatColor label="Bg Color" path="bgColor"/>
          <DatNumber label="Noise" min={0} max={1} step={0.01} path="noiseAmount" />
          <DatNumber label="Error" min={0} max={60} step={1} path="errorPeriod" />
          <DatNumber label="Range" min={0} max={1} step={0.001} path="errorRange" />
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

module.exports = SketchSettingsMenu;
