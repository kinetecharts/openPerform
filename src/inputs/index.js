/* This class interfaces with various input
methods and handles response data and
callbacks to the threejs environment.
The input list is defined in config/index.js*/

var THREE = require('three');
import _ from 'lodash'
import TWEEN from 'tween'

import config from './../config'

import Common from './../util/Common'

import Myo from './Myo'
import MidiController from './MidiController'
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
		case 'midiController':
			this.inputs[type] = new MidiController('ws://'+window.location.hostname+':' + config.midiController.ports.outgoing);
			this.initMidiControllerCallbacks();
			break;
		};
	}

	registerCallback(input, event, label, callback) {
		if (this.inputs[input]) {
			this.inputs[input].on(event, callback, event, label);
		}
	}

	initMidiControllerCallbacks() {
		this.registerCallback('midiController', 'message', 'Midi Controller', function(data) {
			switch (data.name) {

				case 'track left': // scene 1
					break;
				case 'track right': // scene 2
					break;
				case 'marker set': // start overlay
					this.parent.toggleStartOverlay();
					break;
				case 'marker left': // black overlay
					this.parent.toggleBlackOverlay();
					break;
				case 'marker right': // end overlay
					this.parent.toggleEndOverlay();
					break;



				case 'knob 1':
					// this.scene.controls.rotateLeft();
					// this.scene.controls.sphericalDelta.theta = Common.mapRange(data.value, 0, 127, 0, Math.PI);
					break;

				case 'slider 1':
					// this.scene.controls.sphericalDelta.phi = Common.mapRange(data.value, 0, 127, 0, -Math.PI);
					break;

				case 'solo 6':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].addEffects(["trails"])
					break;

				case 'record 6':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].removeEffects(["trails"])
					break;

				case 'solo 7':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].addEffects(["cloner"])
					break;

				case 'record 7':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].removeEffects(["cloner"])
					break;

				case 'solo 8':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].addEffects(["particleSystem"])
					break;

				case 'record 8':
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].removeEffects(["particleSystem"])
					break;
				// case 'slider 1':
				// 	data.parameter = "lines"
				// 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// 	this.scene.environments.updateParameters(data);
				// 	break;
				// case 'knob 1':
				// 	data.parameter = "size"
				// 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// 	this.scene.environments.updateParameters(data);
				// 	break;
				case 'slider 1':
					data.parameter = "life"
					data.value = Common.mapRange(data.value, 0, 127, 0, 1);
					this.parent.performers.updateParameters(data);
					break;
				case 'knob 1':
					data.parameter = "rate"
					data.value = Common.mapRange(data.value, 0, 127, 0, 1);
					this.parent.performers.updateParameters(data);
					break;

				// case 'knob 3':
				// 	data.parameter = "size"
				// 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// 	this.parent.performers.updateParameters(data);
				// 	break;
				// case 'slider 3':
				// 	data.parameter = "color"
				// 	data.value = Common.mapRange(data.value, 0, 127, 0, 1);
				// 	this.parent.performers.updateParameters(data);
				// 	break;
			}
		}.bind(this));
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
		this.registerCallback('keyboard', 'space', 'Show Overlay', this.parent.toggleStartOverlay.bind(this.parent));

		this.registerCallback('keyboard', '-', 'Hide GUI', this.parent.toggleGUI.bind(this.parent));
		this.registerCallback('keyboard', '=', 'Fullscreen', this.parent.toggleFullscreen.bind(this.parent));
		
		
		this.registerCallback('keyboard', '1', 'Dark Grid Theme', function() { this.switchEnvironment("grid-dark"); }.bind(this.scene));
		this.registerCallback('keyboard', '2', 'Water Theme', function() { this.switchEnvironment("water"); }.bind(this.scene));
		this.registerCallback('keyboard', '3', 'Light Grid Theme', function() { this.switchEnvironment("grid-light"); }.bind(this.scene));
		this.registerCallback('keyboard', '4', 'Gradient Theme', function() { this.switchEnvironment("gradient"); }.bind(this.scene));
		this.registerCallback('keyboard', '5', 'Island Theme', function() { this.switchEnvironment("island"); }.bind(this.scene));

		//Camera positions
		this.registerCallback('keyboard', 'r', 'Rotate Camera', this.scene.toggleRotation.bind(this.scene)); //enable / disable camera rotation

		this.registerCallback('keyboard', 'q', 'Fly Close', function() { //fly to close up shot
			if (this.camera.parent.type !== "Scene") {
				this.cameraControl.changeParent(
					this.scene
				);
			}
			this.cameraControl.fly_to(
				config.camera.closeShot.position,
				new THREE.Vector3(0,0,0),
				config.camera.closeShot.look,
				TWEEN.Easing.Quadratic.InOut,
				'path',
				3000,
				1,
				function(){ console.log("Camera moved!"); }
			);
		}.bind(this.scene));

		this.registerCallback('keyboard', 'w', 'Fly Medium', function() { //fly to medium shot
			if (this.camera.parent.type !== "Scene") {
				this.cameraControl.changeParent(
					this.scene
				);
			}
			this.cameraControl.fly_to(
				config.camera.mediumShot.position,
				new THREE.Vector3(0,0,0),
				config.camera.mediumShot.look,
				TWEEN.Easing.Quadratic.InOut,
				'path',
				3000,
				1,
				function(){ console.log("Camera moved!");}
			);
		}.bind(this.scene));

		this.registerCallback('keyboard', 'e', 'Fly Wide', function() { //fly to wide shot
			if (this.camera.parent.type !== "Scene") {
				this.cameraControl.changeParent(
					this.scene
				);
			}
			this.cameraControl.fly_to(
				config.camera.wideShot.position,
				new THREE.Vector3(0,0,0),
				config.camera.wideShot.look,
				TWEEN.Easing.Quadratic.InOut,
				'path',
				3000,
				1,
				function(){ console.log("Camera moved!"); }
			);
		}.bind(this.scene));

		this.registerCallback('keyboard', 'a', 'Cut Close', function() { //cut to close up shot
			if (this.camera.parent.type !== "Scene") {
				this.cameraControl.changeParent(
					this.scene
				);
			}
			this.cameraControl.jump(
				config.camera.closeShot.position,
				config.camera.closeShot.look
			);
		}.bind(this.scene));

		this.registerCallback('keyboard', 's', 'Cut Medium', function() { //cut to medium shot
			if (this.camera.parent.type !== "Scene") {
				this.cameraControl.changeParent(
					this.scene
				);
			}
			this.cameraControl.jump(
				config.camera.mediumShot.position,
				config.camera.mediumShot.look
			);
		}.bind(this.scene));

		this.registerCallback('keyboard', 'd', 'Cut Wide', function() { //cut to wide shot
			if (this.camera.parent.type !== "Scene") {
				this.cameraControl.changeParent(
					this.scene
				);
			}
			this.cameraControl.jump(
				config.camera.wideShot.position,
				config.camera.wideShot.look
			);
		}.bind(this.scene));

		this.registerCallback('keyboard', 'g', 'Snorry Cam', function() { //look at face
			if (this.scene.camera.parent.type == "Scene") {
				this.scene.cameraControl.changeParent(
					this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].performer['robot_spine3']
				);

				this.scene.cameraControl.jump(
					new THREE.Vector3(0, 15, 150),
					new THREE.Vector3(0, 15, 0),
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

		this.registerCallback('keyboard', 'y', 'Track Performer', function() { //follow x position of performer
			if (this.camera.parent.type !== "Scene") {
				this.cameraControl.changeParent(
					this.scene
				);
			}
			this.cameraControl.fly_to(
				new THREE.Vector3(0,10,0),
				new THREE.Vector3(0,0,0),
				new THREE.Vector3(0,0,0),
				TWEEN.Easing.Quadratic.InOut,
				'path',
				3000,
				1,
				function(){ console.log("Camera moved!");}
			);
		}.bind(this.scene));

		this.registerCallback('keyboard', 'z', 'Env Input', function() { //toggle environment input
			this.scene.environments.toggle("usePerformerInput");
		}.bind(this));

		this.registerCallback('keyboard', 'x', 'Toggle Wireframe', function() { //toggle environment input
			this.parent.performers.performers[Object.keys(this.parent.performers.performers)[0]].toggleWireframe();
		}.bind(this));

		this.registerCallback('keyboard', 'esc', 'Show Keys', this.parent.openKeyboardHelp.bind(this.parent));

	}
}

module.exports = InputManager;