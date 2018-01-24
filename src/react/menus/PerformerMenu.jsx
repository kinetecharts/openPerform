import React from 'react';
import _ from 'lodash';
import Select from 'react-select';

import {Icon} from 'react-fa'

import { Panel, MenuItem, DropdownButton, Table, OverlayTrigger, Popover, ListGroup, ListGroupItem } from 'react-bootstrap';

import 'react-select/dist/react-select.css';


class PerformerMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      playing: true,
      looping: true,
      forceUpdate: false,
    };
  }
  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.forceUpdate == true) {
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
  playPause(actions) {
    if (this.state.playing) {
      actions.pause();
      this.setState({ playing: false });
    } else {
      actions.play();
      this.setState({ playing: true });
    }
  }
  loopNoLoop(actions) {
    if (this.state.looping) {
      actions.noLoop();
      this.setState({ looping: false });
    } else {
      actions.loop();
      this.setState({ looping: true });
    }
  }
  stop(actions) {
    actions.stop();
    this.setState({ playing: false });
  }
  changeType(performer, val) {
    performer.setType(val.value);
    this.setState({ forceUpdate: true });
  }
  changeStyle(performer, val) {
    performer.updateStyle(val.value);
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
  updateDelay(performer, event) {
    performer.setDelay(parseFloat(event.target.value));
    this.setState({ forceUpdate: true });
  }
  updateOffset(performer, event) {
    performer.setOffset(parseFloat(event.target.value));
    this.setState({ forceUpdate: true });
  }
  renderStyleMenu(performer) {
    const popoverTop = (
      <Popover id="popover-positioned-scrolling-top" title="Update Style">
        <ListGroup>
          <ListGroupItem>
            <Select
              clearable={false}
              autoBlur={true}
              autofocus={false}
              searchable={false}
              backspaceRemoves={false}
              deleteRemoves={false}
              name="displayType"
              value={performer.getType()}
              options={performer.getTypes()}
              onChange={this.changeType.bind(this, performer)}
            />
          </ListGroupItem>
          <ListGroupItem>
            <Select
              clearable={false}
              autoBlur={true}
              autofocus={false}
              searchable={false}
              backspaceRemoves={false}
              deleteRemoves={false}
              name="displayStyle"
              value={performer.getStyle()}
              options={_.map(performer.styles, s => ({ value: s, label: s }))}
              onChange={this.changeStyle.bind(this, performer)}
            />
          </ListGroupItem>
        </ListGroup>
      </Popover>
    );
    return(
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
                    <th>Visible</th>
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
                  <td title="Hide / Show" onClick={this.toggleVisible.bind(this, performer)}>{(performer.getVisible()) ? <Icon name="eye" /> : <Icon name="eye-slash" />}</td>
                  <td title="Track Performer" onClick={this.props.togglePerformerTrack.bind(this, performer)}>{(performer.getTracking()) ? <Icon name="ban" /> : <Icon name="video-camera" />}</td>
                  <td title="Name"><span style={{ color: performer.color }}>{performer.name}</span></td>
                  <td title="Type"><span>{performer.type}</span></td>
                  <td style={{border:'none'}}>{ performer.type == 'bvh' ? <Table id="controlsTable"><tbody><tr>
                    <td title="Play / Pause">{(this.state.playing) ? <Icon name="pause" onClick={this.playPause.bind(this, performer.actions)}/> : <Icon name="play" onClick={this.playPause.bind(this, performer.actions)}/>}</td>
                    <td title="Stop"><Icon name="stop" onClick={this.stop.bind(this, performer.actions)}/></td>
                    {/* <td><div className={"glyphicon " + ((this.state.looping)?" glyphicon-repeat":" glyphicon-ban-circle")} onClick={this.loopNoLoop.bind(this, performer.actions)}></div></td> */}
                    </tr></tbody></Table>
                    : <table id="inputsTable"><tbody><tr>
                      <td title="Playback Delay"><input onChange={this.updateDelay.bind(this, performer)} type="text" id="delayInput" value={performer.getDelay()} /></td>
                      <td title="Offset"><input onChange={this.updateOffset.bind(this, performer)} type="text" id="offsetInput" value={performer.getOffset()} /></td>
                    </tr></tbody></table>
                  }</td>
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
