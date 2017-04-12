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
		this.visible = true;

		console.log("New Performer: ", this.inputId);

		this.loadSceneBody('./models/json/avatar.json');

		this.gui = new dat.GUI();
		this.guiDOM = this.gui.domElement;
		this.guiFolder = this.gui.addFolder(this.name + ' Effects');
		this.guiFolder.open()

		this.performerEffects = new PerformerEffects(this.parent, parseInt(this.color, 16), this.guiFolder);
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
					if (!this.performer) {
						this.performer = {};
						this.performerKeys = {};
					}
					this.performer[object.name.toLowerCase()] = object;
					this.performerKeys[object.name.toLowerCase()] = object.name.toLowerCase();

					object.castShadow = true;
					object.receiveShadow = true;
					object.visible = this.visible;
				} else {
					if(object.hasOwnProperty("material")){ 
						object.material = new THREE.MeshPhongMaterial();
						object.material.wireframe = this.showWireframe;
						object.material.color.set(parseInt(this.color,16));
						object.material.needsUpdate = true;
					}
				}
			}.bind(this) );
			
			this.performerKeys= Common.getKeys(this.performerKeys, "");
			this.parent.add(result.scene);
		}.bind(this) );
	}

	update(data) {
		switch(this.type) {
			case 'perceptionNeuron':
				this.updateFromPN(data);
			break;
		}

		this.performerEffects.update(this.performer);
	}

	updateFromPN(data) {
		for (var i=0; i<data.length; i++) {
			var jointName = "robot_" + data[i].name;
			if (this.performer[jointName]) {
				this.performer[jointName].position.set(
					data[i].position.x,
					data[i].position.y,
					data[i].position.z
				);

				this.performer[jointName].quaternion.copy(data[i].quaternion);
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