import { ListGroup, ListGroupItem } from 'react-bootstrap';
import DatGui, { DatNumber, DatColor, DatFolder } from 'react-dat-gui';

class KidsRoomMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      data: this.props.data,
    };
  }

  updateOptions(d) {
    this.setState({
      data: d
    });
    this.props.updateOptions(d);
    this.forceUpdate();
  }

  render() {
    return (
      <ListGroup>
          <ListGroupItem>
          </ListGroupItem>
      </ListGroup>
    );
  }
}

module.exports = KidsRoomMenu;
