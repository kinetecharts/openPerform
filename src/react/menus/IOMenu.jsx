import React from 'react';
import { Panel, MenuItem, DropdownButton, Table, Button } from 'react-bootstrap';

class IOMenu extends React.Component {
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
      <Panel className="inputMenu" /* defaultExpanded */>
        <Panel.Heading>
					<Panel.Title toggle><h5>I/O</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body>
            <h6>Inputs</h6>
              <Table id="inputsTable">
                <tbody>
                  <tr>
                    <td align="left">
                      Preset: <DropdownButton bsSize="xsmall" pullRight={true} onSelect={this.props.changeInputPreset} title={this.props.currentInputPreset.replace(/([a-z](?=[A-Z]))/g, '$1 ')} key={this.props.inputPresets.indexOf(this.props.currentInputPreset)} id="presetDropdown" >
                        {
                          _.map(this.props.inputPresets, (p, idx) => <MenuItem eventKey={idx} key={idx}>{p.replace(/([a-z](?=[A-Z]))/g, '$1 ')}</MenuItem>)
                        }
                      </DropdownButton>
                    </td>
                  </tr>
                  <tr>
                  <td align="left">
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
                  </td>
                </tr>
              </tbody>
            </Table>
            <h6>Outputs</h6>
              <Table id="outputsTable">
                <tbody>
                  {/* <tr>
                    <td align="center">
                      Preset: <DropdownButton bsSize="xsmall" pullRight={true} onSelect={this.props.changeInputPreset} title={this.props.currentInputPreset.replace(/([a-z](?=[A-Z]))/g, '$1 ')} key={this.props.inputPresets.indexOf(this.props.currentInputPreset)} id="presetDropdown" >
                        {
                          _.map(this.props.inputPresets, (p, idx) => <MenuItem eventKey={idx} key={idx}>{p.replace(/([a-z](?=[A-Z]))/g, '$1 ')}</MenuItem>)
                        }
                      </DropdownButton>
                    </td>
                  </tr> */}
                  <tr>
                  <td align="left">
                  <ul>
                    <li>Device: <DropdownButton bsSize="xsmall" pullRight={true} onSelect={this.props.changeMidiDevice}
                    title={(this.props.currentMidiDevice === null) ? 'None' : this.props.currentMidiDevice}
                    id="midiDeviceDropdown" >
                    <MenuItem eventKey={0} key={0}>None</MenuItem>
                      {
                        _.map(this.props.midiDevices, (p, idx) => <MenuItem eventKey={idx + 1} key={idx + 1}>{p.replace(/([a-z](?=[A-Z]))/g, '$1 ')}</MenuItem>)
                      }
                    </DropdownButton></li>
                    <li>Channel: <DropdownButton bsSize="xsmall" pullRight={true} onSelect={this.props.changeMidiChannel}
                    title={this.props.currentMidiChannel}
                    id="midiChannelDropdown" >
                      <MenuItem eventKey={1} key={1}>1</MenuItem>
                      <MenuItem eventKey={2} key={2}>2</MenuItem>
                      <MenuItem eventKey={3} key={3}>3</MenuItem>
                      <MenuItem eventKey={4} key={4}>4</MenuItem>
                      <MenuItem eventKey={5} key={5}>5</MenuItem>
                      <MenuItem eventKey={6} key={6}>6</MenuItem>
                      <MenuItem eventKey={7} key={7}>7</MenuItem>
                      <MenuItem eventKey={8} key={8}>8</MenuItem>
                      <MenuItem eventKey={9} key={9}>9</MenuItem>
                      <MenuItem eventKey={10} key={10}>10</MenuItem>
                    </DropdownButton></li>
                    <li><Button id="midiTestButton" onClick={this.props.sendMidiTest} bsSize="xsmall">Send Test</Button></li>
                  </ul>
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

module.exports = IOMenu;
