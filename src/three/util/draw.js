

class Draw {
	constructor() {
		this.offset = new THREE.Vector3(0.002, 0, 0);
	}

	drawShapeExtrude(coordinates, location, origin, scale) {
		var pts = [];
		for (var j = 0; j < coordinates.length; j++) {
			var x = (coordinates[j][0] - origin.lon) + this.offset.x;
			var y = (coordinates[j][1] - origin.lat) + this.offset.y;

			x *= scale;
			y *= scale;

			pts.push( new THREE.Vector2( x, y ) );
		}

		return pts;
	}

	drawLineGeo(coordinates, location, origin, scale) {
		var geometry = new THREE.Geometry();

		for (var j = 0; j < coordinates.length; j++) {
			var x = (coordinates[j][0] - origin.lon) + this.offset.x;
			var y = (coordinates[j][1] - origin.lat) + this.offset.y;

			x *= scale;
			y *= scale;

			var z = 0 + this.offset.z;

			var vec3 = new THREE.Vector3( x, y, z );

			geometry.vertices.push(vec3);
		}

		return geometry;
	}

	drawBufferGeo(coordinates, location, origin, scale) {
		// console.log(coordinates);
		var segments = coordinates.length;

		var geometry = new THREE.BufferGeometry();
		var positions = new Float32Array( segments * 3 );
		var colors = new Float32Array( segments * 3 );

		for (var j = 0; j < coordinates.length; j++) {
			var x = (coordinates[j][0] - origin.lon) + this.offset.x;
			var y = (coordinates[j][1] - origin.lat) + this.offset.y;

			x *= scale;
			y *= scale;

			var z = 0 + this.offset.z;

			// positions
			positions[j * 3] = x;
			positions[j * 3 + 1] = y;
			positions[j * 3 + 2] = z;

			// colors
			colors[j * 3] = 0;
			colors[j * 3 + 1] = 0;
			colors[j * 3 + 2] = 0;
		}

		geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
		geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );
		geometry.computeBoundingBox();

		return geometry;
	}
}

export default Draw;