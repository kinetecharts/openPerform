import React from 'react';
import { Grid, Row, Col, Panel, MenuItem, DropdownButton } from 'react-bootstrap';

class CameraMenu extends React.Component {
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
  
  renderTrackingList() {
    if (this.props.performers.length < 1) {
      return false;
    }
    return (
      <DropdownButton
        bsSize="xsmall"
        onSelect={this.props.selectTrackedPerformer}
        title={(this.props.trackedPerformer === null) ? 'None' : this.props.trackedPerformer.name}
        id="trackingTargetDropdown"
      >
        <MenuItem key="1" eventKey="1">None</MenuItem>
        {_.map(this.props.performers.getPerformers(), (performer, idx) => {
          return <MenuItem key={idx + 2} eventKey={idx + 2}>{performer.name}</MenuItem>
        })}
      </DropdownButton>
    );
  }
  render() {
    return (
      <Panel className="cameraMenu" defaultExpanded>
        <Panel.Heading>
          <Panel.Title toggle><h5>Camera Controls</h5></Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Grid fluid={true}><Row>
              <Col xs={2} md={2}>Track:</Col>
              <Col xs={2} md={2}>{this.renderTrackingList()}</Col>
              <Col xs={2} md={2} />
              <Col xs={2} md={2} />
              <Col xs={2} md={2} />
              <Col xs={2} md={2} />
            </Row></Grid>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = CameraMenu;
