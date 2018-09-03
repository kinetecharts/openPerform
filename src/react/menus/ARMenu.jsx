
import { Panel, MenuItem, DropdownButton } from 'react-bootstrap';

class ARMenu extends React.Component {
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
      <Panel className={(this.props.active) ? "arMenu" : "arMenu  hidden"} defaultExpanded>
        <Panel.Heading>
					<Panel.Title toggle><h5>AR</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body id="arMenuBody">
						</Panel.Body>
					</Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = ARMenu;
