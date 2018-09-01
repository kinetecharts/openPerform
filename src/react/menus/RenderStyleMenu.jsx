/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 12:38:48
 * @modify date 2018-08-31 12:38:48
 * @desc [Menu to switch between different render effects.]
*/

import React from 'react';
import Select from 'react-select';

import { Panel, DropdownButton, MenuItem } from 'react-bootstrap';

import 'react-select/dist/react-select.css';

// import EnvironmentStyles from './../styles/EnvironmentStyles';

class RenderStyleMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      // playing: false,
      // looping: true,
      // forceUpdate: false,
      // currentEnvironment: null,
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

  // playPause(actions) {
  //   if (this.state.playing) {
  //     actions.pause();
  //     this.setState({ playing: false });
  //   } else {
  //     actions.play();
  //     this.setState({ playing: true });
  //   }
  // }

  // loopNoLoop(actions) {
  //   if (this.state.looping) {
  //     actions.noLoop();
  //     this.setState({ looping: false });
  //   } else {
  //     actions.loop();
  //     this.setState({ looping: true });
  //   }
  // }

  // stop(actions) {
  //   actions.stop();
  //   this.setState({ playing: false });
  // }

  // changeType(environment, val) {
  //   environment.setType(val.value);
  //   this.setState({ forceUpdate: true });
  // }

  // changeStyle(environment, val) {
  //   environment.updateStyle(val.value);
  //   this.setState({ forceUpdate: true });
  // }

  // editEffects(environment) {}

  // addClone(environment) {
  //   this.props.environments.add(`Clone_${_.size(this.props.environments.getEnvironments()) + 1}`, 'clone', null);
  //   this.setState({ forceUpdate: true });
  // }
  // removeClone(environment) {
  //   this.props.environments.remove(environment.inputId);
  //   this.setState({ forceUpdate: true });
  // }
  // toggleVisible(environment) {
  //   environment.toggleVisible();
  //   this.setState({ forceUpdate: true });
  // }
  // updateDelay(environment, event) {
  //   environment.setDelay(parseFloat(event.target.value));
  //   this.setState({ forceUpdate: true });
  // }
  // updateOffset(environment, event) {
  //   environment.setOffset(parseFloat(event.target.value));
  //   this.setState({ forceUpdate: true });
  // }

  render() {
    if (this.props.renderStyles == null || this.props.renderStyles.length == 0) {
      return false;
    }

    console.log(this.props.renderStyle);

    return (
      <Panel className="renderStyleMenu" /* defaultExpanded */>
        <Panel.Heading>
					<Panel.Title toggle><h5>RenderStyle</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body>
              <DropdownButton
                dropup
                bsStyle="default"
                bsSize="xsmall"
                title={this.props.renderStyle?this.props.renderStyle:''}
                name="renderStyleSelect"
                id="renderStyle-dropdown"
                onSelect={this.props.updateRenderStyle.bind(this.props.renderStyles)}
                >
                {_.map(this.props.availRenderStyles, (renderStyle, idx) => {
                  return (<MenuItem key={idx} eventKey={idx}>{renderStyle}</MenuItem>);
                })}
              </DropdownButton>
              {/* <table id="renderStyleTable"><tbody>{
                _.map(this.props.renderStyles.getRenderStyles(), (renderStyle, idx) => (
                  <tr key={idx}>
                    <td title="Hide / Show"><div className={`glyphicon ${(renderStyle.getVisible()) ? ' glyphicon-eye-open' : ' glyphicon-eye-close'}`} onClick={this.toggleVisible.bind(this, renderStyle)} /></td>
                    <td title="Name"><span style={{ color: renderStyle.color }}>{renderStyle.name}</span></td>
                    <td title="Edit Settings">
                      <RenderStyleStyles stylesGUI={renderStyle.getStylesGui()} />
                    </td>
                </tr>))
              }</tbody></table> */}
						</Panel.Body>
					</Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = RenderStyleMenu;
