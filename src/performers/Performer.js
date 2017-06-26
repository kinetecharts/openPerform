//Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js

var THREE = require('three');
var bvhLoader = require('./../libs/three/loaders/BVHLoader.js');
var sceneLoader = require('./../libs/three/loaders/SceneLoader.js');
import Common from './../util/Common'

import PerformerEffects from './../effects/performer'
import Trail from './../libs/trail'

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

		this.scene = null;
		this.modelShrink = 100;
		this.loadSceneBody('./models/json/avatar.json');

		this.gui = new dat.GUI();
		this.guiDOM = this.gui.domElement;
		this.guiFolder = this.gui.addFolder(this.name + ' Effects');
		this.guiFolder.open()

		this.performerEffects = new PerformerEffects(this.parent, parseInt(this.color, 16), this.guiFolder);
		//this.addEffects(['cloner']);

        this.lastTrailUpdateTime = performance.now();
		this.addTrail();
	}

	addTrail(){
        // specify points to create planar trail-head geometry

        var circlePoints = [];
        var twoPI = Math.PI * 2;
        var index = 10;
        var scale = 5;
        var inc = twoPI / 32.0;

        for ( var i = 0; i <= twoPI + inc; i+= inc )  {

            var vector = new THREE.Vector3();
            vector.set( Math.cos( i ) * scale, Math.sin( i ) * scale, 0 );
            circlePoints[ index ] = vector;
            index ++;

        }
        var trailHeadGeometry = circlePoints;

// create the trail renderer object
        var trail = new THREE.TrailRenderer( this.parent, false );

// create material for the trail renderer
        var trailMaterial = THREE.TrailRenderer.createBaseMaterial();

// specify length of trail
        var trailLength = 20;

// initialize the trail
        var options = {
            headRed : 1.0,
            headGreen : 0.0,
            headBlue : 0.0,
            headAlpha : 0.75,

            tailRed : 0.0,
            tailGreen : 1.0,
            tailBlue : 1.0,
            tailAlpha : 0.35,
		};

        trailMaterial.uniforms.headColor.value.set( options.headRed, options.headGreen, options.headBlue, options.headAlpha );
        trailMaterial.uniforms.tailColor.value.set( options.tailRed, options.tailGreen, options.tailBlue, options.tailAlpha );


        trail.initialize( trailMaterial, trailLength, false, 0, trailHeadGeometry, this.performer['robot_lefthand'] );
		this.trail = trail;
        this.trail.activate();
	}

	loadSceneBody(filename) {
		var loader = new THREE.SceneLoader();
		
		loader.callbackProgress = function( progress, result ) {
			console.log(progress);
		};
		loader.load( filename, function ( result ) {
			this.scene = result.scene;
			this.scene.scale.set(1/this.modelShrink,1/this.modelShrink,1/this.modelShrink);

			this.scene.traverse( function ( object ) {
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
			
			this.parent.add(this.scene);

		}.bind(this) );
	}

	updateParameters(data) {
		switch(data.parameter) {
    		case 'rate':
    			this.performerEffects.updateParameters(data);
    			break;
    		case 'life':
				this.performerEffects.updateParameters(data);
    			break;
    	}
	}

	update(data) {
		switch(this.type) {
			case 'perceptionNeuron':
				this.updateFromPN(data);
			break;
		}


		if (this.trail) {
			//console.log(this.trail);
			var time = performance.now();

            if ( time - this.lastTrailUpdateTime > 50 ) {

                this.trail.advance();
                this.lastTrailUpdateTime = time;

            } else {

                this.trail.updateHead();

            }
		}

		this.performerEffects.update(this.scene);
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

	addEffects(effects) {
		_.each(effects, (effect) => {
			this.addEffect(effect);
		});
	}

	addEffect(effect) {
		switch(effect) {
			case 'cloner':
				this.performerEffects.add("cloner");
			break;
			case 'particleSystem':
				this.performerEffects.add("particleSystem");
			break;
		}
	}

	getScene() {
		return this.scene;
	}

	toggleWireframe() {
		this.showWireframe = !this.showWireframe;
		_.each(this.performer, (parent) => {
			parent.traverse( ( object ) => {
				if(object.hasOwnProperty("material")){ 
					object.material.wireframe = this.showWireframe;
				}
			});
		});
	}

	distanceBetween(part1, part2) {
		var part1 = this.performer["robot_" + part1]; //find first body part by name
		var part2 = this.performer["robot_" + part2]; //find second body part by name
		if (part1 && part2) { //do they both exist?
			var joint1Global = new THREE.Vector3().setFromMatrixPosition( part1.matrixWorld );//we need the global position
			var joint2Global = new THREE.Vector3().setFromMatrixPosition( part2.matrixWorld );//we need the global position
			return joint1Global.distanceTo(joint2Global);//how far apart are they?
		}
		return 0;
	}
}

module.exports = Performer;