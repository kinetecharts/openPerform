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
      <Popover id="performer-options-popover" title="Translate">
        <ListGroup>
          <ListGroupItem>
            <h6>Position</h6>
            <Table id="positionOffsetTable">
              <tbody>
                <tr>
                  <td align="center">
                    <NumberInput min={-100} max={100} onChange={this.props.updateOffsetX} id="offsetXInput" value={this.props.offset.x}/>
                    <span>X</span>
                  </td>
                  <td align="center">
                    <NumberInput min={-100} max={100} onChange={this.props.updateOffsetY} id="offsetYInput" value={this.props.offset.y}/>
                    <span>Y</span>
                  </td>
                  <td align="center">
                    <NumberInput min={-100} max={100} onChange={this.props.updateOffsetZ} id="offsetZInput" value={this.props.offset.z}/>
                    <span>Z</span>
                  </td>
                </tr>
              </tbody>
            </Table>
          </ListGroupItem>
          {/* <ListGroupItem key={1}>
            <h6>Delay</h6>
            <Table>
              <tbody>
                <tr>
                  <td><NumberInput min={-100} max={100} onChange={this.props.updateDelay} id="delayInput" value={this.props.delay}/></td>
                </tr>
              </tbody>
            </Table>
          </ListGroupItem> */}
        </ListGroup>
      </Popover>
    );
    return (
      <OverlayTrigger
          trigger={['click', 'focus']}
          rootClose
          placement="top"
          overlay={popoverTop}
        >
        <Icon name="cog" />
      </OverlayTrigger>
    );
  }
}

module.exports = PerformerOptions;
