import React from 'react';
import _ from 'lodash';

class InputList extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <div className="inputList">
        <h5>Available Inputs</h5>
        <ul>{
					_.map(this.props.inputs, (input, idx) => <li key={idx}>{input.replace(/([a-z](?=[A-Z]))/g, '$1 ')}</li>)
				}
        </ul>
      </div>
    );
  }
}

module.exports = InputList;
