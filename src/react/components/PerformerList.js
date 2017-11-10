import React from 'react'
import _ from 'lodash'
import Select from 'react-select';
 
import 'react-select/dist/react-select.css';

class PerformerList extends React.Component {
	constructor(props) {
		super(props);
		this.props = props;
		this.state = {
			playing:false,
			looping:true,
			type:"bvhMeshGroup",
			types: [
				{ value: 'bvhMeshGroup', label: 'Mesh Group' },
				{ value: 'riggedMesh', label: 'Rigged Model' }
			],
			style:"default"
		}
	}
	shouldComponentUpdate(nextProps, nextState) {
		if (this.props && this.state) {
			if (!_.isEqual(this.props, nextProps) || !_.isEqual(this.state, nextState)) {
				this.props = nextProps;
				return true;
			} else {
				return false;
			}
		}
		return false;
	}
	playPause(actions) {
		if (this.state.playing) {
			actions.pause();
			this.setState({playing:false});
		} else {
			actions.play();
			this.setState({playing:true});
		}
	}
	loopNoLoop(actions) {
		if (this.state.looping) {
			actions.noLoop();
			this.setState({looping:false});
		} else {
			actions.loop();
			this.setState({looping:true});
		}
	}
	stop(actions) {
		actions.stop();
		this.setState({playing:false});
	}
	changeType(performer, val) {
		this.setState({type:val.value});
		performer.setType(val.value);
	}
	changeStyle(performer, val) {
		this.setState({style:val.value});
		performer.updateStyle(val.value);
	}
	render() {
		if (this.props.performers.length==0) {
			return false;
		}
		// glyphicon glyphicon-play
		// glyphicon glyphicon-stop
		return (
			<div className="performerList">
				<h5>Active Performers</h5>
				<table id="performerTable"><tbody>{
					_.map(this.props.performers, (performer, idx) => {
						return <tr key={idx}>
							<td><span style={{color:performer.color}}>{performer.name}</span></td>
							<td><span>{performer.type}</span></td>
							<td><Select
								clearable={false}
								autoBlur={true}
								autofocus={false}
								searchable={false}
								backspaceRemoves={false}
								deleteRemoves={false}
								name="displayType"
								value={this.state.type}
								options={this.state.types}
								onChange={this.changeType.bind(this, performer)}
							/></td>
							<td><Select
								clearable={false}
								autoBlur={true}
								autofocus={false}
								searchable={false}
								backspaceRemoves={false}
								deleteRemoves={false}
								name="displayStyle"
								value={this.state.style}
								options={_.map(performer.styles, (s)=>{ return { value: s, label: s } })}
								onChange={this.changeStyle.bind(this, performer)}
							/></td>
							{ performer.actions !== null ? <td><table id="controlsTable"><tbody><tr><td><div className={"glyphicon " + ((this.state.playing)?" glyphicon-pause":" glyphicon-play")} onClick={this.playPause.bind(this, performer.actions)}></div></td>
							<td><div className="glyphicon glyphicon-stop" onClick={this.stop.bind(this, performer.actions)}></div></td>
							{/*<td><div className={"glyphicon " + ((this.state.looping)?" glyphicon-repeat":" glyphicon-ban-circle")} onClick={this.loopNoLoop.bind(this, performer.actions)}></div></td>*/}</tr></tbody></table></td>
							:null }
						</tr>;
					})
				}</tbody></table>
			</div>
		);
	}
};

module.exports = PerformerList;