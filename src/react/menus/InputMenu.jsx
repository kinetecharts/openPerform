import React from 'react';
import { Panel, MenuItem, DropdownButton } from 'react-bootstrap';

class InputMenu extends React.Component {
  constructor(props) {
    super(props);
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
  render() {
    return (
      <Panel className="inputMenu" defaultExpanded>
        <Panel.Heading>
					<Panel.Title toggle><h5>Inputs</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body>
              Preset: <DropdownButton bsSize="xsmall" pullRight={true} onSelect={this.props.changePreset} title={this.props.currentPreset.replace(/([a-z](?=[A-Z]))/g, '$1 ')} key={this.props.presets.indexOf(this.props.currentPreset)} id="presetDropdown" >
                {
                  _.map(this.props.presets, (p, idx) => <MenuItem eventKey={idx} key={idx}>{p.replace(/([a-z](?=[A-Z]))/g, '$1 ')}</MenuItem>)
                }
              </DropdownButton>
              <ul>
                {
                  _.map(this.props.inputs, (input, idx) => {
                    if (input.toLowerCase() === 'keyboard') {
                      return <li key={idx}>{input.replace(/([a-z](?=[A-Z]))/g, '$1 ')}<span onClick={this.props.openKeyboardModal} className="glyphicon glyphicon-question-sign" /></li>
                    } else {
                      return <li key={idx}>{input.replace(/([a-z](?=[A-Z]))/g, '$1 ')}</li>
                    }

                  })
                }
              </ul>
						</Panel.Body>
					</Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = InputMenu;
