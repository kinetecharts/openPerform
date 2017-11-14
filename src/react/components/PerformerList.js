import React from 'react';
import _ from 'lodash';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

class PerformerList extends React.Component {
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
  render() {
    if (this.props.performers.length < 1) {
      return false;
    }
    
    return (
      <div className="performerList">
        <h5>Active Performers</h5>
        <table id="performerTable"><tbody>{
          _.map(this.props.performers.getPerformers(), (performer, idx) => (<tr key={idx}>
            <td title="Hide / Show"><div className={`glyphicon ${(performer.getVisible()) ? ' glyphicon-eye-open' : ' glyphicon-eye-close'}`} onClick={this.toggleVisible.bind(this, performer)} /></td>
            <td title="Track Performer"><div className={`glyphicon ${(performer.getTracking()) ? ' glyphicon-ban-circle' : ' glyphicon-facetime-video'}`} onClick={this.props.trackPerformer.bind(this, performer)} /></td>
            <td title="Name"><span style={{ color: performer.color }}>{performer.name}</span></td>
            <td title="Type"><span>{performer.type}</span></td>
            <td>{ performer.type == 'bvh' ? <table id="controlsTable"><tbody><tr>
              <td title="Play / Pause"><div className={`glyphicon ${(this.state.playing) ? ' glyphicon-pause' : ' glyphicon-play'}`} onClick={this.playPause.bind(this, performer.actions)} /></td>
              <td title="Stop"><div className="glyphicon glyphicon-stop" onClick={this.stop.bind(this, performer.actions)} /></td>
              {/* <td><div className={"glyphicon " + ((this.state.looping)?" glyphicon-repeat":" glyphicon-ban-circle")} onClick={this.loopNoLoop.bind(this, performer.actions)}></div></td> */}
              </tr></tbody></table>
              : <table id="inputsTable"><tbody><tr>
                <td title="Playback Delay"><input onChange={this.updateDelay.bind(this, performer)} type="text" id="delayInput" value={performer.getDelay()} /></td>
                <td title="Offset"><input onChange={this.updateOffset.bind(this, performer)} type="text" id="offsetInput" value={performer.getOffset()} /></td>
              </tr></tbody></table>
            }</td>
            <td title="Render Type"><Select
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
            </td>
            <td title="Render Style"><Select
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
            </td>
            <td title="Edit Effects"><div className="glyphicon glyphicon-fire" onClick={this.props.openPerformerModal.bind(this, performer.guiDOM)} /></td>
            <td>{ (performer.type == 'clone') ?
              <div title="Delete Clone" className="glyphicon glyphicon-trash" onClick={this.removeClone.bind(this, performer)} />
            : <div title="Create Clone" className="glyphicon glyphicon-plus" onClick={this.addClone.bind(this, performer)} />
            }</td>
          </tr>))
        }</tbody></table>
      </div>
    );
  }
}

module.exports = PerformerList;
