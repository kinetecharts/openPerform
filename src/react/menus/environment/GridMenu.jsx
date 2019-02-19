/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:51:28
 * @modify date 2018-09-02 03:51:28
 * @desc [description]
*/

import { ListGroup, ListGroupItem } from 'react-bootstrap';
import DatGui, { DatColor, DatFolder, DatNumber } from 'react-dat-gui';

class GridMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      data: this.props.data,
    };
  }

  updateOptions(d) {
    this.setState({
      data: d,
    });
    this.props.updateOptions(d);
    this.forceUpdate();
  }

  render() {
    return (
      <ListGroup>
          <ListGroupItem> 
              <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
                {/* <DatFolder title="Settings"> */}
                  <DatColor label="Background Color" path="bgColor"/>
                  <DatNumber min={10} max={100} label="Grid Lines" path="numLines" />
                  <DatColor label="Floor Color" path="floorColor"/>
                  <DatColor label="Grid Color" path="gridColor"/>
                {/* </DatFolder> */}
              </DatGui>
          </ListGroupItem>
      </ListGroup>
    );
  }
}

module.exports = GridMenu;
