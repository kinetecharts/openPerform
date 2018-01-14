import React from 'react';
import { Panel, MenuItem, DropdownButton } from 'react-bootstrap';

class VRMenu extends React.Component {
  constructor(props) {
    super(props);
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
    return (
      <Panel className="vrMenu" defaultExpanded>
        <Panel.Heading>
					<Panel.Title toggle><h5>Enter VR</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body className="vrMenuBody">
						</Panel.Body>
					</Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = VRMenu;
