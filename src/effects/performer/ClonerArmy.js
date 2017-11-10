import _ from 'lodash'
import TWEEN from 'tween'

import config from './../../config'

class ClonerArmy {
	constructor(parent, color, guiFolder) {
		this.name = 'clonerArmy';
		this.parent = parent;
		this.color = color;
		this.guiFolder = guiFolder;
		this.performer = null;
		this.clones = [];
		this.cloneInterval = null
		this.lastClick = 0;
		this.clickCount = 0;

		this.ClonerArmyate = 0.25;
		this.cloneLife = 1.25;
		this.cloneSize = 1;
		
		this.addToDatGui(this.guiFolder);

		// this.updateClonerArmyRate(this.ClonerArmyate);
		// setTimeout(this.clonePerformer.bind(this), 1000)
	}

	updateClonerArmyRate(val) {
		if (this.cloneInterval) {
			clearInterval(this.cloneInterval);
		}
		this.cloneInterval = setInterval(this.clonePerformer.bind(this), 1000*val);
	}

	addToDatGui(guiFolder) {
		var f = guiFolder.addFolder("ClonerArmy");
		var tapButton = { add:function(){
			var d = new Date();
			var t = d.getTime();
			var clickDiff = t - this.lastClick;
			
			if (this.clickCount==3) {
				console.log(clickDiff/1000);
				this.ClonerArmyate = clickDiff/1000;
				this.clickCount = 0;
			}

			this.lastClick = t;
			this.clickCount++;
		}.bind(this) };
		f.add(tapButton,'add').name("Tap to set");
		f.add(this, "ClonerArmyate", 0.25, 10).step(0.25).listen().onChange(this.updateClonerArmyRate.bind(this));
		f.add(this, "cloneLife", 0.25, 10).step(0.25).listen();
		f.add(this, "cloneSize", 0.25, 10).step(0.25).listen();

		var cloneButton = { add:function(){
			this.clonePerformer();
		}.bind(this) };
		f.add(cloneButton,'add').name("Create clone");
	}

	clonePerformer() {
		if (this.performer) {
			var clone = this.performer.clone();
			clone.scale.set(clone.scale.x*this.cloneSize,clone.scale.y*this.cloneSize,clone.scale.z*this.cloneSize);
			clone.traverse( function ( part ) {
				if ( object.name.toLowerCase().match(/robot_/g)) {
					this.meshes[object.name.toLowerCase()] = part;
				}
				if ( part instanceof THREE.Mesh ) {
					part.material = part.material.clone();
					part.material.opacity = 1;
					part.material.transparent = false;
				}
			});

			this.parent.add(clone);
			this.clones.push(clone);

			// this.performer = null;
		}

		// setTimeout(function(){
			// var clone = this.clones.shift();
			// if (clone) {
			// 	clone.traverse( ( part ) => {
			// 		if ( part instanceof THREE.Mesh ) {
			// 			new TWEEN.Tween({opacity:part.material.opacity})
			// 			.to({opacity:0}, this.cloneLife*1000)
			// 			.onUpdate(function() {
			// 				part.material.opacity = this.opacity;
			// 			})
			// 			.onComplete(() => {
			// 				if(clone) {
			// 					this.parent.remove(clone);
			// 					clone=null;
			// 				}
			// 			})
			// 			.start();
			// 		}
			// 	});
			// }
		// }.bind(this), this.cloneLife*1000);
	}

	remove() {
		console.log("Deleting ClonerArmy...");
		clearInterval(this.cloneInterval);
		_.each(this.clones, (clone) => {
			this.parent.remove(clone);
			clone = null;
		});
		this.guiFolder.removeFolder("ClonerArmy");
	}

	updateParameters(data) {
		switch(data.parameter) {
    		case 'rate':
    			this.ClonerArmyate = (data.value*10)+0.25;
    			this.updateClonerArmyRate(this.ClonerArmyate);
    			break;
    		case 'life':
				this.cloneLife = (data.value*10)+0.25;
    			break;
    	}
	}

	update(data) {
		this.performer = data;
	}
}

module.exports = ClonerArmy;