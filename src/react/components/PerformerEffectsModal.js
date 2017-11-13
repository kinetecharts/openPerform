import React from 'react';
import ReactDOM from 'react-dom';

import _ from 'lodash';
import { Modal, OverlayTrigger, Button, Row, Col } from 'react-bootstrap';

class PerformerEffectsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (_.size(this.refs) > 0) {//attach dat.gui instance to react dom
      if (this.refs.performerEffectsBody.children.length == 0) {
        this.refs.performerEffectsBody.appendChild(this.props.content);
      }
    }
    return this.props.show !== nextProps.show;
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closePerformerModal}>
        <Modal.Header closeButton>
          <Modal.Title>Perfomer Effects</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {<div ref="performerEffectsBody" id="performerModalBody"></div>}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closePerformerModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

module.exports = PerformerEffectsModal;
