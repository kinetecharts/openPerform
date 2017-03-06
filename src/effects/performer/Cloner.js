import _ from 'lodash'
var THREE = require('three');
import TWEEN from 'tween'

import config from './../../config'

class Cloner {
	constructor(parent, color, guiFolder) {
		this.parent = parent;
		this.color = color;
		this.guiFolder = guiFolder;
		this.performer = null;
		this.clones = [];
		
		this.options = {
			cloneRate:1,
			cloneLimit:5
		};

		this.addToDatGui(this.options, this.guiFolder);

		setInterval(this.clonePerformer.bind(this), this.options.cloneRate*1000);
	}

	addToDatGui(options, guiFolder) {
		var f = guiFolder.addFolder("Cloner");
		f.add(options, "cloneRate", 0.5, 10);
		f.add(options, "cloneLimit", 1, 15);
	}

	clonePerformer() {
		if (this.performer) {
			var clone = this.performer.clone();
			clone.traverse( function ( part ) {
				if ( part instanceof THREE.Mesh ) {
					part.material = part.material.clone();
					part.material.opacity = 0.15;
					part.material.transparent = true;
				}
			});

			this.parent.add(clone);
			this.clones.push(clone);

			this.performer = null;
		}

		if (this.clones.length > this.options.cloneLimit) {
			var clone = this.clones.shift();
			clone.traverse( ( part ) => {
				if ( part instanceof THREE.Mesh ) {
					new TWEEN.Tween({opacity:part.material.opacity})
					.to({opacity:0}, 250)
					.onUpdate(function() {
						part.material.opacity = this.opacity;
					})
					.onComplete(() => {
						if(clone) {
							this.parent.remove(clone);
							clone=null;
						}
					})
					.start();
				}
			});
		}
	}

	update(data) {
		this.performer = data;
	}
}

module.exports = Cloner;