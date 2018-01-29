import React from 'react';
import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table } from 'react-bootstrap';

import Icon from 'react-fa';

import NumberInput from './../inputs/NumberInput';

class PerformerControls extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      playing: true,
      looping: true,
    };
  }
  playPause() {
    if (this.state.playing) {
      this.props.actions.pause();
      this.setState({ playing: false });
    } else {
      this.props.actions.play();
      this.setState({ playing: true });
    }
  }
  loopNoLoop() {
    if (this.state.looping) {
      this.props.actions.noLoop();
      this.setState({ looping: false });
    } else {
      this.props.actions.loop();
      this.setState({ looping: true });
    }
  }
  stop() {
    this.props.actions.stop();
    this.setState({ playing: false });
  }
  render() {
    switch (this.props.type.toLowerCase()) {
      default: 
        return (
          <Table id="controlsTable">
            <tbody>
              <tr>
                <td title="Live Data">
                  Live
                </td>
              </tr>
            </tbody>
          </Table>
        );
        break;
      case 'clone':
        return (
          <Table id="controlsTable">
            <tbody>
              <tr>
                <td title="Clone Data">
                  Clone
                </td>
              </tr>
            </tbody>
          </Table>
        );
        break;
      case 'bvh':
      return (
        <Table id="controlsTable">
          <tbody>
            <tr>
              <td>
                {(this.state.playing === true) ?
                    <Icon title="Pause" name="pause" onClick={this.playPause.bind(this)} /> :
                    <Icon title="Play" name="play" onClick={this.playPause.bind(this)} />}
              </td>
              <td>
                <Icon title="Stop" name="stop" onClick={this.stop.bind(this)} />
              </td>
              <td>
                {(this.state.looping === true) ?
                  <Icon title="No Loop" name="ban" onClick={this.loopNoLoop.bind(this)} /> :
                  <Icon title="Loop" name="repeat" onClick={this.loopNoLoop.bind(this)} />
                }
              </td>
            </tr>
          </tbody>
        </Table>
      );
      break;
    }
  }
}

module.exports = PerformerControls;
