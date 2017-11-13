import React from 'react';
import _ from 'lodash';
import Select from 'react-select';

import 'react-select/dist/react-select.css';

class EnvironmentList extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      playing: false,
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
  changeType(environment, val) {
    environment.setType(val.value);
    this.setState({ forceUpdate: true });
  }
  changeStyle(environment, val) {
    environment.updateStyle(val.value);
    this.setState({ forceUpdate: true });
  }
  editEffects(environment) {

  }
  addClone(environment) {
    this.props.environments.add(`Clone_${_.size(this.props.environments.getEnvironments()) + 1}`, 'clone', null);
    this.setState({ forceUpdate: true });
  }
  removeClone(environment) {
    this.props.environments.remove(environment.inputId);
    this.setState({ forceUpdate: true });
  }
  toggleVisible(environment) {
    environment.toggleVisible();
    this.setState({ forceUpdate: true });
  }
  updateDelay(environment, event) {
    environment.setDelay(parseFloat(event.target.value));
    this.setState({ forceUpdate: true });
  }
  updateOffset(environment, event) {
    environment.setOffset(parseFloat(event.target.value));
    this.setState({ forceUpdate: true });
  }
  render() {
    if (this.props.environments.length == 0) {
      return false;
    }

    return (
      <div className="environmentList">
        <h5>Active Environments</h5>
        <table id="environmentTable"><tbody>{
          _.map(this.props.environments.getEnvironments(), (environment, idx) => (
            <tr key={idx}>
              <td title="Hide / Show"><div className={`glyphicon ${(environment.getVisible()) ? ' glyphicon-eye-open' : ' glyphicon-eye-close'}`} onClick={this.toggleVisible.bind(this, environment)} /></td>
              <td title="Name"><span style={{ color: environment.color }}>{environment.name}</span></td>
              <td title="Edit Settings"><div className="glyphicon glyphicon-cog" onClick={this.props.openEnvironmentModal.bind(this, environment.guiDOM)} /></td>
          </tr>))
        }</tbody></table>
      </div>
    );
  }
}

module.exports = EnvironmentList;
