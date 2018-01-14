import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import { Modal, OverlayTrigger, Button, Row, Col } from 'react-bootstrap';

class EnvironmentSettingsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (_.size(this.refs) > 0) {//attach dat.gui instance to react dom
      if (this.refs.environmentSettingsBody.children.length == 0) {
        this.refs.environmentSettingsBody.appendChild(this.props.content);
      }
    }
    return this.props.show !== nextProps.show;
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeEnvironmentModal}>
        <Modal.Header closeButton>
          <Modal.Title>Environment Settings</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {<div ref="environmentSettingsBody" id="environmentModalBody"></div>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeEnvironmentModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

module.exports = EnvironmentSettingsModal;
