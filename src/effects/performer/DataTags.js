import _ from 'lodash';

const TextSprite = require('./../../libs/THREE.TextSprite.js');

import Trail from './../../libs/trail';
import Common from './../../util/Common';

import config from './../../config';

class DataTags {
  constructor(parent, color, guiFolder) {
    this.name = 'datatags';
    this.parent = parent;

    this.color = color;
    this.guiFolder = guiFolder;

    this.targets = ['hips',
      'rightupleg', 'rightleg', 'rightfoot',
      'leftupleg', 'leftleg', 'leftfoot',
      'spine', 'spine3', 'head',
      'rightarm', 'rightforearm', 'righthand',
      'leftarm', 'leftforearm', 'lefthand',
    ];

    this.tags = [];

    this.options = {};


    // this.addToDatGui(this.options, this.guiFolder);
  }

  // addToDatGui(options, guiFolder) {
  // 	var f = guiFolder.addFolder("Trails");
  // 	f.add(options, "trailLength", 1, 300).listen().onChange(() => {
  // 		_.each(this.trails, (trail) => {
  // 			trail.refresh = true;
  // 		});
  // 	});
  // }

  addTag(parent, part, options) {
    var options = {
      textSize: 10,
      redrawInterval: 1,
      material: {
        color: 0xFFFFFF,
      },
      texture: {
        text: part.name.slice(6, part.name.length).replace(/([a-z](?=[A-Z]))/g, '$1 '),
        fontFamily: 'Arial, Helvetica, sans-serif',
      },
    };

    const tag = new THREE.TextSprite(options);
    tag.name = part.name.slice(6, part.name.length).replace(/([a-z](?=[A-Z]))/g, '$1 ');

    tag.position.set(25, 0, 0);

    // tag.children[0].scale.set(0.01,0.01,0.01);

    part.add(tag);

    console.log(tag);

    return tag;
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
        if (this.tags[idx]) {
          if (this.tags[idx]) {
            const gPos = new THREE.Vector3().setFromMatrixPosition(d.matrixWorld);
            this.tags[idx].material.map.text =
						`${this.tags[idx].name}\n`
						+ `(${gPos.x.toFixed(2)},${gPos.y.toFixed(2)},${gPos.z.toFixed(2)})`;
          }
        }

        if (!this.tags[idx]) {
          this.tags[idx] = this.addTag(this.parent, d, this.options);
        }


        idx++;
      }
    });
  }
}

module.exports = DataTags;
