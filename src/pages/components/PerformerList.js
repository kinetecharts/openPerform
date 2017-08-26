import React from 'react'
import _ from 'lodash'

class PerformerList extends React.Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	render() {
		return (
			<div className="performerList">
				<h5>Active Performers</h5>
				<ul>{
					_.map(this.props.performers, function(performer, idx) {
						return <li key={idx}>{performer.name.replace(/([a-z](?=[A-Z]))/g, '$1 ')}<div className="performerColor" style={{backgroundColor:performer.color}}></div></li>;
					})
				}</ul>
			</div>
		);
	}
};

module.exports = PerformerList;