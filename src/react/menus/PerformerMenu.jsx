/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-27 10:07:30
 * @modify date 2018-08-27 10:07:30
 * @desc [description]
*/

import React from 'react';
import ReactDom from 'react-dom';
import Select from 'react-select';

import Icon from 'react-fa';

import { Panel, Table, OverlayTrigger, Popover, ListGroup, ListGroupItem, DropdownButton, MenuItem } from 'react-bootstrap';

import 'react-select/dist/react-select.css';

import PerformerTranslate from './../options/PerformerTranslate';
import PerformerControls from './../controls/PerformerControls';
import PerformerStyles from './../styles/PerformerStyles';
import NumberInput from './../inputs/NumberInput';
import PerformerEffects from './../effects/PerformerEffects';

class PerformerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      forceUpdate: false,
      effectPosition: {
        x: 0,
        y: 0,
      },
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
    if (val === 0) { // reset model to default
      performer.clearPerformer();
    } else {
      performer.updateStyle(performer.getStyles()[val]);
    }
    this.setState({ forceUpdate: true });
  }
  addClone(performer) {
    this.props.performers.add('Clone_' + _.size(this.props.performers.getPerformers()) + 1, 'clone_' + performer.type, performer, null, null);
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

  updateRotationX(performer, value) {
    let rot = performer.getRotation();
    rot.x = parseFloat(value);
    performer.setRotation(rot);
    this.setState({ forceUpdate: true });
  }
  updateRotationY(performer, value) {
    let rot = performer.getRotation();
    rot.y = parseFloat(value);
    performer.setRotation(rot);
    this.setState({ forceUpdate: true });
  }
  updateRotationZ(performer, value) {
    let rot = performer.getRotation();
    rot.z = parseFloat(value);
    performer.setRotation(rot);
    this.setState({ forceUpdate: true });
  }

  handleColorChange(performer, val) {
    performer.setMaterialColor(val.hex.replace(/^#/, ''));
    this.setState({forceUpdate: true});
  }
  handleMaterialChange(performer, val) {
    performer.setMaterial(performer.getMaterials()[val]);
    performer.updateMaterial();
    
    this.setState({forceUpdate: true});
  }
  handleChangeEffect(performer, val, event) {
    event.persist();
    // this.recenterEffectsPopover(event);
    performer.performerEffects.removeAll();
    if (val !== 0) {
      performer.performerEffects.add(performer.effects[val - 1]);
    }
    this.setState({
      forceUpdate: true
    }, () => {
      this.recenterEffectsPopover(event);
    });
  }

  recenterEffectsPopover(event) {
    $('#performer-effects-popover').css('top', 'auto');
    const bottom = $('.performerMenu').height() - (this.state.effectTarget.position().top / 2) - 16;
    $('#performer-effects-popover').css('left', this.state.effectTarget.position().left - 103);
    $('#performer-effects-popover').css('bottom', bottom);
  }

  clickOverTrigger(event) {
    this.setState({
      effectTarget: $(event.currentTarget),
    });
  }

  render() {
    if (this.props.performers.length < 1) {
      return (
        <Panel className="performerMenu" defaultExpanded>
          <Panel.Heading>
            <Panel.Title toggle><h5>Performers</h5></Panel.Title>
          </Panel.Heading>
          <Panel.Collapse>
            <Panel.Body>
              <Table>
                <tbody>
                  <tr>
                    <td id="loadBVHRow_empty">
                      <h6 onClick={this.props.openBVHChooser}>Load BVH File <Icon name="user-plus" /></h6>
                    </td>
                  </tr>
                </tbody>
              </Table>
            </Panel.Body>
          </Panel.Collapse>
        </Panel>
      );
    }
    return (
      <Panel className="performerMenu" /* defaultExpanded */>
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
                  <th>Translate</th>
                  <th>Style</th>
                  <th>Effect</th>
                  <th>Clone</th>
                </tr>
              </thead>
              <tbody>{
                _.map(this.props.performers.getPerformers(), (performer, idx) => (
                  <tr key={idx}>
                    <td title="Control Performer">
                      <PerformerControls
                        type={performer.type}
                        actions={performer.actions}
                      />
                    </td>
                    <td title="Track Performer" onClick={this.props.togglePerformerTrack.bind(this, performer)}>{(performer.getTracking()) ? <Icon name="ban" /> : <Icon name="video-camera" />}</td>
                    <td title="Name"><span style={{ color: performer.color }}>{performer.name}</span></td>
                    <td title="Type"><span>{(performer.leader !== null && performer.leader !== undefined) ? performer.leader.name : performer.type}</span></td>
                    <td>
                      <PerformerTranslate
                        offset={performer.getOffset()}
                        updateOffsetX={this.updateOffsetX.bind(this, performer)}
                        updateOffsetY={this.updateOffsetY.bind(this, performer)}
                        updateOffsetZ={this.updateOffsetZ.bind(this, performer)}
                        rotation={performer.getRotation()}
                        updateRotationX={this.updateRotationX.bind(this, performer)}
                        updateRotationY={this.updateRotationY.bind(this, performer)}
                        updateRotationZ={this.updateRotationZ.bind(this, performer)}
                        delay={performer.getDelay()}
                        updateDelay={this.updateDelay.bind(this, performer)}
                      />
                    </td>
                    <td>
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
                        material={performer.getMaterial()}
                        materials={performer.getMaterials()}
                        handleMaterialChange={this.handleMaterialChange.bind(this, performer)}
                      />
                    </td>
                    <td title="Edit Effects">
                      <PerformerEffects
                        clickOverTrigger={this.clickOverTrigger.bind(this)}
                        effects={performer.effects}
                        effect={(performer.performerEffects.effects.length > 0) ? performer.performerEffects.effects[0].id : 'No Effect'}
                        changeEffect={this.handleChangeEffect.bind(this, performer)}
                        gui={(performer.performerEffects.effects.length > 0) ? performer.performerEffects.effects[0].getGUI() : null}
                      />
                    </td>
                    <td>
                    {(performer.type === 'clone_bvh' || performer.type === 'clone_perceptionNeuron') ?
                      <Icon name="trash" title="Delete Clone" className="glyphicon glyphicon-trash" onClick={this.removeClone.bind(this, performer)} />
                    : <Icon name="plus" title="Create Clone" className="glyphicon glyphicon-plus" onClick={this.addClone.bind(this, performer)} />}
                    </td>
                  </tr>
                ))
                }
                <tr id="loadBVHRow">
                  <td colSpan="2"></td>
                  <td colSpan="2"></td>
                  <td colSpan="2"></td>
                  <td colSpan="2">
                    <h6 onClick={this.props.openBVHChooser}>Load BVH File <Icon name="user-plus" /></h6>
                  </td>
                </tr>
              </tbody>
            </Table>
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = PerformerMenu;
