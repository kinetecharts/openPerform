import _ from 'lodash'
var THREE = require('three');

import Trail from './../../libs/trail'
import Common from './../../util/Common'

import config from './../../config'

class DataTags {
	constructor(parent, color, guiFolder) {
		this.name = 'datatags';
		this.parent = parent;
		
		this.color = color;
		this.guiFolder = guiFolder;
		
		this.targets = ["hips",
			"rightupleg", "rightleg", "rightfoot",
			"leftupleg", "leftleg", "leftfoot",
			"spine", "spine3", "head",
			"rightarm", "rightforearm", "righthand",
			"leftarm", "leftforearm", "lefthand"
		];

		this.tags = [];

		this.options = {};

		
		this.addFont();
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

	addFont() {
		var loader = new THREE.FontLoader();
		loader.load( '../../fonts/helvetiker_regular.typeface.json', ( font ) => {
			this.font = font;
		});
	}

	createFill(message, size, color) {
		var xMid, text;
		var textShape = new THREE.BufferGeometry();
		var matLite = new THREE.MeshBasicMaterial( {
			color: color,
			transparent: true,
			opacity: 0.4,
			side: THREE.DoubleSide
		} );
		
		// var message = "   Three.js\nSimple text.";
		
		var shapes = this.font.generateShapes( message, size, 2 );
		var geometry = new THREE.ShapeGeometry( shapes );
		geometry.computeBoundingBox();
		xMid = - 0.5 * ( geometry.boundingBox.max.x - geometry.boundingBox.min.x );
		geometry.translate( xMid, 0, 0 );
		
		// make shape ( N.B. edge view not visible )
		textShape.fromGeometry( geometry );
		text = new THREE.Mesh( textShape, matLite );

		return text;
	}

	createStroke(message, size, color) {
			var matDark = new THREE.LineBasicMaterial( {
				color: color,
				side: THREE.DoubleSide
			} );
			var shapes = font.generateShapes( message, size, 2 );
			// make line shape ( N.B. edge view remains visible )
			var holeShapes = [];
			for ( var i = 0; i < shapes.length; i ++ ) {
				var shape = shapes[ i ];
				if ( shape.holes && shape.holes.length > 0 ) {
					for ( var j = 0; j < shape.holes.length; j ++ ) {
						var hole = shape.holes[ j ];
						holeShapes.push( hole );
					}
				}
			}
			shapes.push.apply( shapes, holeShapes );
			var lineText = new THREE.Object3D();
			for ( var i = 0; i < shapes.length; i ++ ) {
				var shape = shapes[ i ];
				var lineGeometry = shape.createPointsGeometry();
				lineGeometry.translate( xMid, 0, 0 );
				var lineMesh = new THREE.Line( lineGeometry, matDark );
				lineText.add( lineMesh );
			}

			return lineText;
	}

	addTag(parent, part, options){
		var tag = new THREE.Object3D();
		var name = this.createFill(
			part.name.slice(6, part.name.length).replace(/([a-z](?=[A-Z]))/g, '$1 '),
			5,
			0xFFFFFF
		);

		
		name.position.add(new THREE.Vector3(0,27,0));

		tag.add(name);

		// var gPos = new THREE.Vector3().setFromMatrixPosition( part.matrixWorld );
		// var pos = this.createFill(
		// 	'(' + gPos.x + ',' + gPos.y + ',' + gPos.z + ')',
		// 	5,
		// 	0xFFFFFF
		// );

		// pos.position.add(new THREE.Vector3(0,20,0));

		// tag.add(pos);

		var price = this.createFill(
			'$10,000',
			5,
			0xFFFFFF
		);

		price.position.add(new THREE.Vector3(0,20,0));

		tag.add(price);

		part.add(tag);
		return tag;
	}

	remove() {
		console.log("Deleting trails...");
		_.each(this.trails, (trail) => {
			trail.deactivate();
		});
		this.guiFolder.removeFolder("Trails");
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
		var idx = 0;
		data.traverse( function ( d ) {
			if (_.filter(this.targets,function(t){return "robot_"+t == d.name.toLowerCase();}).length>0) {
				if (this.tags[idx]) {
					if (this.tags[idx].children.length>1) {
						// this.tags[idx].remove(this.tags[idx].children[1]);
						
						// var gPos = new THREE.Vector3().setFromMatrixPosition( part.matrixWorld );
						// var pos = this.createFill(
						// 	'(' + gPos.x + ',' + gPos.y + ',' + gPos.z + ')',
						// 	5,
						// 	0xFFFFFF
						// );

						// pos.position.add(new THREE.Vector3(0,20,0));

						// this.tags[idx].add(pos);
					}
				}

				if (!this.tags[idx] && this.font) {
					this.tags[idx] = this.addTag(this.parent, d, this.options);
					// this.trails[idx].lastTrailUpdateTime = performance.now();
					// this.trails[idx].refresh = false;
				}

				
				idx++;
			}
		}.bind(this));
	}
}

module.exports = DataTags;