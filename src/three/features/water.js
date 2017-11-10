

import Draw from './../util/draw'

class Water {
	constructor(geometries, drawType, colors, parent, origin) {
		this.draw = new Draw();
		this.name = 'Water';
		this.draw_object = new THREE.Group();
		
		this.colors = colors;
		this.height = 0.001;

		switch (drawType) {
		case 'extrude':
			this.drawWaterAsShapes(geometries, parent, origin, 4000);
			break;
		}
	}

	drawWaterAsShapes(geometries, parent, origin, scale) {
		var Polygons = null;
		var strings = null;
		var string = null;
		var waterGeo = null;
		var polygons = null;
		var polygon = null;
		var coordinates = null;
		var properties = null;
		var location = null;
		var sortRank = null;
		var waterPts = null;
		var material = null;
		var extrudeSettings = null;
		var shape = null;
		var geometry = null;
		var mesh = null;

		for (var geoType in geometries) {
			switch (geoType) {
			case 'LineStrings':
				var lineString = geometries[geoType];
				for (string in lineString) {
					coordinates = lineString[string].coordinates;
					properties = lineString[string].properties;
					location = lineString[string].location;
					
					// console.log('water: ', properties.kind);
					
					sortRank = properties.sort_rank;
					
					waterGeo = this.draw.drawLineGeo(coordinates, location, origin, scale);
					material = new THREE.LineBasicMaterial({ color:this.colors[properties.kind] });
					mesh = new THREE.Line( waterGeo, material );

					if (sortRank) {
						mesh.renderOrder = sortRank;
					}

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					this.draw_object.add(mesh);
				}
				break;

			case 'MultiLineStrings':
				var multiLineString = geometries[geoType];
				for (strings in multiLineString) {
					var lineStrings = multiLineString[strings].coordinates;
					properties = multiLineString[strings].properties;
					location = multiLineString[strings].location;
					
					// console.log('water: ', properties.kind);
					
					sortRank = properties.sort_rank;
					
					for (string in lineStrings) {
						waterGeo = this.draw.drawLineGeo(lineStrings[string], location, origin, scale);
						material = new THREE.LineBasicMaterial({ color:this.colors[properties.kind] });
						mesh = new THREE.Line( waterGeo, material );

						if (sortRank) {
							mesh.renderOrder = sortRank;
						}

						mesh.castShadow = true;
						mesh.receiveShadow = true;

						this.draw_object.add(mesh);
					}
				}
				break;

			case 'MultiPolygons':
				var MultiPolygons = null;
				polygons = geometries[geoType];
				for (polygon in polygons) {
					coordinates = polygons[polygon].coordinates;
					properties = polygons[polygon].properties;
					location = polygons[polygon].location;
					
					// console.log('water: ', properties.kind);
					
					sortRank = properties.sort_rank;
					
					for (var coordinate in coordinates) {
						waterPts = this.draw.drawShapeExtrude(coordinates[coordinate][0], location, origin, scale);

						material = new THREE.MeshLambertMaterial( { color: this.colors[properties.kind], wireframe: false } );

						extrudeSettings = {
							steps			: 1,
							bevelEnabled	: false,
							amount: this.height
						};

						shape = new THREE.Shape( waterPts );
						shape.createPointsGeometry();
						geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
						
						mesh = new THREE.Mesh( geometry, material );
						
						if (sortRank) {
							mesh.renderOrder = sortRank;
						}

						mesh.castShadow = true;
						mesh.receiveShadow = true;

						if (!MultiPolygons) {
							MultiPolygons = mesh;
						} else {
							MultiPolygons.geometry.merge( mesh.geometry, mesh.matrix );
						}
					}
				}
				this.draw_object.add(MultiPolygons);
				break;

			case 'Points':
				break;

			case 'Polygons':
				polygons = null;
				polygons = geometries[geoType];
				for (polygon in polygons) {
					coordinates = polygons[polygon].coordinates;
					properties = polygons[polygon].properties;
					location = polygons[polygon].location;
					
					// console.log('water: ', properties.kind);
					
					sortRank = properties.sort_rank;
					
					waterPts = this.draw.drawShapeExtrude(coordinates[0], location, origin, scale);

					material = new THREE.MeshLambertMaterial( { color: this.colors[properties.kind], wireframe: false } );

					extrudeSettings = {
						steps			: 1,
						bevelEnabled	: false,
						amount: this.height
					};

					shape = new THREE.Shape( waterPts );
					shape.createPointsGeometry();
					geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
					
					mesh = new THREE.Mesh( geometry, material );
					
					if (sortRank) {
						mesh.renderOrder = sortRank;
					}

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					if (!Polygons) {
						Polygons = mesh;
					} else {
						Polygons.geometry.merge( mesh.geometry, mesh.matrix );
					}
				}
				this.draw_object.add(Polygons);
				break;
			}
		}

		if (sortRank) {
			this.draw_object.renderOrder = sortRank;
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

export default Water;