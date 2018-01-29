import React from 'react';
import Select from 'react-select';

import Icon from 'react-fa';

import { Panel, Table, OverlayTrigger, Popover, ListGroup, ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap';

import 'react-select/dist/react-select.css';

import PerformerOptions from './../options/PerformerOptions';
import PerformerControls from './../controls/PerformerControls';
import PerformerStyles from './../styles/PerformerStyles';
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
    this.props.performers.add('Clone_' + _.size(this.props.performers.getPerformers()) + 1, 'clone_' + performer.type, performer, null);
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
  toggleWireframe(performer) {
    performer.toggleWireframe();
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
  handleColorChange(performer, val) {
    console.log(val);
    performer.setMaterialColor(val.hex.replace(/^#/, ''));
    this.setState({forceUpdate: true});
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
                  <td title="Type"><span>{(performer.leader !== null && performer.leader !== undefined) ? performer.leader.name : performer.type}</span></td>
                  <td style={{border:'none'}}>
                    <PerformerOptions
                      offset={performer.getOffset()}
                      delay={performer.getDelay()}
                      updateOffsetX={this.updateOffsetX.bind(this, performer)}
                      updateOffsetY={this.updateOffsetY.bind(this, performer)}
                      updateOffsetZ={this.updateOffsetZ.bind(this, performer)}
                      updateDelay={this.updateDelay.bind(this, performer)}
                    />
                  </td>
                  <td style={{border:'none'}}>
                    <PerformerStyles
                      style={performer.getStyle()}
                      styles={performer.getStyles()}
                      changeStyle={this.changeStyle.bind(this, performer)}
                      type={performer.getType()}
                      types={performer.getTypes()}
                      changeType={this.changeType.bind(this, performer)}
                      visible={performer.getVisible()}
                      toggleVisible={this.toggleVisible.bind(this, performer)}
                      wireframe={performer.getWireframe()}
                      toggleWireframe={this.toggleWireframe.bind(this, performer)}
                      color={performer.getMaterialColor()}
                      handleColorChange={this.handleColorChange.bind(this, performer)}
                    />
                  </td>
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
