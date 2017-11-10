

import Draw from './../util/draw'

class Landuse {
	constructor(geometries, drawType, colors, parent, origin) {
		this.draw = new Draw();
		this.draw_object = new THREE.Group();
		this.name = 'Landuse';
		this.colors = colors;
		this.height = 0.001;

		switch (drawType) {
		case 'shapes':
			this.drawLanduseAsShapes(geometries, parent, origin, 4000);
			break;
		}
	}

	drawLanduseAsShapes(geometries, parent, origin, scale) {
		var landuseGeo = null;
		var polygons = null;
		var polygon = null;
		var coordinates = null;
		var properties = null;
		var location = null;
		var sortRank = null;
		var landusePts = null;
		var material = null;
		var shape = null;
		var geometry = null;
		var mesh = null;

		for (var geoType in geometries) {
			// console.log(geometries[geoType]);
			switch (geoType) {
			case 'LineStrings':
				var LS = new THREE.Group();
				var lineString = geometries[geoType];
				for (var string in lineString) {
					coordinates = lineString[string].coordinates;
					properties = lineString[string].properties;
					location = lineString[string].location;

					// console.log('landuse: ', properties.kind, ' - ', (this.colors[properties.kind]!==3407769));
					
					sortRank = properties.sort_rank;
					
					landuseGeo = this.draw.drawLineGeo(coordinates, location, origin, scale);
					material = new THREE.LineBasicMaterial({ color:this.colors[properties.kind] });
					mesh = new THREE.Line( landuseGeo, material );

					if (sortRank) {
						mesh.renderOrder = sortRank;
					}

					mesh.castShadow = true;
					mesh.receiveShadow = true;
					
					LS.add(mesh);
				}
				this.draw_object.add(LS);
				break;
			case 'MultiLineStrings':
				var MS = new THREE.Group();
				var multiLineString = geometries[geoType];
				for (var strings in multiLineString) {
					coordinates = multiLineString[strings].coordinates;
					properties = multiLineString[strings].properties;
					location = multiLineString[strings].location;
					
					// console.log('landuse: ', properties.kind, ' - ', (this.colors[properties.kind]!==3407769));
					
					sortRank = properties.sort_rank;
					
					for (var coordinate in coordinates) {
						landuseGeo = this.draw.drawLineGeo(coordinates[coordinate], location, origin, scale);
						material = new THREE.LineBasicMaterial({ color:this.colors[properties.kind] });
						mesh = new THREE.Line( landuseGeo, material );
						
						if (sortRank) {
							mesh.renderOrder = sortRank;
						}
						
						mesh.castShadow = true;
						mesh.receiveShadow = true;

						MS.add(mesh);
					}
				}
				this.draw_object.add(MS);
				break;
			case 'MultiPolygons':
				var MultiPolygons = null;
				polygons = geometries[geoType];
				for (polygon in polygons) {
					coordinates = polygons[polygon].coordinates;
					properties = polygons[polygon].properties;
					location = polygons[polygon].location;
					
					// console.log('landuse: ', properties.kind, ' - ', (this.colors[properties.kind]!==3407769));
					
					sortRank = properties.sort_rank;
					
					for (coordinate in coordinates) {
						landusePts = this.draw.drawShapeExtrude(coordinates[coordinate][0], location, origin, scale);
						
						material = new THREE.MeshLambertMaterial( { color:this.colors[properties.kind], wireframe: false } );

						shape = new THREE.Shape( landusePts );
						shape.createPointsGeometry();
						
						geometry = new THREE.ShapeGeometry( shape );

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
				var Polygons = null;
				polygons = geometries[geoType];
				for (polygon in polygons) {
					coordinates = polygons[polygon].coordinates;
					properties = polygons[polygon].properties;
					location = polygons[polygon].location;
					
					// console.log('landuse: ', properties.kind, ' - ', (this.colors[properties.kind]!==3407769));
					
					sortRank = properties.sort_rank;
					
					landusePts = this.draw.drawShapeExtrude(coordinates[0], location, origin, scale);
					material = new THREE.MeshLambertMaterial( { color: this.colors[properties.kind], wireframe: false } );
					
					shape = new THREE.Shape( landusePts );
					shape.createPointsGeometry();
					
					geometry = new THREE.ShapeGeometry( shape );
					
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

export default Landuse;