import React from 'react';
import { Panel, MenuItem, DropdownButton, Button } from 'react-bootstrap';

class MidiMenu extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
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

  render() {
    return (
      <Panel className="midiMenu" defaultExpanded>
        <Panel.Heading>
					<Panel.Title toggle><h5>Midi Output</h5></Panel.Title>
				</Panel.Heading>
        <Panel.Collapse>
						<Panel.Body>
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
                <li><Button id="midiTestButton" onClick={this.props.sendMidiTest} bsSize="xsmall">Test Output</Button></li>
              </ul>
						</Panel.Body>
					</Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = MidiMenu;
