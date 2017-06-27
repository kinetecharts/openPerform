import _ from 'lodash'
var THREE = require('three');

import Trail from './../../libs/trail'

import config from './../../config'

class Trails {
	constructor(parent, color, guiFolder) {
		this.parent = parent;
		// this.systems = [];
		this.color = color;
		this.guiFolder = guiFolder;
		this.targets = [/*"hips",
		"rightupleg", "rightleg",*/ "rightfoot",
		/*"leftupleg", "leftleg",*/ "leftfoot",
		/*"spine", "spine3",*/ "head",
		/*"rightarm", "rightforearm",*/ "righthand",
		/*"leftarm", "leftforearm", */"lefthand"
		];

		// specify points to create planar trail-head geometry

        this.circlePoints = [];
        this.twoPI = Math.PI * 2;
        this.index = 10;
        this.scale = 5;
        this.inc = this.twoPI / 32.0;

        for ( var i = 0; i <= this.twoPI + this.inc; i+= this.inc )  {

            this.vector = new THREE.Vector3();
            this.vector.set( Math.cos( i ) * this.scale, Math.sin( i ) * this.scale, 0 );
            this.circlePoints[ this.index ] = this.vector;
            this.index ++;

        }
        this.trailHeadGeometry = this.circlePoints;

		this.trails = [];

		// initialize the trail
        this.options = {
        	trailLength : 20,
            headRed : 1.0,
            headGreen : 0.0,
            headBlue : 0.0,
            headAlpha : 0.75,

            tailRed : 0.0,
            tailGreen : 1.0,
            tailBlue : 1.0,
            tailAlpha : 0.35,
		};

		// options passed during each spawned
		// this.options = {
		// 	positionRandomness: 0.05,
		// 	velocity: new THREE.Vector3(),
		// 	velocityRandomness: 0.05,
		// 	color: this.color,
		// 	colorRandomness: 0.01,
		// 	turbulence: 0,
		// 	lifetime: 1,
		// 	size: 15,
		// 	sizeRandomness: 15,
		// 	position: new THREE.Vector3()
		// };
		// this.spawnerOptions = {
		// 	spawnRate: 400,
		// 	horizontalSpeed: 1.0,
		// 	verticalSpeed: 2.0,
		// 	timeScale: 1
		// };

		// this.addToDatGui(this.options, this.spawnerOptions, this.guiFolder);
	}

	addToDatGui(options, spawnerOptions, guiFolder) {
		var f = guiFolder.addFolder("Trails");
		f.add(options, "velocityRandomness", 0, 30).listen();
		f.add(options, "positionRandomness", 0, 30).listen();
		f.add(options, "size", 1, 200).listen();
		f.add(options, "sizeRandomness", 0, 250).listen();
		f.add(options, "colorRandomness", 0, 10).listen();
		f.add(options, "lifetime", .1, 100).listen();
		f.add(options, "turbulence", 0, 10).listen();
		f.add(spawnerOptions, "spawnRate", 10, 3000).listen();
		f.add(spawnerOptions, "timeScale", -2, 2).listen();
	}

	addTrail(parent, part, options){
		// create the trail renderer object
        var trail = new THREE.TrailRenderer( parent, false );

		// create material for the trail renderer
        var trailMaterial = THREE.TrailRenderer.createBaseMaterial();

        trailMaterial.uniforms.headColor.value.set( options.headRed, options.headGreen, options.headBlue, options.headAlpha );
        trailMaterial.uniforms.tailColor.value.set( options.tailRed, options.tailGreen, options.tailBlue, options.tailAlpha );


        trail.initialize( trailMaterial, options.trailLength, false, 0, this.trailHeadGeometry, part );
		trail.activate();

		return trail;
	}

	updateParameters(data) {
		switch(data.parameter) {
    		case 'life':
    			this.options.lifetime = data.value*100;
    			break;
    		case 'rate':
				this.spawnerOptions.spawnRate = data.value*3000;
				break;
			case 'size':
				this.options.size = data.value*200;
				break;
			case 'color':
				this.options.colorRandomness = data.value*10;
				break;
    	}
	}

	update(data) {
		var idx = 0;
		data.traverse( function ( d ) {
			if (_.filter(this.targets,function(t){return "robot_"+t == d.name.toLowerCase();}).length>0) {
				if (!this.trails[idx]) {
					this.trails[idx] = this.addTrail(this.parent, d, this.options);
					this.trails[idx].lastTrailUpdateTime = performance.now();
				}

				if (this.trails[idx]) {
					var time = performance.now();
		            if ( time - this.trails[idx].lastTrailUpdateTime > 50 ) {
		                this.trails[idx].advance();
		                this.trails[idx].lastTrailUpdateTime = time;
		            } else {
		                this.trails[idx].updateHead();
		            }
		        }
		        idx++;
			}
		}.bind(this));
	}
}

module.exports = Trails;