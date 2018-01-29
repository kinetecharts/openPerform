import React from 'react';
import Select from 'react-select';

import Icon from 'react-fa';

import { Panel, Table, OverlayTrigger, Popover, ListGroup, ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap';

import 'react-select/dist/react-select.css';

import PerformerOptions from './../options/PerformerOptions'
import PerformerControls from './../controls/PerformerControls'
import NumberInput from './../inputs/NumberInput';

class PerformerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
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
  changeType(performer, val) {
    performer.setType(performer.getTypes()[val]);
    this.setState({ forceUpdate: true });
  }
  changeStyle(performer, val) {
    performer.updateStyle(performer.getStyles()[val]);
    if (val === 0) { // reset model to default
      performer.setType(performer.getType());
    }
    this.setState({ forceUpdate: true });
  }
  addClone(performer) {
    this.props.performers.add(`Clone_${_.size(this.props.performers.getPerformers()) + 1}`, 'clone', null);
    this.setState({ forceUpdate: true });
  }
  removeClone(performer) {
    this.props.performers.remove(performer.inputId);
    this.setState({ forceUpdate: true });
  }
  toggleVisible(performer) {
    performer.toggleVisible();
    this.setState({ forceUpdate: true });
  }
  updateDelay(performer, value) {
    performer.setDelay(parseFloat(value));
    this.setState({ forceUpdate: true });
  }
  updateOffsetX(performer, value) {
    let off = performer.getOffset();
    off.x = parseFloat(value);
    performer.setOffset(off);
    this.setState({ forceUpdate: true });
  }
  updateOffsetY(performer, value) {
    let off = performer.getOffset();
    off.y = parseFloat(value);
    performer.setOffset(off);
    this.setState({ forceUpdate: true });
  }
  updateOffsetZ(performer, value) {
    let off = performer.getOffset();
    off.z = parseFloat(value);
    performer.setOffset(off);
    this.setState({ forceUpdate: true });
  }
  renderStyleMenu(performer) {
    const popoverTop = (
      <Popover id="popover-positioned-scrolling-top" title="Update Style">
        <ListGroup>
          <ListGroupItem>
            Type: <DropdownButton
              dropup
              bsStyle="default"
              bsSize="xsmall"
              title={performer.getType().label}
              name="displayType"
              id="performer-style-type-dropdown"
              onSelect={this.changeType.bind(this, performer)}>
              {_.map(performer.getTypes(), (type, idx) => {
                return (<MenuItem key={idx} eventKey={idx}>{type.label}</MenuItem>);
              })}
            </DropdownButton>
          </ListGroupItem>
          <ListGroupItem>
            Style: <DropdownButton
              dropup
              bsStyle="default"
              bsSize="xsmall"
              title={performer.getStyle()}
              name="displayStype"
              id="performer-style-stype-dropdown"
              onSelect={this.changeStyle.bind(this, performer)}>
              {_.map(performer.getStyles(), (style, idx) => {
                return (<MenuItem key={idx} eventKey={idx}>{style}</MenuItem>);
              })}
            </DropdownButton>
          </ListGroupItem>
          <ListGroupItem title="Hide / Show" onClick={this.toggleVisible.bind(this, performer)}>
            {(performer.getVisible()) ? <Icon name="eye" /> : <Icon name="eye-slash" />}
          </ListGroupItem>
        </ListGroup>
      </Popover>
    );
    if (performer == undefined) {
      return false;
    }
    return (
      <td>
        <OverlayTrigger
          trigger={['click', 'focus']}
          placement="top"
          overlay={popoverTop}
        >
          <Icon name="paint-brush" />
        </OverlayTrigger>
      </td>
    );
  }
  render() {
    if (this.props.performers.length < 1) {
      return false;
    }

    return (
      <Panel className="performerMenu" defaultExpanded>
        <Panel.Heading>
					<Panel.Title toggle><h5>Performers</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body>
              <Table id="performerTable">
                <thead>
                  <tr>
                    <th>Control</th>
                    <th>Track</th>
                    <th>Name</th>
                    <th>Source</th>
                    <th>Options</th>
                    <th>Style</th>
                    <th>Effects</th>
                    <th>Clone</th>
                  </tr>
                </thead><tbody>{
                _.map(this.props.performers.getPerformers(), (performer, idx) => (<tr key={idx}>
                  <td title="Control Performer" >
                    <PerformerControls
                      type={performer.type}
                      actions={performer.actions}
                    />
                  </td>
                  <td title="Track Performer" onClick={this.props.togglePerformerTrack.bind(this, performer)}>{(performer.getTracking()) ? <Icon name="ban" /> : <Icon name="video-camera" />}</td>
                  <td title="Name"><span style={{ color: performer.color }}>{performer.name}</span></td>
                  <td title="Type"><span>{performer.type}</span></td>
                  <td style={{border:'none'}}>
                    <PerformerOptions
                      performer={performer}
                      offset={performer.getOffset()}
                      delay={performer.getDelay()}
                      updateOffsetX={this.updateOffsetX.bind(this, performer)}
                      updateOffsetY={this.updateOffsetY.bind(this, performer)}
                      updateOffsetZ={this.updateOffsetZ.bind(this, performer)}
                      updateDelay={this.updateDelay.bind(this, performer)}
                    />
                  </td>
                  {this.renderStyleMenu(performer)}
                  <td title="Edit Effects" onClick={this.props.openPerformerModal.bind(this, performer.guiDOM)}><Icon name="bolt" /></td>
                  <td>{ (performer.type == 'clone') ?
                    <Icon name="trash" title="Delete Clone" className="glyphicon glyphicon-trash" onClick={this.removeClone.bind(this, performer)} />
                  : <Icon name="plus" title="Create Clone" className="glyphicon glyphicon-plus" onClick={this.addClone.bind(this, performer)} />
                  }</td>
                </tr>))
              }</tbody></Table>
						</Panel.Body>
					</Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = PerformerMenu;
