import React from 'react';
import { Grid, Row, Col, Panel, MenuItem, DropdownButton, Button } from 'react-bootstrap';

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
  render() {
    // console.log(this.props.inputManager);
    if (this.props.flyTop == null) {
      this.state.forceUpdate = true;
    }
    return (
      <Panel className="cameraMenu" /* defaultExpanded */>
        <Panel.Heading>
          <Panel.Title toggle><h5>Camera Controls</h5></Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Grid fluid><Row>
              <Col xs={3} md={3}>
                <h6>Track</h6>
                <DropdownButton
                  bsSize="xsmall"
                  onSelect={this.props.selectTrackedPerformer}
                  title={(this.props.trackedPerformer === null) ? 'None' : this.props.trackedPerformer.name}
                  id="trackingTargetDropdown"
                >
                  <MenuItem key="1" eventKey="1">None</MenuItem>
                  {_.map(this.props.performers, (name, idx) => {
                    return <MenuItem key={idx + 2} eventKey={idx + 2}>{name}</MenuItem>
                  })}
                </DropdownButton>
              </Col>
              <Col xs={3} md={3}>
                <h6>Fly</h6>
                <Button bsSize="xsmall" onClick={this.props.flyTop}>Top</Button>
              </Col>
              <Col xs={3} md={3}>
                <h6>Cut</h6>
                <Button bsSize="xsmall" onClick={this.props.cutClose}>Close</Button>
                <Button bsSize="xsmall" onClick={this.props.cutMedium}>Medium</Button>
                <Button bsSize="xsmall" onClick={this.props.cutThreeQ}>3 / 4</Button>
              </Col>
              <Col xs={3} md={3}>
                <h6>Attach</h6>
                <Button bsSize="xsmall" onClick={this.props.firstPerson}>First Person</Button>
                <Button bsSize="xsmall" onClick={this.props.snorryCam}>Snorry</Button>
              </Col>
            </Row></Grid>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = CameraMenu;
