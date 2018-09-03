/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 05:58:21
 * @modify date 2018-09-02 05:58:21
 * @desc [description]
*/

import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';
import DatGui, { DatNumber, DatBoolean, DatSelect } from 'react-dat-gui';
import Icon from 'react-fa';

class HalftoneSettingsMenu extends React.Component {
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
      <Popover id="render-styles-settings-popover" title="Style">
        <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
          <DatSelect label="Shape" path="shapeName" options={this.state.data.shapes} />
          <DatNumber label="Radius" path="radius" min={1} max={25} />
          <DatNumber label="Rotate R" path="rotateR" min={0} max={90} />
          <DatNumber label="Rotate G" path="rotateG" min={0} max={90} />
          <DatNumber label="Rotate B" path="rotateB" min={0} max={90} />
          <DatNumber label="Scatter" path="scatter" min={0} max={1} step={0.01} />
          <DatBoolean label="Greyscale" path="greyscale" />
          <DatNumber label="Blending" path="blending" min={0} max={1} step={0.01} />
          <DatSelect label="Mode" path="blendingModeName" options={this.state.data.blendingModes} />
          <DatBoolean label="Disable" path="disable" />
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

module.exports = HalftoneSettingsMenu;
