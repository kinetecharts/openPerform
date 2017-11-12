import _ from 'lodash';

import Trail from './../../libs/trail';
import Common from './../../util/Common';

import config from './../../config';

class Trails {
  constructor(parent, color, guiFolder) {
    this.name = 'trails';
    this.parent = parent;

    this.color = color;
    this.guiFolder = guiFolder;

    this.targets = [/* "hips",
			"rightupleg", "rightleg", "rightfoot",
			"leftupleg", "leftleg", "leftfoot",
			"spine", "spine3", "head",
			"rightarm", "rightforearm", */'righthand',
      /* "leftarm", "leftforearm", */'lefthand',
    ];

    this.trails = [];

    // specify points to create planar trail-head geometry
    this.circlePoints = [];
    this.twoPI = Math.PI * 2;
    this.index = 10;
    this.scale = 2;
    this.inc = this.twoPI / 32.0;

    for (let i = 0; i <= this.twoPI + this.inc; i += this.inc) {
      this.vector = new THREE.Vector3();
      this.vector.set(Math.cos(i) * this.scale, Math.sin(i) * this.scale, 0);
      this.circlePoints[this.index] = this.vector;
      this.index++;
    }
    this.trailHeadGeometry = this.circlePoints;

    // var head = Common.hexToRgb("#ffffff");
    // var tail = Common.hexToRgb("#eeeeee");
    const head = Common.hexToRgb('#352f9d');
    const tail = Common.hexToRgb('#ff0000');

    // initialize the trail
    this.options = {
      trailLength: 250,
      headRed: Common.mapRange(head[0], 0, 255, 0, 1),
      headGreen: Common.mapRange(head[1], 0, 255, 0, 1),
      headBlue: Common.mapRange(head[2], 0, 255, 0, 1),
      headAlpha: 0.75,

      tailRed: Common.mapRange(tail[0], 0, 255, 0, 1),
      tailGreen: Common.mapRange(tail[1], 0, 255, 0, 1),
      tailBlue: Common.mapRange(tail[2], 0, 255, 0, 1),
      tailAlpha: 0.35,
    };

    this.addToDatGui(this.options, this.guiFolder);
  }

  addToDatGui(options, guiFolder) {
    const f = guiFolder.addFolder('Trails');
    f.add(options, 'trailLength', 1, 300).listen().onChange(() => {
      _.each(this.trails, (trail) => {
        trail.refresh = true;
      });
    });
  }

  addTrail(parent, part, options) {
    // create the trail renderer object
    const trail = new THREE.TrailRenderer(parent, false);

    // create material for the trail renderer
    const trailMaterial = THREE.TrailRenderer.createBaseMaterial();

    trailMaterial.uniforms.headColor.value.set(options.headRed, options.headGreen, options.headBlue, options.headAlpha);
    trailMaterial.uniforms.tailColor.value.set(options.tailRed, options.tailGreen, options.tailBlue, options.tailAlpha);


    trail.initialize(trailMaterial, options.trailLength, false, 0, this.trailHeadGeometry, part);
    trail.activate();

    return trail;
  }

  remove() {
    console.log('Deleting trails...');
    _.each(this.trails, (trail) => {
      trail.deactivate();
    });
    this.guiFolder.removeFolder('Trails');
  }

  updateParameters(data) {
    // switch(data.parameter) {
    // 	case 'life':
    // 		this.options.lifetime = data.value*100;
    // 		break;
    // 	case 'rate':
    // 		this.spawnerOptions.spawnRate = data.value*3000;
    // 		break;
    // 	case 'size':
    // 		this.options.size = data.value*200;
    // 		break;
    // 	case 'color':
    // 		this.options.colorRandomness = data.value*10;
    // 		break;
    // }
  }

  update(data) {
    let idx = 0;
    data.traverse((d) => {
      if (_.filter(this.targets, t => `robot_${t}` == d.name.toLowerCase()).length > 0) {
        if (this.trails[idx]) {
          const time = performance.now();
          if (time - this.trails[idx].lastTrailUpdateTime > 50) {
            this.trails[idx].advance();
            this.trails[idx].lastTrailUpdateTime = time;
          } else {
            this.trails[idx].updateHead();
          }

					 if (this.trails[idx].refresh == true) {
            this.trails[idx].deactivate();
					 }
        }

        if (!this.trails[idx]) {
          this.trails[idx] = this.addTrail(this.parent, d, this.options);
          this.trails[idx].lastTrailUpdateTime = performance.now();
          this.trails[idx].refresh = false;
        }


        idx++;
      }
    });
  }
}

module.exports = Trails;
