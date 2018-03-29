import React from 'react';
import { Panel } from 'react-bootstrap';

class DebugMenu extends React.Component {
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
      <Panel className="debugMenu" /* defaultExpanded */>
        <Panel.Heading>
          <Panel.Title toggle><h5>Debug</h5></Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body className="debugBody">
            <div id="statsBox"></div>
            <div></div>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = DebugMenu;
