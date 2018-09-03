/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 05:16:56
 * @modify date 2018-09-02 05:16:56
 * @desc [description]
*/

import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';
import DatGui, { DatNumber } from 'react-dat-gui';
import Icon from 'react-fa';

class EdgesSettingsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      forceUpdate: false,
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

module.exports = EdgesSettingsMenu;
