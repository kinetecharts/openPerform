
import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';

import Icon from 'react-fa';


class EnvironmentStylesMenu extends React.Component {
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
  render() {
    const popoverTop = (
      <Popover id="environment-styles-popover" title="Style">
       {this.props.stylesGUI}
      </Popover>
    );
    return (
      <OverlayTrigger
        trigger="click"
        placement="top"
        rootClose
        overlay={popoverTop}
      >
        <Icon name="paint-brush" />
      </OverlayTrigger>
    );
  }
}

module.exports = EnvironmentStylesMenu;
