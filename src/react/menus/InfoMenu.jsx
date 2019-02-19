import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import Icon from 'react-fa';

class InfoMenu extends React.Component {
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
      <Panel className="infoMenu" /* defaultExpanded */>
        <Panel.Heading>
          <Panel.Title toggle><h5>OpenPerform</h5></Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body className="infoBody">
            <ListGroup>
            <ListGroupItem><a href="https://github.com/kinetecharts/openPerform" target="_blank">Source Code <Icon name="external-link" /></a></ListGroupItem>
            <ListGroupItem><a href="https://www.openperform.org/" target="_blank">OpenPerform.org <Icon name="external-link" /></a></ListGroupItem>
            <ListGroupItem><a href="http://kinetecharts.org/" target="_blank">KinetechArts.org <Icon name="external-link" /></a></ListGroupItem>
            </ListGroup>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = InfoMenu;
