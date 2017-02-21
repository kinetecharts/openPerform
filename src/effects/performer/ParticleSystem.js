import _ from 'lodash'
var THREE = require('three');
var GPUParticleSystem = require('./../../libs/three/GPUParticleSystem');

import config from './../../config'

class ParticleSystem {
	constructor(parent) {
		this.parent = parent;
		this.systems = [];
		this.clock = new THREE.Clock(true);

	}
	update(data) {
		_.each(data, function(bodyPart, idx){
			if (!this.systems[idx]) {
				this.systems[idx] = new THREE.GPUParticleSystem({
					maxParticles: 250
				});

				this.systems[idx].tick = 0;
				this.systems[idx].options = {
					position: new THREE.Vector3(),
					positionRandomness: 1.3,
					velocity: new THREE.Vector3(),
					velocityRandomness: 1.5,
					color: 0xaa88ff,
					colorRandomness: .75,
					turbulence: 1.5,
					lifetime: 200,
					size: 15,
					sizeRandomness: 2
				};
				this.systems[idx].spawnerOptions = {
					spawnRate: 30000,
					horizontalSpeed: 6,
					verticalSpeed: 6.66,
					timeScale: 30
				};

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
				this.systems[idx].options.position.x = Math.sin(this.systems[idx].tick * this.systems[idx].spawnerOptions.horizontalSpeed) * 20;
				this.systems[idx].options.position.y = Math.sin(this.systems[idx].tick * this.systems[idx].spawnerOptions.verticalSpeed) * 10;
				this.systems[idx].options.position.z = Math.sin(this.systems[idx].tick * this.systems[idx].spawnerOptions.horizontalSpeed + this.systems[idx].spawnerOptions.verticalSpeed) * 5;
				for (var x = 0; x < this.systems[idx].spawnerOptions.spawnRate * delta; x++) {
					// Yep, that's really it.	Spawning particles is super cheap, and once you spawn them, the rest of
					// their lifecycle is handled entirely on the GPU, driven by a time uniform updated below
					this.systems[idx].spawnParticle(this.systems[idx].options);
				}
			}
			this.systems[idx].update(this.systems[idx].tick);
		}.bind(this));
	}
}

module.exports = ParticleSystem;