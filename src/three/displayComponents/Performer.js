//Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js

var THREE = require('three');
var bvhLoader = require('./../../libs/three/loaders/BVHLoader.js');
var sceneLoader = require('./../../libs/three/loaders/SceneLoader.js');
import Common from './../../util/Common'

import PerformerEffects from './../../effects/performer'

import _ from 'lodash'
import dat from 'dat-gui'

class Performer {
	constructor(parent, inputId, performerId, type, color) {
		this.parent = parent;
		this.inputId = inputId;
		this.type = type;
		this.name = "Performer " + performerId;
		this.color = color;
		this.showWireframe = true;

		console.log("New Performer: ", this.inputId);

		this.loadSceneBody('./models/json/avatar.json');

		this.gui = new dat.GUI();
		this.guiFolder = this.gui.addFolder(this.name);

		this.performerEffects = new PerformerEffects(this.parent, this.color, this.guiFolder);
		this.addEffect();
	}

	loadSceneBody(filename) {
		var loader = new THREE.SceneLoader();
		
		loader.callbackProgress = function( progress, result ) {
			console.log(progress);
		};
		loader.load( filename, function ( result ) {
			result.scene.traverse( function ( object ) {
				if ( object.name.toLowerCase().match(/robot_/g)) {
					if (!this.robot) {
						this.robot = {};
						this.robotKeys = {};
					}
					this.robot[object.name.toLowerCase()] = object;
					this.robotKeys[object.name.toLowerCase()] = object.name.toLowerCase();

					object.castShadow = true;
					object.receiveShadow = true;
				} else {
					if(object.hasOwnProperty("material")){ 
						object.material = new THREE.MeshPhongMaterial();
						object.material.wireframe = this.showWireframe;
						object.material.color.set(this.color);
						object.material.needsUpdate = true;
					}
				}
			}.bind(this) );
			
			this.robotKeys= Common.getKeys(this.robotKeys, "");
			this.parent.add(result.scene);
		}.bind(this) );
	}

	update(data) {
		switch(this.type) {
			case 'perceptionNeuron':
				this.updateFromPN(data);
			break;
		}

		this.performerEffects.update(data);
	}

	updateFromPN(data) {
		for (var i=0; i<data.length; i++) {
			var jointName = "robot_" + data[i].name;
			if (this.robot[jointName]) {
				this.robot[jointName].position.set(
					data[i].position.x,
					data[i].position.y,
					data[i].position.z
				);

				this.robot[jointName].quaternion.copy(data[i].quaternion);
			}
		}
	}

	addEffect(effect) {
		switch(effect) {
			default:
				this.performerEffects.add("pointCloudJoints");
			break;
		}
	}
}

module.exports = Performer;