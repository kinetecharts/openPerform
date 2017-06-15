/* This class interfaces with various input
methods and handles response data and
callbacks to the threejs environment.
The input list is defined in config/index.js*/

var THREE = require('three');
import _ from 'lodash'
import TWEEN from 'tween'

import config from './../config'

import Myo from './Myo'
import KinectTransport from './KinectTransport'
import KeyboardController from './KeyboardController'
import NeuroSky from './NeuroSky'
import PerceptionNeuron from './PerceptionNeuron'
import Gamepads from './Gamepads'

class InputManager {
	constructor(inputList, threeScene, parent) {
		this.inputs = {};
		this.scene = threeScene; //bridge to threejs environment 
		this.parent = parent; //bridge to react environment

		//connect all inputs in the input list
		_.forEach(inputList, this.connectInputs.bind(this)); //input list defined in config/index.js
	}

	connectInputs(type) {
		switch (type) { //input list defined in config/index.js
		case 'keyboard':
			this.inputs[type] = new KeyboardController();
			this.initKeyboardCallbacks();
			break;
		case 'kinecttransport':
			this.inputs[type] = new KinectTransport();
			this.initKinectTransportCallbacks();
			break;
		case 'myo':
			this.inputs[type] = new Myo();
			this.initMyoCallbacks();
			break;
		case 'neurosky':
			this.inputs[type] = new NeuroSky();
			this.initNeuroSkyCallbacks();
			break;
		case 'perceptionNeuron':
			this.inputs[type] = new PerceptionNeuron('ws://'+window.location.hostname+':' + config.perceptionNeuron.port);
			this.initPerceptionNeuronCallbacks();
			break;
		case 'gamepads':
			this.inputs[type] = new Gamepads('ws://'+window.location.hostname+':' + config.gamepads.ports.outgoing);
			break;
		};
	}

	registerCallback(input, event, label, callback) {
		if (this.inputs[input]) {
			this.inputs[input].on(event, callback, event, label);
		}
	}

	initPerceptionNeuronCallbacks() {
		this.registerCallback('perceptionNeuron', 'message', 'Perception Neuron', this.parent.updatePerformers.bind(this.parent));
	}

	initNeuroSkyCallbacks() { //https://github.com/elsehow/mindwave
		this.registerCallback('mindwave', 'data', 'Mindwave', function(data) { console.log(data); });
	}

	initMyoCallbacks() { //https://github.com/thalmiclabs/myo.js/blob/master/docs.md
		this.registerCallback('myo', 'imu', 'Myo', function(data) { console.log(data); });
	}

	initKinectTransportCallbacks() { //Reuires Kinect Transport app.
		/*https://github.com/stimulant/MS-Cube-SDK/tree/research/KinectTransport
		Returns either depth or bodies object.*/
		this.registerCallback('kinecttransport', 'depth', 'Kinect Depth', this.scene.viewKinectTransportDepth.bind(this.scene));
		this.registerCallback('kinecttransport', 'bodies', 'Kinect Body', this.scene.viewKinectTransportBodies.bind(this.scene));
	}

	initKeyboardCallbacks() { // Uses mousetrap: https://github.com/ccampbell/mousetrap
		this.registerCallback('keyboard', 'space', 'Show Overlay', this.parent.toggleOverlay);
		this.registerCallback('keyboard', 'f', 'Fullscreen', this.parent.toggleFullscreen);
		
		this.registerCallback('keyboard', '1', 'Island Theme', function() { this.switchEnvironment("island"); }.bind(this.scene));
		this.registerCallback('keyboard', '2', 'Dark Grid Theme', function() { this.switchEnvironment("grid-dark"); }.bind(this.scene));
		this.registerCallback('keyboard', '3', 'Light Grid Theme', function() { this.switchEnvironment("grid-light"); }.bind(this.scene));
		this.registerCallback('keyboard', '4', 'Gradient Theme', function() { this.switchEnvironment("gradient"); }.bind(this.scene));

		//Camera positions
		this.registerCallback('keyboard', 'r', 'Rotate Camera', this.scene.toggleRotation.bind(this.scene)); //enable / disable camera rotation

		this.registerCallback('keyboard', 'q', 'Fly Close', function() { //fly to close up shot
			if (this.camera.parent.type == "Scene") {
				this.cameraControl.fly_to(
					config.camera.closeShot.position,
					new THREE.Vector3(0,0,0),
					config.camera.closeShot.look,
					TWEEN.Easing.Quadratic.InOut,
					'path',
					3000,
					10,
					function(){ console.log("Camera moved!"); }
				);
			} else {
				console.log("Camera position not available in this mode.");
			}
		}.bind(this.scene));

		this.registerCallback('keyboard', 'w', 'Fly Medium', function() { //fly to medium shot
			if (this.camera.parent.type == "Scene") {
				this.cameraControl.fly_to(
					config.camera.mediumShot.position,
					new THREE.Vector3(0,0,0),
					config.camera.mediumShot.look,
					TWEEN.Easing.Quadratic.InOut,
					'path',
					3000,
					10,
					function(){ console.log("Camera moved!");}
				);
			} else {
				console.log("Camera position not available in this mode.");
			}
		}.bind(this.scene));

		this.registerCallback('keyboard', 'e', 'Fly Wide', function() { //fly to wide shot
			if (this.camera.parent.type == "Scene") {
				this.cameraControl.fly_to(
					config.camera.wideShot.position,
					new THREE.Vector3(0,0,0),
					config.camera.wideShot.look,
					TWEEN.Easing.Quadratic.InOut,
					'path',
					3000,
					10,
					function(){ console.log("Camera moved!"); }
				);
			} else {
				console.log("Camera position not available in this mode.");
			}
		}.bind(this.scene));

		this.registerCallback('keyboard', 'a', 'Cut Close', function() { //cut to close up shot
			if (this.camera.parent.type == "Scene") {
				this.cameraControl.jump(
					config.camera.closeShot.position,
					config.camera.closeShot.look
				);
			} else {
				console.log("Camera position not available in this mode.");
			}
		}.bind(this.scene));

		this.registerCallback('keyboard', 's', 'Cut Medium', function() { //cut to medium shot
			if (this.camera.parent.type == "Scene") {
				this.cameraControl.jump(
					config.camera.mediumShot.position,
					config.camera.mediumShot.look
				);
			} else {
				console.log("Camera position not available in this mode.");
			}
		}.bind(this.scene));

		this.registerCallback('keyboard', 'd', 'Cut Wide', function() { //cut to wide shot
			if (this.camera.parent.type == "Scene") {
				this.cameraControl.jump(
					config.camera.wideShot.position,
					config.camera.wideShot.look
				);
			} else {
				console.log("Camera position not available in this mode.");
			}
		}.bind(this.scene));

		this.registerCallback('keyboard', 'g', 'Snorry Cam', function() { //look at face
			if (this.scene.camera.parent.type == "Scene") {
				this.scene.cameraControl.changeParent(
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer['robot_head']
				);

				this.scene.cameraControl.jump(
					new THREE.Vector3(0, 5, 150),
					new THREE.Vector3(0, 5, 0),
				);
			} else {
				this.scene.cameraControl.changeParent(
					this.scene.scene
				);

				this.scene.cameraControl.jump(
					config.camera.mediumShot.position,
					config.camera.mediumShot.look
				);
			}
		}.bind(this));

		this.registerCallback('keyboard', 'f', 'First Person', function() { //first person view
			if (this.scene.camera.parent.type == "Scene") {
				this.scene.cameraControl.changeParent(
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer['robot_head']
				);

				this.scene.cameraControl.jump(
					new THREE.Vector3(0, 0, 1),
					new THREE.Vector3(0, 0, 2),
				);
			} else {
				this.scene.cameraControl.changeParent(
					this.scene.scene
				);

				this.scene.cameraControl.jump(
					config.camera.mediumShot.position,
					config.camera.mediumShot.look
				);
			}
		}.bind(this));

		this.registerCallback('keyboard', 't', 'Track Performer', function() { //follow x position of performer
			this.scene.cameraControl.track(
				this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer['robot_hips']
			);
		}.bind(this));

		this.registerCallback('keyboard', 'z', 'Env Input', function() { //toggle environment input
			this.scene.environments.toggle("usePerformerInput");
		}.bind(this));

		this.registerCallback('keyboard', 'esc', 'Show Keys', this.parent.openKeyboardHelp.bind(this.parent));

	}
}

module.exports = InputManager;