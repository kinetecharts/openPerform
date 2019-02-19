import { Panel, ListGroup, ListGroupItem } from 'react-bootstrap';
import Icon from 'react-fa';

class HelpMenu extends React.Component {
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
      <Panel className="helpMenu">
        <Panel.Heading>
          <Panel.Title onClick={this.props.openKeyboardModal} ><h5><Icon name="question-circle" /></h5></Panel.Title>
        </Panel.Heading>
      </Panel>
    );
  }
}

module.exports = HelpMenu;
