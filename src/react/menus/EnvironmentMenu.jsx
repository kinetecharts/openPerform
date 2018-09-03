
import Select from 'react-select';

import { Panel, DropdownButton, MenuItem } from 'react-bootstrap';

import 'react-select/dist/react-select.css';

import EnvironmentStylesMenu from './../menus/styles/EnvironmentStylesMenu';

import Common from '../../util/Common';

class EnvironmentMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
      playing: false,
      looping: true,
      forceUpdate: false,
      currentEnvironment: null,
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

  changeStyle(environment, val) {
    environment.updateStyle(val.value);
    this.setState({ forceUpdate: true });
  }

  toggleVisible(environment) {
    environment.toggleVisible();
    this.setState({ forceUpdate: true });
  }

  updateEnvironment(val) {
    this.setState({ forceUpdate: true });
    this.props.updateEnvironment(val);
  }

  render() {
    if (this.props.environments == null || this.props.environments.length == 0) {
      return false;
    }

    return (
      <Panel className="environmentMenu" /* defaultExpanded */>
        <Panel.Heading>
					<Panel.Title toggle><h5>Environment</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body>
              <DropdownButton
                dropup
                bsStyle="default"
                bsSize="xsmall"
                title={'Change Environment'}
                name="environmentSelect"
                id="environment-dropdown"
                onSelect={this.updateEnvironment.bind(this)}
                >
                {_.map(this.props.availEnvironments, (environment, idx) => {
                  return (<MenuItem key={idx} eventKey={idx}>{environment}</MenuItem>);
                })}
              </DropdownButton>
              <table id="environmentTable"><tbody>{
                _.map(this.props.environments.getEnvironments(), (environment, idx) => (
                  <tr key={idx}>
                    <td title="Hide / Show"><div className={`glyphicon ${(environment.getVisible()) ? ' glyphicon-eye-open' : ' glyphicon-eye-close'}`} onClick={this.toggleVisible.bind(this, environment)} /></td>
                    <td title="Name"><span style={{ color: environment.color }}>{environment.name}</span></td>
                    <td title="Edit Settings">
                      <EnvironmentStylesMenu stylesGUI={environment.getGUI()} />
                    </td>
                </tr>))
              }</tbody></table>
						</Panel.Body>
					</Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = EnvironmentMenu;
