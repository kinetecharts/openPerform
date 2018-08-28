import React from 'react';
import ReactDOM from 'react-dom';
import { Popover, ListGroup, ListGroupItem, OverlayTrigger, Table, DropdownButton, MenuItem } from 'react-bootstrap';

import Icon from 'react-fa';

class PerformerEffects extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
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
    }

    if (!_.isEqual(this.props.gui, nextProps.gui)) {
      return true;
    }

    return false;
  }
  renderPopOver() {
    return (<Popover id="performer-effects-popover" title="Effect">
      <ListGroup>
        <ListGroupItem id="performer-effects-dropdown">
          <DropdownButton
            dropup
            bsStyle="default"
            bsSize="xsmall"
            title={this.props.effect}
            name="displayType"
            id="performer-effect-dropdown"
            onSelect={this.props.changeEffect}
            >
            <MenuItem key={0} eventKey={0}>No Effect</MenuItem>
            {_.map(this.props.effects, (effect, idx) => {
              return (<MenuItem key={idx+1} eventKey={idx+1}>{effect}</MenuItem>);
            })}
          </DropdownButton>
        </ListGroupItem>
        <ListGroupItem>
          {this.props.gui}
        </ListGroupItem>
      </ListGroup>
    </Popover>);
  }
  render() {
    return (
      <OverlayTrigger
          trigger={['click', 'focus']}
          rootClose
          placement="top"
          onClick={this.props.clickOverTrigger}
          overlay={this.renderPopOver()}
        >
        <Icon id="effectsIcon" name="bolt" />
      </OverlayTrigger>
    );
  }
}

module.exports = PerformerEffects;
