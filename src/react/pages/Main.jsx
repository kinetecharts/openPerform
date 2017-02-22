import React from 'react'
import $ from 'jquery'
var _ = require('lodash').mixin(require('lodash-keyarrange'));

import InputList from './../components/InputList'
import PerformerList from './../components/PerformerList'

import Common from './../../util/Common'

import Scene from './../../three/scene'
import InputManager from './../../inputs'

import Performers from './../../three/displayComponents/Performers'

import config from '../../config'


var Main = React.createClass({
	getInitialState() {
		//load initial state from config file
		return (config);
	},

	componentWillMount() {
		//initialize the threejs scene class
		this.setState({
			scene: new Scene(),
		});
	},

	componentDidMount() {
		//coordinate input data and callbacks. Add / remove inputs in src/config/index.js (Includes keyboard and mouse control)
		this.setState({
			inputManger: new InputManager(this.state.inputs, this.state.scene, this)
		});

		//once the dom has mounted, initialize threejs
		this.state.scene.initScene(this.state.home.target, this.state.home.zoom, this.state.inputs, this.state.stats);
		
		this.performers = new Performers(this.state.scene.scene);

		//fade out loading overlay
		setTimeout(function(){
			this.toggleOverlay();
		}.bind(this), 3000);
	},

	toggleOverlay() { //toggle loading overlay visablity
		if ($('#loadingOverlay').css('display') == 'none') {
			$('#loadingOverlay').fadeIn(1000);
		} else {
			$('#loadingOverlay').fadeOut(1000);
		}
	},

	toggleFullscreen() { //toggle fullscreen window
		if (document.fullScreenEnabled) {
			this.exitFullscreen();
		} else {
			this.enterFullscreen();
		}
	},

	enterFullscreen() {
		var element = document.documentElement;
		if(element.requestFullscreen) {
			element.requestFullscreen();
		} else if(element.mozRequestFullScreen) {
			element.mozRequestFullScreen();
		} else if(element.webkitRequestFullscreen) {
			element.webkitRequestFullscreen();
		} else if(element.msRequestFullscreen) {
			element.msRequestFullscreen();
		}
	},

	exitFullscreen() {
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	},

	updatePerformers(id, data, type) {
		if (this.performers) {
			if(!this.performers.exists(id)) {
				this.performers.add(id, type);
			}
			else {
				this.performers.update(id, data);
			}

			this.setState({
				performers: this.performers.getPerformers()
			});
		}
	},

	render() {
		return (
			<div className="container-fluid" id="page">
				<div id="scenes"></div>
				<div id="lowerDisplay">
					<InputList inputs={this.state.inputs}></InputList>
					<PerformerList performers={this.state.performers}></PerformerList>
					<div id="statsBox"><h5>Stats</h5></div>
				</div>
				<div id="loadingOverlay">
					<div id="loadingIcon">
						<div id="worldDiv"><img src="./images/world.gif" width="100%" height="auto"/></div>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = Main;