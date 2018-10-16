/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 03:24:24
 * @modify date 2018-08-26 03:24:24
 * @desc [The Particles Effect creates particle generators for parts of a performers body.]
*/



import ParticlesMenu from '../../react/menus/effects/ParticlesMenu';

require('three/examples/js/GPUParticleSystem');

class ParticleSystem {
  constructor(effectId, parent, color) {
    this.id = effectId;
    this.name = 'particleSystem';
    this.parent = parent;
    this.color = new THREE.Color(color);

    this.targets = ['wristleft', 'wristright', 'ankleleft', 'ankleright'];
    this.possibleTargets = [
      'spineshoulder',
      'spinemid',
      'shoulderleft',
      'elbowleft',
      'wristleft',
      'shoulderright',
      'elbowright',
      'wristright',
      'hipleft',
      'kneeleft',
      'hipright',
      'kneeright',
    ];

    this.systems = [];

    // options passed during each spawned
    this.options = {
      positionRandomness: 0.05,
      velocity: new THREE.Vector3(),
      velocityRandomness: 0.05,
      color: '#3d4034',
      colorRandomness: 0.01,
      turbulence: 0,
      lifetime: 2,
      size: 60,
      sizeRandomness: 15,
      position: new THREE.Vector3(),
    };

    this.spawnerOptions = {
      spawnRate: 400,
      horizontalSpeed: 1.0,
      verticalSpeed: 2.0,
      timeScale: 1,
    };
  }

  // remove effect / clean up objects, timers, etc
  remove() {
    console.log('Deleting Particle...');
    _.each(this.systems, (system) => {
      this.parent.remove(system);
      system = null;
    });
    this.systems = [];
  }

  // render call, passes existing performer data
  update(data, currentPose, distances) {
    let idx = 0;
    data.traverse((d) => {
      if (_.filter(this.targets, t => '' + t == d.name.toLowerCase()).length > 0) {
        if (!this.systems[idx]) {
          this.systems[idx] = new THREE.GPUParticleSystem({
            maxParticles: 3000,
          });

          this.systems[idx].clock = new THREE.Clock(true);
          this.systems[idx].tick = 0;
          this.systems[idx].o = {
            position: new THREE.Vector3(),
          };
          this.systems[idx].options = this.options;
          this.systems[idx].spawnerOptions = this.spawnerOptions;
            

          this.parent.add(this.systems[idx]);
        }

        const oldPos = this.systems[idx].options.position;
        this.systems[idx].options.position = new THREE.Vector3().setFromMatrixPosition(d.matrixWorld);

        // this.systems[idx].spawnerOptions.horizontalSpeed = (this.systems[idx].options.position.x-oldPos.x);
        // this.systems[idx].spawnerOptions.verticalSpeed = (this.systems[idx].options.position.y-oldPos.y);
        // this.systems[idx].options.position.y = Math.sin( tick * this.spawnerOptions.verticalSpeed ) * 10;
        // this.systems[idx].options.position.z = Math.sin( tick * this.spawnerOptions.horizontalSpeed + this.spawnerOptions.verticalSpeed ) * 5;

        // var pos = new THREE.Vector3();
        // pos.x = Math.sin( this.systems[idx].tick * this.systems[idx].spawnerOptions.horizontalSpeed ) * 0.1;
        // pos.y = Math.sin( this.systems[idx].tick * this.systems[idx].spawnerOptions.verticalSpeed ) * 0.05;
        // pos.z = Math.sin( this.systems[idx].tick * this.systems[idx].spawnerOptions.horizontalSpeed + this.systems[idx].spawnerOptions.verticalSpeed ) * 0.25;

        // this.systems[idx].options.position.add(pos);

        const delta = this.systems[idx].clock.getDelta() * this.systems[idx].spawnerOptions.timeScale;
        this.systems[idx].tick += delta;

        if (this.systems[idx].tick < 0) this.systems[idx].tick = 0;

        if (delta > 0) {
          for (let x = 0; x < this.systems[idx].spawnerOptions.spawnRate * delta; x++) {
            this.systems[idx].spawnParticle(this.systems[idx].options);
          }
        }

        this.systems[idx].update(this.systems[idx].tick);

        idx++;
      }
    });
  }

  // updated target list from gui
  updateParts(data) {
    this.targets = data;
    this.remove();
  }

  // updated options from gui
  updateOptions(data) {
    this.options = data;
    this.remove();
  }

  getGUI() {
    return <ParticlesMenu data={this.options}
      currentTargets={this.targets}
      possibleTargets={this.possibleTargets}
      updateOptions={this.updateOptions.bind(this)}
      updateParts={this.updateParts.bind(this)}/>;
  }
}

module.exports = ParticleSystem;