/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:51:54
 * @modify date 2018-09-02 03:51:54
 * @desc [description]
*/

import { ListGroup, ListGroupItem } from 'react-bootstrap';
import DatGui, { DatNumber, DatColor, DatFolder } from 'react-dat-gui';

class WaterMenu extends React.Component {
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
              <DatGui data={this.state.data} onUpdate={this.updateOptions.bind(this)}>
                {/* <DatFolder title="Settings"> */}
                  <DatNumber min={0.1} max={1} step={0.05} label="Wave Speed" path="waves" />
                  <DatNumber min={1} max={100} label="Distortion Scale" path="distortionScale" />
                  <DatColor label="Sun Color" path="sunColor"/>
                  <DatColor label="Water Color" path="waterColor"/>
                {/* </DatFolder> */}
              </DatGui>
          </ListGroupItem>
      </ListGroup>
    );
  }
}

module.exports = WaterMenu;
