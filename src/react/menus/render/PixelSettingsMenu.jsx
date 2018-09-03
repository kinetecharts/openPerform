/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 06:15:38
 * @modify date 2018-09-02 06:15:38
 * @desc [description]
*/

import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';
import DatGui, { DatNumber, DatBoolean, DatSelect } from 'react-dat-gui';
import Icon from 'react-fa';

class PixelSettingsMenu extends React.Component {
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
          <DatNumber label="Pixel Size" path="pixelSize" min={1} max={64} />
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

module.exports = PixelSettingsMenu;
