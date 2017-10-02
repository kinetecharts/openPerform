import React from 'react'
import $ from 'jquery'
var _ = require('lodash').mixin(require('lodash-keyarrange'));

import InputList from './../components/InputList'
import PerformerList from './../components/PerformerList'
import KeyboardHelpModal from './../components/KeyboardHelpModal'

import Common from './../../util/Common'

import Scene from './../../three/scene'
import InputManager from './../../inputs'

import Performers from './../../performers/Performers'

import BVHPlayer from './../../performers/BVHPlayer'

import config from '../../config'

class Main extends React.Component {
	constructor(props) {
		super(props);
		this.state = config;
		this.BVHPlayers = [];
	}

	componentWillMount() {
		//initialize the threejs scene class
		this.setState({
			scene: new Scene(),
		});
	}

	componentDidMount() {
		//coordinate input data and callbacks. Add / remove inputs in src/config/index.js (Includes keyboard and mouse control)
		this.setState({
			inputManger: new InputManager(this.state.inputs, this.state.scene, this)
		});

		this.performers = new Performers();

		//once the dom has mounted, initialize threejs
		this.state.scene.initScene(this.state.home.target, this.state.inputs, this.state.stats, this.performers);
		
		this.performers.init(this.state.scene.scene);

		if (this.state.debug) {
			this.BVHPlayer = this.addBVHPerformer("models/bvh/cloverChar00.bvh");
		}
	}

	addBVHPerformer(modelPath) {
		var bvhPlayer = new BVHPlayer(modelPath, this.state.scene.scene, this.updatePerformers.bind(this));
		this.BVHPlayers.push(bvhPlayer);
		return bvhPlayer;
	}

	toggleGUI() { //toggle loading overlay visablity
		if ($('#lowerDisplay').css('display') == 'none') {
			$('#lowerDisplay').fadeIn(1000);
			$('.dg.ac').fadeIn(1000);
		} else {
			$('#lowerDisplay').fadeOut(1000);
			$('.dg.ac').fadeOut(1000);
		}
	}

	toggleStartOverlay() { //toggle start overlay visablity
		if ($('#startOverlay').css('display') == 'none' ) {
			if (!$("#startOverlay:animated").length) {
				$('#startOverlay').fadeIn(1000);
			}
		} else {
			if (!$("#startOverlay:animated").length) {
				$('#startOverlay').fadeOut(1000);
			}
		}
	}

	toggleBlackOverlay() { //toggle black overlay visablity
		if ($('#blackOverlay').css('display') == 'none' ) {
			if (!$("#blackOverlay:animated").length) {
				$('#blackOverlay').fadeIn(1000);
			}
		} else {
			if (!$("#blackOverlay:animated").length) {
				$('#blackOverlay').fadeOut(1000);
			}
		}
	}

	toggleEndOverlay() { //toggle end overlay visablity
		if ($('#endOverlay').css('display') == 'none' ) {
			if (!$("#endOverlay:animated").length) {
				$('#endOverlay').fadeIn(1000);
			}
		} else {
			if (!$("#endOverlay:animated").length) {
				$('#endOverlay').fadeOut(1000);
			}
		}
	}

	toggleFullscreen() { //toggle fullscreen window
		if (!document.fullscreenElement &&    // alternative standard method
			!document.mozFullScreenElement && !document.webkitFullscreenElement && !document.msFullscreenElement ) {  // current working methods
				this.enterFullscreen();
		} else {
			this.exitFullscreen();
		}
	}

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
	}

	exitFullscreen() {
		if(document.exitFullscreen) {
			document.exitFullscreen();
		} else if(document.mozCancelFullScreen) {
			document.mozCancelFullScreen();
		} else if(document.webkitExitFullscreen) {
			document.webkitExitFullscreen();
		}
	}

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
	}

	openKeyboardHelp() {
		if (this.state.keyboardHelp == false) {
			this.setState({
				keyboardHelp: true
			});
		}
	}

	closeKeyboardHelp() {
		if (this.state.keyboardHelp == true) {
			this.setState({
				keyboardHelp: false
			});
		}
	}

	render() {
		return (
			<div className="container-fluid" id="page">
				<div id="scenes"></div>
				<div id="lowerDisplay">
					<InputList inputs={this.state.inputs}></InputList>
					<PerformerList performers={this.state.performers}></PerformerList>
					<div id="statsBox"><h5>Stats</h5></div>
					<div id="vrButton"></div>
				</div>
				<div id="startOverlay">
				</div>
				<div id="blackOverlay">
				</div>
				<div id="endOverlay">
				</div>
				<KeyboardHelpModal show={this.state.keyboardHelp} closeKeyboardHelp={this.closeKeyboardHelp.bind(this)} keyboardList={(this.state.inputManger)?this.state.inputManger.inputs['keyboard']:{}}></KeyboardHelpModal>
			</div>
		);
	}
}

module.exports = Main;