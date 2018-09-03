

import Trail from './../../libs/trail';
import Common from './../../util/Common';

import config from './../../config';

class Drawing {
  constructor(effectId, parent, color, guiFolder) {
    this.id = effectId;
    this.name = 'drawings';
    this.parent = parent;

    this.active = false;

    this.color = color;

    this.targets = [/* "hips",
			"rightupleg", "rightleg", */ 'rightfoot',
      /* "leftupleg", "leftleg", */ 'leftfoot',
      /* "spine", "spine3", "head", */
      /* "rightarm", "rightforearm", */ 'righthand',
      /* "leftarm", "leftforearm", */'lefthand',
    ];

    this.drawings = [];

    // specify points to create planar drawing-head geometry
    this.circlePoints = [];
    this.twoPI = Math.PI * 2;
    this.index = 10;
    this.scale = 5;
    this.inc = this.twoPI / 32.0;

    for (let i = 0; i <= this.twoPI + this.inc; i += this.inc) {
      this.vector = new THREE.Vector3();
      this.vector.set(Math.cos(i) * this.scale, Math.sin(i) * this.scale, 0);
      this.circlePoints[this.index] = this.vector;
      this.index++;
    }
    this.drawingHeadGeometry = this.circlePoints;

    this.headColor = '#352f9d';
    this.tailColor = '#432066';

    const head = Common.hexToRgb(this.headColor);
    const tail = Common.hexToRgb(this.tailColor);

    // initialize the drawing
    this.options = {
      drawingLength: 20,
      headRed: Common.mapRange(head[0], 0, 255, 0, 1),
      headGreen: Common.mapRange(head[1], 0, 255, 0, 1),
      headBlue: Common.mapRange(head[2], 0, 255, 0, 1),
      headAlpha: 0.75,

      tailRed: Common.mapRange(tail[0], 0, 255, 0, 1),
      tailGreen: Common.mapRange(tail[1], 0, 255, 0, 1),
      tailBlue: Common.mapRange(tail[2], 0, 255, 0, 1),
      tailAlpha: 0.35,
    };
  }

  toggle() {
    return this.active = !this.active;
  }

  addDrawing(parent, part, options) {
    // create the drawing renderer object
    const drawing = new THREE.TrailRenderer(parent, false);

    // create material for the drawing renderer
    const drawingMaterial = THREE.TrailRenderer.createBaseMaterial();

    drawingMaterial.uniforms.headColor.value.set(options.headRed, options.headGreen, options.headBlue, options.headAlpha);
    drawingMaterial.uniforms.tailColor.value.set(options.tailRed, options.tailGreen, options.tailBlue, options.tailAlpha);


    drawing.initialize(drawingMaterial, options.drawingLength, false, 0, this.drawingHeadGeometry, part);
    drawing.activate();

    return drawing;
  }

  remove() {
    console.log('Deleting drawings...');
    _.each(this.drawings, (drawing) => {
      drawing.deactivate();
    });
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

  update(data, currentPose, distances) {
    let idx = 0;
    data.traverse((d) => {
      if (_.filter(this.targets, t => `robot_${t}` == d.name.toLowerCase()).length > 0) {
        if (this.drawings[idx]) {
          const time = performance.now();
          if (time - this.drawings[idx].lastTrailUpdateTime > 50) {
            this.drawings[idx].advance();
            this.drawings[idx].lastTrailUpdateTime = time;
          } else {
            this.drawings[idx].updateHead();
          }
        }

        if (!this.drawings[idx]) {
          this.drawings[idx] = this.addTrail(this.parent, d, this.options);
          this.drawings[idx].lastTrailUpdateTime = performance.now();
        }


        idx++;
      }
    });
  }
}

module.exports = Drawing;
