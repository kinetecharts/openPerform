

import Draw from './../util/draw'

class Places {
	constructor(geometries, drawType, color, parent, origin) {
		this.draw = new Draw();
		this.color = color;

		switch (drawType) {
		case 'shapes':
			this.drawPlacesAsShapes(geometries, parent, origin, 4000);
			break;
		}
	}

	drawPlacesAsShapes(geometries, parent, origin, scale) {
		var places = null;
		for (var geoType in geometries) {
			// console.log(geoType);
			switch (geoType) {
			case 'Points':
				//Used for label placement
				break;
			}
		}
	}
}

export default Places;