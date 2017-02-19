import React from 'react'
import _ from 'lodash'

var InputList = React.createClass({
	render() {
		return (
			<div className="inputList">
				<h5>Available Inputs</h5>
				<ul>{
					_.map(this.props.inputs, function(input, idx) {
						return <li key={idx}>{input.replace(/([a-z](?=[A-Z]))/g, '$1 ')}</li>;
					})
				}</ul>
			</div>
		);
	}
});

module.exports = InputList;