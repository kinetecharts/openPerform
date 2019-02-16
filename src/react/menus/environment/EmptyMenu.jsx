/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:51:06
 * @modify date 2018-09-02 03:51:06
 * @desc [description]
*/

import { ListGroup, ListGroupItem } from 'react-bootstrap';
import DatGui, { DatNumber, DatColor, DatFolder } from 'react-dat-gui';

class EmptyMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
  }

  updateOptions(d) {
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

module.exports = EmptyMenu;
