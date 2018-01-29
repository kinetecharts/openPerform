import React from 'react';
import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';

import { ChromePicker } from 'react-color';

import Icon from 'react-fa';

import NumberInput from './../inputs/NumberInput';


class PerformerStyles extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      displayColorPicker: false,
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
  handleClick() {
    this.setState({ displayColorPicker: !this.state.displayColorPicker })
  }
  handleClose() {
    this.setState({ forceUpdate: true, displayColorPicker: false })
  }
  render() {
    const cPicker = (
      <Popover id="popover-positioned-top" title="Material Color">
        <ChromePicker 
          color={this.props.color}
          onChange={this.props.handleColorChange}
        />
      </Popover>
    );
    const popoverTop = (
      <Popover id="popover-positioned-scrolling-top" title="Update Style">
        <ListGroup>
          <ListGroupItem>
            Type: <DropdownButton
              dropup
              bsStyle="default"
              bsSize="xsmall"
              title={this.props.type.label}
              name="displayType"
              id="performer-style-type-dropdown"
              onSelect={this.props.changeType}>
              {_.map(this.props.type, (type, idx) => {
                return (<MenuItem key={idx} eventKey={idx}>{type.label}</MenuItem>);
              })}
            </DropdownButton>
          </ListGroupItem>
          <ListGroupItem>
            Style: <DropdownButton
              dropup
              bsStyle="default"
              bsSize="xsmall"
              title={this.props.style}
              name="displayStype"
              id="performer-style-stype-dropdown"
              onSelect={this.props.changeStyle}>
              {_.map(this.props.styles, (style, idx) => {
                return (<MenuItem key={idx} eventKey={idx}>{style}</MenuItem>);
              })}
            </DropdownButton>
          </ListGroupItem>
          <ListGroupItem>
              <Table className="styleOptionsTable">
                <tbody>
                  <tr>
                    <td title="Hide / Show" onClick={this.props.toggleVisible}>
                      {(this.props.visible) ? <Icon name="eye" /> : <Icon name="eye-slash" />}
                    </td>
                    <td title="Wireframe" onClick={this.props.toggleWireframe}>
                      {(this.props.wireframe) ? <Icon name="circle-o" /> : <Icon name="circle" />}
                    </td>
                    <td title="Color Picker">
                      <OverlayTrigger
                        trigger="click"
                        rootClose
                        placement="top"
                        overlay={cPicker}
                      >
                        <div id="colorSquare" style={{
                          backgroundColor:'#'+this.props.color.toString(16)
                        }}></div>
                      </OverlayTrigger>
                    </td>
                  </tr>
                </tbody>
              </Table>
          </ListGroupItem>
        </ListGroup>
      </Popover>
    );
    return (
      <OverlayTrigger
        trigger="click"
        placement="top"
        overlay={popoverTop}
      >
        <Icon name="paint-brush" />
      </OverlayTrigger>
    );
  }
}

module.exports = PerformerStyles;
