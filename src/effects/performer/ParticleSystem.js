import _ from 'lodash'
var THREE = require('three');
var GPUParticleSystem = require('./../../libs/three/GPUParticleSystem');

import config from './../../config'

class ParticleSystem {
	constructor(parent, color, guiFolder) {
		this.parent = parent;
		this.systems = [];
		this.color = color;
		this.guiFolder = guiFolder;
		this.targets = [/*"hips",
		"rightupleg", "rightleg",*/ "rightfoot",
		/*"leftupleg", "leftleg",*/ "leftfoot",
		/*"spine", "spine3",*/ "head",
		/*"rightarm", "rightforearm",*/ "righthand",
		/*"leftarm", "leftforearm", */"lefthand"
		];

		// options passed during each spawned
		this.options = {
			positionRandomness: 5,
			velocity: new THREE.Vector3(),
			velocityRandomness: 5,
			color: this.color,
			colorRandomness: 1,
			turbulence: 0,
			lifetime: 1,
			size: 15,
			sizeRandomness: 15
		};
		this.spawnerOptions = {
			spawnRate: 400,
			horizontalSpeed: 1,
			verticalSpeed: 1,
			timeScale: 1
		};

		this.addToDatGui(this.options, this.spawnerOptions, this.guiFolder);
	}

	addToDatGui(options, spawnerOptions, guiFolder) {
		var f = guiFolder.addFolder("ParticleSystem");
		f.add(options, "velocityRandomness", 0, 30);
		f.add(options, "positionRandomness", 0, 30);
		f.add(options, "size", 1, 200);
		f.add(options, "sizeRandomness", 0, 250);
		f.add(options, "colorRandomness", 0, 10);
		f.add(options, "lifetime", .1, 100);
		f.add(options, "turbulence", 0, 10);
		f.add(spawnerOptions, "spawnRate", 10, 3000);
		f.add(spawnerOptions, "timeScale", -2, 2);
	}
	update(data) {
		this.parent.updateMatrixWorld();

		_.each(_.filter(data, function(d, key){
			return _.filter(this.targets,function(t){return "robot_"+t == key;}).length>0;
		}.bind(this)), function(bodyPart, idx){
			// console.log(bodyPart.name);
			if (!this.systems[idx]) {
				this.systems[idx] = new THREE.GPUParticleSystem({
					maxParticles: 1500,
				});

				this.systems[idx].clock = new THREE.Clock(true);
				this.systems[idx].tick = 0;
				this.systems[idx].o = {
					position: new THREE.Vector3()
				};
				this.systems[idx].options = this.options;
				this.systems[idx].spawnerOptions = this.spawnerOptions;

				this.parent.add(this.systems[idx]);
			}

			this.systems[idx].options.position = new THREE.Vector3().setFromMatrixPosition( bodyPart.matrixWorld );
			
			var delta = this.systems[idx].clock.getDelta() * this.systems[idx].spawnerOptions.timeScale;
			this.systems[idx].tick += delta;

			if (this.systems[idx].tick < 0) this.systems[idx].tick = 0;
			
			if (delta > 0) {
				for (var x = 0; x < this.systems[idx].spawnerOptions.spawnRate * delta; x++) {
					this.systems[idx].spawnParticle(this.systems[idx].options);
				}
			}

			this.systems[idx].update(this.systems[idx].tick);
		}.bind(this));
	}
}

module.exports = ParticleSystem;