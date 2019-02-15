
import { Grid, Row, Col, Panel, MenuItem, DropdownButton, Button } from 'react-bootstrap';

class CameraMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      forceUpdate: false,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.forceUpdate === true || this.props.flyTop == null) {
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
      <Panel className="cameraMenu" /* defaultExpanded */>
        <Panel.Heading>
          <Panel.Title toggle><h5>Camera Controls</h5></Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body>
            <Grid fluid>
              <Row id="cameraMenuTrackingRow">
                <Col xs={4} md={4}>
                  <h6>Follow</h6>
                  <DropdownButton
                    bsSize="xsmall"
                    onSelect={this.props.selectFollowedPerformer}
                    title={(this.props.followedPerformer === null) ? 'None' : this.props.followedPerformer.name}
                    id="followingTargetDropdown"
                  >
                    <MenuItem key="1" eventKey="1">None</MenuItem>
                    {_.map(this.props.performers, (name, idx) => {
                      return <MenuItem key={idx + 2} eventKey={idx + 2}>{name}</MenuItem>
                    })}
                  </DropdownButton>
                </Col>
                <Col xs={4} md={4}>
                  <h6>Snorry</h6>
                  <DropdownButton
                    bsSize="xsmall"
                    onSelect={this.props.selectSnorriedPerformer}
                    title={(this.props.snorriedPerformer === null) ? 'None' : this.props.snorriedPerformer.name}
                    id="snorriedTargetDropdown"
                  >
                    <MenuItem key="1" eventKey="1">None</MenuItem>
                    {_.map(this.props.performers, (name, idx) => {
                      return <MenuItem key={idx + 2} eventKey={idx + 2}>{name}</MenuItem>
                    })}
                  </DropdownButton>
                </Col>
                <Col xs={4} md={4}>
                <h6>First Person</h6>
                <DropdownButton
                  bsSize="xsmall"
                  onSelect={this.props.selectFirstPersonedPerformer}
                  title={(this.props.firstPersonedPerformer === null) ? 'None' : this.props.firstPersonedPerformer.name}
                  id="personedTargetDropdown"
                >
                  <MenuItem key="1" eventKey="1">None</MenuItem>
                  {_.map(this.props.performers, (name, idx) => {
                    return <MenuItem key={idx + 2} eventKey={idx + 2}>{name}</MenuItem>
                  })}
                </DropdownButton>
              </Col>
              </Row>
              <Row>
                <Col xs={3} md={3}>
                  <h6>Fly to</h6>
                  <Button bsSize="xsmall" onClick={this.props.flyTop}>Top</Button>
                </Col>
                <Col xs={9} md={9}>
                  <h6>Cut to</h6>
                  <Button bsSize="xsmall" onClick={this.props.cutClose}>Close</Button>
                  <Button bsSize="xsmall" onClick={this.props.cutMedium}>Medium</Button>
                  <Button bsSize="xsmall" onClick={this.props.cutThreeQ}>3 / 4</Button>
                </Col>
                <Col xs={3} md={3}>
                </Col>
              </Row>
            </Grid>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = CameraMenu;
