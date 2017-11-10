

import Draw from './../util/draw'

class Roads {
	constructor(geometries, drawType, colors, parent, origin) {
		this.draw = new Draw();
		this.draw_object = new THREE.Group();

		this.name = 'Roads';
		this.height = 0.00005;
		this.colors = colors;

		switch (drawType) {
		case 'shapes':
			this.drawRoadsAsShapes(geometries, parent, origin, 4000);
			break;
		case 'segments':
			this.drawRoadsAsLineSegments(geometries, parent, origin, 4000);
			break;
		case 'geo':
			this.drawRoadsAsLineGeo(geometries, parent, origin, 4000);
			break;
		case 'buffer':
			this.drawRoadsAsLineBuffer(geometries, parent, origin, 4000);
			break;
		}
	}
	drawRoadsAsShapes(geometries, parent, origin, scale) {
		var roadPts = null;
		var extrudeSettings = null;
		var shape = null;
		var geometry = null;
		var coordinates = null;
		var properties = null;
		var location = null;
		var sortRank = null;
		var material = null;
		var mesh = null;

		for (var geoType in geometries) {
			// console.log(geoType);
			switch (geoType) {
			case 'LineStrings':
				var LS = null;
				var lineString = geometries[geoType];
				for (var string in lineString) {
					coordinates = lineString[string].coordinates;
					properties = lineString[string].properties;
					location = lineString[string].location;

					// console.log('roads: ', properties.kind);
					
					sortRank = properties.sort_rank;

					roadPts = this.draw.drawShapeExtrude(coordinates, location, origin, scale);
					material = new THREE.MeshLambertMaterial( { color: this.colors[properties.kind], wireframe: false } );

					extrudeSettings = {
						steps			: 1,
						bevelEnabled	: false,
						amount:this.height
					};

					shape = new THREE.Shape( roadPts );
					shape.createPointsGeometry();
					geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
					
					mesh = new THREE.Mesh( geometry, material );
					
					if (sortRank) {
						mesh.renderOrder = sortRank;
					}

					mesh.castShadow = true;
					mesh.receiveShadow = true;

					if (!LS) {
						LS = mesh;
					} else {
						LS.geometry.merge( mesh.geometry, mesh.matrix );
					}
				}
				this.draw_object.add(LS);
				break;
			case 'MultiLineStrings':
				var MS = null;
				var multiLineString = geometries[geoType];
				for (var strings in multiLineString) {
					coordinates = multiLineString[strings].coordinates;
					properties = multiLineString[strings].properties;
					location = multiLineString[strings].location;
					
					// console.log('roads: ', properties.kind);
					
					sortRank = properties.sort_rank;
					
					for (var coordinate in coordinates) {
						roadPts = this.draw.drawShapeExtrude(coordinates[coordinate], location, origin, scale);
						material = new THREE.MeshLambertMaterial( { color: this.colors[properties.kind], wireframe: false } );

						extrudeSettings = {
							steps			: 1,
							bevelEnabled	: false,
							amount:this.height
						};

						shape = new THREE.Shape( roadPts );
						shape.createPointsGeometry();
						geometry = new THREE.ExtrudeGeometry( shape, extrudeSettings );
						
						mesh = new THREE.Mesh( geometry, material );
						
						if (sortRank) {
							mesh.renderOrder = sortRank;
						}

						mesh.castShadow = true;
						mesh.receiveShadow = true;

						if (!MS) {
							MS = mesh;
						} else {
							MS.geometry.merge( mesh.geometry, mesh.matrix );
						}
					}
				}
				this.draw_object.add(MS);
				break;
			}
		}
		parent.add(this.draw_object);
		this.startingPos = this.draw_object.position.clone();
	}

	drawRoadsAsLineSegments(geometries, parent, origin, scale) {
		var coordinates = null;
		var properties = null;
		var location = null;
		var sortRank = null;
		var material = null;
		var mesh = null;

		for (var geoType in geometries) {
			// console.log(geoType);
			switch (geoType) {
			case 'LineStrings':
				var lineString = geometries[geoType];
				for (var string in lineString) {
					coordinates = lineString[string].coordinates;
					properties = lineString[string].properties;
					location = lineString[string].location;

					// console.log('roads: ', properties.kind);
					
					sortRank = properties.sort_rank;
					
					var roadsGeo = this.draw.drawBufferGeo(coordinates, location, origin, scale);
					material = new THREE.LineBasicMaterial({ color: this.colors[properties.kind], linewidth: 1 });
					mesh = new THREE.LineSegments( roadsGeo, material );

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
				for (var strings in multiLineString) {
					coordinates = multiLineString[strings].coordinates;
					properties = multiLineString[strings].properties;
					location = multiLineString[strings].location;

					// console.log('roads: ', properties.kind);
					
					sortRank = properties.sort_rank;
					
					for (var coordinate in coordinates) {
						var roads = this.draw.drawBufferGeo(coordinates[coordinate], location, origin, scale);
						material = new THREE.LineBasicMaterial({ color: this.colors[properties.kind], linewidth: 1 });
						mesh = new THREE.LineSegments( roads, material );

						if (sortRank) {
							mesh.renderOrder = sortRank;
						}

						mesh.castShadow = true;
						mesh.receiveShadow = true;

						this.draw_object.add(mesh);
					}
				}
				break;
			}
		}
		parent.add(this.draw_object);
		this.startingPos = this.draw_object.position.clone();
	}

	drawRoadsAsLineGeo(geometries, parent, origin, scale) {
		var coordinates = null;
		var properties = null;
		var location = null;
		var sortRank = null;
		var roadGeo = null;
		var material = null;
		var mesh = null;

		for (var geoType in geometries) {
			// console.log(geoType);
			switch (geoType) {
			case 'LineStrings':
				var LS = null;
				var lineString = geometries[geoType];
				for (var string in lineString) {
					coordinates = lineString[string].coordinates;
					properties = lineString[string].properties;
					location = lineString[string].location;

					// console.log('roads: ', properties.kind);
					
					sortRank = properties.sort_rank;
					
					roadGeo = this.draw.drawLineGeo(coordinates, location, origin, scale);
					material = new THREE.LineBasicMaterial({ color:this.colors[properties.kind] });
					mesh = new THREE.Line( roadGeo, material );
					
					if (sortRank) {
						mesh.renderOrder = sortRank;
					}

					if (!LS) {
						LS = mesh;
					} else {
						LS.geometry.merge( mesh.geometry, mesh.matrix );
					}
				}
				this.draw_object.add(LS);
				break;
			case 'MultiLineStrings':
				var MS = null;
				var multiLineString = geometries[geoType];
				for (var strings in multiLineString) {
					coordinates = multiLineString[strings].coordinates;
					properties = multiLineString[strings].properties;
					location = multiLineString[strings].location;
					
					// console.log('roads: ', properties.kind);
					sortRank = properties.sort_rank;
					for (var coordinate in coordinates) {
						roadGeo = this.draw.drawLineGeo(coordinates[coordinate], location, origin, scale);
						material = new THREE.LineBasicMaterial({ color:this.colors[properties.kind] });
						mesh = new THREE.Line( roadGeo, material );
						
						if (sortRank) {
							mesh.renderOrder = sortRank;
						}

						if (!MS) {
							MS = mesh;
						} else {
							MS.geometry.merge( mesh.geometry, mesh.matrix );
						}
					}
				}
				this.draw_object.add(MS);
				break;
			}
		}

		if (sortRank) {
			mesh.renderOrder = sortRank;
		}

		parent.add(this.draw_object);
		this.startingPos = this.draw_object.position.clone();
	}

	drawRoadsAsLineBuffer(geometries, parent, origin, scale) {
		var roadPts = null;
		var extrudeSettings = null;
		var shape = null;
		var geometry = null;
		var coordinates = null;
		var properties = null;
		var location = null;
		var sortRank = null;
		var roadGeo = null;
		var material = null;
		var mesh = null;

		for (var geoType in geometries) {
			// console.log(geoType);
			switch (geoType) {
			case 'LineStrings':
				var lineString = geometries[geoType];
				for (var string in lineString) {
					coordinates = lineString[string].coordinates;
					properties = lineString[string].properties;
					location = lineString[string].location;

					// console.log('roads: ', properties.kind);
					
					sortRank = properties.sort_rank;
					roadGeo = this.draw.drawBufferGeo(coordinates, location, origin, scale);
					material = new THREE.LineBasicMaterial({ color:this.colors[properties.kind] });
					mesh = new THREE.Line( roadGeo, material );

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
				for (var strings in multiLineString) {
					coordinates = multiLineString[strings].coordinates;
					properties = multiLineString[strings].properties;
					location = multiLineString[strings].location;

					// console.log('roads: ', properties.kind);
					
					sortRank = properties.sort_rank;

					for (var coordinate in coordinates) {
						roadGeo = this.draw.drawBufferGeo(coordinates[coordinate], location, origin, scale);
						material = new THREE.LineBasicMaterial({ color:this.colors[properties.kind] });
						mesh = new THREE.Line( roadGeo, material );

						if (sortRank) {
							mesh.renderOrder = sortRank;
						}

						mesh.castShadow = true;
						mesh.receiveShadow = true;

						this.draw_object.add(mesh);
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

export default Roads;