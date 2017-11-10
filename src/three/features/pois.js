

import Draw from './../util/draw'

class Pois {
	constructor(geometries, drawType, color, parent, origin) {
		this.draw = new Draw();

		this.color = color;

		switch (drawType) {
		case 'shapes':
			this.drawPoisAsShapes(geometries, parent, origin, 4000);
			break;
		}
	}
	drawPoisAsShapes(geometries, parent, origin, scale) {
		var pois = null;
		for (var geoType in geometries) {
			console.log(geoType);
			switch (geoType) {
			case 'Points':
				//Used for label placement
				break;
			}
		}
	}
}

export default Pois;