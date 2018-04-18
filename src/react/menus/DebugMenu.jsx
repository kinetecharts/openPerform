import React from 'react';
import { Panel, FormGroup, FormControl } from 'react-bootstrap';

class DebugMenu extends React.Component {
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
  handleUploadImage(ev) {
    ev.preventDefault();

    const data = new FormData();
    data.append('file', ev.currentTarget.files[0]);

    fetch(window.location.protocol + '//' + window.location.hostname + ':8888/upload', {
      method: 'POST',
      body: data,
    }).then((response) => {
      response.json().then((body) => {
        this.props.fileUpload(body.file);
      });
    });
  }
  render() {
    return (
      <Panel className="debugMenu" /* defaultExpanded */>
        <Panel.Heading>
          <Panel.Title toggle><h5>Debug</h5></Panel.Title>
        </Panel.Heading>
        <Panel.Collapse>
          <Panel.Body className="debugBody">
            <div id="statsBox"></div>
            <FormGroup controlId={'formControlsFile'}>
              <FormControl id="formControlsFile"
                type="file"
                label="File"
                onChange={this.handleUploadImage.bind(this)}/>
            </FormGroup>
            {this.props.arGui}
          </Panel.Body>
        </Panel.Collapse>
      </Panel>
    );
  }
}

module.exports = DebugMenu;
