import React from 'react';
import _ from 'lodash';
import { Modal, OverlayTrigger, Button, Row, Col } from 'react-bootstrap';

class GroupEffectsModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  shouldComponentUpdate(nextProps, nextState) {
    return this.props.show !== nextProps.show;
  }
  render() {
    return (
      <Modal show={this.props.show} onHide={this.props.closeGroupModal}>
        <Modal.Header closeButton>
          <Modal.Title>Keyboard Shortcuts</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {_.map(this.props.keyboardList.labels, (key, idx) => (<Row key={idx}><Col sm={6} style={{ textAlign: 'right' }}>{this.props.keyboardList.events[idx]}</Col><Col sm={6}>{key}</Col></Row>))}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={this.props.closeGroupModal}>Close</Button>
        </Modal.Footer>
      </Modal>
    );
  }
}

module.exports = GroupEffectsModal;
