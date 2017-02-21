import _ from 'lodash'
var THREE = require('three');
var GPUParticleSystem = require('./../../libs/three/GPUParticleSystem');

import config from './../../config'

class ParticleSystem {
	constructor(parent, color, guiFolder) {
		this.parent = parent;
		this.systems = [];
		this.clock = new THREE.Clock(true);
		this.color = color;
		this.guiFolder = guiFolder;
		this.targets = ["hips",
		"rightupleg", "rightleg", "rightfoot",
		"leftupleg", "leftleg", "leftfoot",
		"spine", "spine1", "spine2", "spine3", "neck", "head",
		"rightshoulder", "rightarm", "rightforearm", "righthand",
		"leftshoulder", "leftarm", "leftforearm", "lefthand"];

		// options passed during each spawned
		this.options = {
			position: new THREE.Vector3(),
			positionRandomness: .26,
			velocity: new THREE.Vector3(),
			velocityRandomness: 3,
			color: 0xaa88ff,
			colorRandomness: 0,
			turbulence: 1,
			lifetime: 0.9,
			size: 20,
			sizeRandomness: 1
		};
		this.spawnerOptions = {
			spawnRate: 10,
			horizontalSpeed: 1.5,
			verticalSpeed: 1.33,
			timeScale: 1
		};

		this.addToDatGui(this.options, this.spawnerOptions, this.guiFolder);
	}

	addToDatGui(options, spawnerOptions, guiFolder) {
		var f = guiFolder.addFolder("ParticleSystem");
		f.add(options, "velocityRandomness", 0, 3);
		f.add(options, "positionRandomness", 0, 3);
		f.add(options, "size", 1, 20);
		f.add(options, "sizeRandomness", 0, 25);
		f.add(options, "colorRandomness", 0, 1);
		f.add(options, "lifetime", .1, 10);
		f.add(options, "turbulence", 0, 1);
		f.add(spawnerOptions, "spawnRate", 10, 30000);
		f.add(spawnerOptions, "timeScale", -1, 1);
	}
	update(data) {
		_.each(_.filter(data, function(d){
			return _.filter(this.targets,function(t){return t == d.name;}).length>0;
		}.bind(this)), function(bodyPart, idx){
			// console.log(bodyPart.name);
			if (!this.systems[idx]) {
				this.systems[idx] = new THREE.GPUParticleSystem({
					maxParticles: 250
				});

				this.systems[idx].tick = 0;
				this.systems[idx].options = this.options;
				this.systems[idx].spawnerOptions = this.spawnerOptions;

				this.parent.add(this.systems[idx]);
			}

			this.systems[idx].position.set(
				bodyPart.position.x,
				bodyPart.position.y,
				bodyPart.position.z
			);

			if (idx !== 0) {
				this.systems[idx].position.add(new THREE.Vector3(data[0].position.x,
				data[0].position.y,
				data[0].position.z));
			}

			this.systems[idx].quaternion.copy(bodyPart.quaternion);
		
			var delta = this.clock.getDelta() * this.systems[idx].spawnerOptions.timeScale;
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