var THREE = require('three');

import config from './../../server/config.js'

var defaults = {
	debug: false, //shows bvh playback
	scene:null,
	camera: {
		closeShot: {
			position: new THREE.Vector3(0,1.5,5),
			look: new THREE.Vector3(0,1.5,0)
		},
		mediumShot: {
			position: new THREE.Vector3(0,1.5,10),
			look: new THREE.Vector3(0,1.5,0)
		},
		wideShot: {
			position: new THREE.Vector3(0,1.5,20),
			look: new THREE.Vector3(0,1.5,0)
		}
	},
	stats: true,
	keyboardHelp: false,
	inputs:['keyboard', 'mouse', 'perceptionNeuron', 'midiController'], //keyboard, kinecttransport, myo, neurosky, perceptionNeuron, gamepads, midiController
	performers:[],
	performerColors: ['FFFFFF', 'CB2402', 'F0F7FA', '5992AE', 'FF009B'],
	// performerColors: ['FF0000', '00FF00', '0000FF'],
	myo:null,
	kinectTransport:{
		port:config.inputs.kinectTransport.ports.outgoing
	},
	perceptionNeuron:{
		port:config.inputs.perceptionNeuron.ports.outgoing
	},
	gamepads:{
		ports: {
			incoming: config.inputs.gamepads.ports.incoming,
			outgoing: config.inputs.gamepads.ports.outgoing
		}
	},
	midiController:{
		ports: {
			incoming: config.inputs.midiController.ports.incoming,
			outgoing: config.inputs.midiController.ports.outgoing
		}
	},
	data: []
};

module.exports = defaults;
