

import Draw from './../util/draw'

class Buildings {
	constructor(geometries, drawType, colors, parent, origin) {
		this.draw = new Draw();
		this.draw_object = null;
		this.name = 'Buildings';
		this.colors = colors;

		switch (drawType) {
		case 'extrude':
			this.drawBuildingsAsExtrudedShapes(geometries, parent, origin, 4000);
			break;
		case 'segments':
			// this.drawBuildingsAsLineSegments(geometries, parent, origin, 4000);
			break;
		case 'geo':
			// this.drawBuildingsAsLineGeo(geometries, parent, origin, 4000);
			break;
		case 'buffer':
			// this.drawBuildingsAsLineBuffer(geometries, parent, origin, 4000);
			break;
		}
	}

	drawBuildingsAsExtrudedShapes(geometries, parent, origin, scale) {
		for (var geoType in geometries) {
			// console.log(geoType);
			switch (geoType) { //Polygons, Points
			case 'Points':
				//Used for label placement
				break;
			case 'Polygons':
				var polygons = geometries[geoType];
				for (var polygon in polygons) {
					var coordinates = polygons[polygon].coordinates;
					var properties = polygons[polygon].properties;
					var location = polygons[polygon].location;

					// console.log('buildings: ', properties.kind);
					
					var height = properties.height;
					var sortRank = properties.sort_rank;

					if (coordinates.length == 1) {
						var buildingPts = this.draw.drawShapeExtrude(coordinates[0], location, origin, scale);
						
						if (height !== undefined) {
							height /= 20;
						} else {
							height = (20 + (Math.random() * 5)) / 20;//default height
						}

						var material = new THREE.MeshPhongMaterial( { color: this.colors[properties.kind], wireframe: false } );

						var extrudeSettings = {
							steps			: 1,
							bevelEnabled	: false,
							amount: height
						};

						var shape = new THREE.Shape( buildingPts );
						shape.createPointsGeometry();
						var geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
						
						var mesh = new THREE.Mesh( geometry, material );
						
						if (sortRank) {
							mesh.renderOrder = sortRank;
						}

						//mesh.castShadow = true;
						//mesh.receiveShadow = true;
						
						if (!this.draw_object) {
							this.draw_object = mesh;
						} else {
							this.draw_object.geometry.merge( mesh.geometry, mesh.matrix );
						}
					}
				}
				break;
			}
		}
		parent.add(this.draw_object);

		this.startingPos = this.draw_object.position.clone();
	}

	toggle() {
		this.draw_object.visible = !this.draw_object.visible;
	}

	hide() {
		this.draw_object.visible = false;
	}

	show() {
		this.draw_object.visible = true;
	}

	position(pos) {
		this.draw_object.position.copy(this.startingPos.clone().add(pos));
	}
}

export default Buildings;