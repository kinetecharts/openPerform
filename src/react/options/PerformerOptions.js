import React from 'react';
import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table } from 'react-bootstrap';

import Icon from 'react-fa';

import NumberInput from './../inputs/NumberInput';

class PerformerOptions extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  render() {
    const popoverTop = (
      <Popover id="performer-options-popover" title="Update Options">
        <ListGroup>
          <ListGroupItem key={0}>
            <h6>Offset</h6>
            <Table>
              <tbody>
                <tr>
                  <td>X:&nbsp;<NumberInput min={-100} max={100} onChange={this.props.updateOffsetX} id="offsetXInput" value={this.props.offset.x}/></td>
                  <td>Y:&nbsp;<NumberInput min={-100} max={100} onChange={this.props.updateOffsetY} id="offsetYInput" value={this.props.offset.y}/></td>
                  <td>Z:&nbsp;<NumberInput min={-100} max={100} onChange={this.props.updateOffsetZ} id="offsetZInput" value={this.props.offset.z}/></td>
                </tr>
              </tbody>
            </Table>
          </ListGroupItem>
          <ListGroupItem key={1}>
            <h6>Delay</h6>
            <Table>
              <tbody>
                <tr>
                  <td><NumberInput min={-100} max={100} onChange={this.props.updateDelay} id="delayInput" value={this.props.delay}/></td>
                </tr>
              </tbody>
            </Table>
          </ListGroupItem>
        </ListGroup>
      </Popover>
    );
    if (this.props.performer == undefined) {
      return false;
    }
    return (
      <OverlayTrigger
          trigger={['click', 'focus']}
          placement="top"
          overlay={popoverTop}
        >
        <Icon name="cog" />
      </OverlayTrigger>
    );
  }
}

module.exports = PerformerOptions;
