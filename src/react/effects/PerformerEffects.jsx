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
      return false;
    }
    return false;
  }
  render() {
    const popoverTop = (
     <Popover id="performer-effects-popover" title="Effect">
        <ListGroup>
          <ListGroupItem>
            <DropdownButton
              dropup
              bsStyle="default"
              bsSize="xsmall"
              title={this.props.effect}
              name="displayType"
              id="performer-effect-dropdown"
              onSelect={this.props.changeEffect}
              >
              <MenuItem key={0} eventKey={0}>none</MenuItem>
              {_.map(this.props.effects, (effect, idx) => {
                return (<MenuItem key={idx+1} eventKey={idx+1}>{effect}</MenuItem>);
              })}
            </DropdownButton>
            {this.props.gui}
          </ListGroupItem>
        </ListGroup>
      </Popover>
    );
    return (
      <OverlayTrigger
          trigger={['click', 'focus']}
          rootClose
          placement="top"
          overlay={popoverTop}
        >
        <Icon name="bolt" />
      </OverlayTrigger>
    );
  }
}

module.exports = PerformerEffects;
