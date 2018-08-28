/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 01:47:30
 * @modify date 2018-08-26 01:47:30
 * @desc [Menu to select on which performer part effects are attached.]
*/

import React from 'react';
import { ToggleButtonGroup, ToggleButton } from 'react-bootstrap';

class RibbonsMenu extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  render() {
    return (
      <ToggleButtonGroup id="performerParts" onChange={this.props.updateParts.bind(this)} type="checkbox" name="options" defaultValue={this.props.currentTargets}>
        {_.map(this.props.possibleTargets, (t, idx) => {
          return (<ToggleButton id={t + '_button'} bsSize="xsmall" key={idx} value={t}></ToggleButton>);
        })}
      </ToggleButtonGroup>
    );
  }
}

module.exports = RibbonsMenu;
