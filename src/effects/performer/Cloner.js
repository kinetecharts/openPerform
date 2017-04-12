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
		this.cloneInterval = null
		this.lastClick = 0;
		this.clickCount = 0;

		this.options = {
			cloneRate:0.25,
			cloneLife:1.25,
			cloneSize:1
		};

		this.addToDatGui(this.options, this.guiFolder);

		this.updateCloneRate(this.options.cloneRate);
	}

	updateCloneRate(val) {
		console.log("Setting clone rate: ", val);
		if (this.cloneInterval) {
			clearInterval(this.cloneInterval);
		}
		this.cloneInterval = setInterval(this.clonePerformer.bind(this), 1000*val);
	}

	addToDatGui(options, guiFolder) {
		var f = guiFolder.addFolder("Cloner");
		var tapButton = { add:function(){
			var d = new Date();
			var t = d.getTime();
			var clickDiff = t - this.lastClick;
			
			if (this.clickCount==3) {
				console.log(clickDiff/1000);
				this.options.cloneRate = clickDiff/1000;
				this.clickCount = 0;
			}

			this.lastClick = t;
			this.clickCount++;
		}.bind(this) };
		f.add(tapButton,'add').name("Tap to set");
		f.add(options, "cloneRate", 0.25, 2).step(0.25).listen().onChange(this.updateCloneRate.bind(this));
		f.add(options, "cloneLife", 0.25, 5).step(0.25);
		f.add(options, "cloneSize", 0.25, 10).step(0.25).listen();
	}

	clonePerformer() {
		if (this.performer) {
			var clone = this.performer.clone();
			clone.scale.set(clone.scale.x*this.options.cloneSize,clone.scale.y*this.options.cloneSize,clone.scale.z*this.options.cloneSize);
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

		// setTimeout(function(){
			var clone = this.clones.shift();
			clone.traverse( ( part ) => {
				if ( part instanceof THREE.Mesh ) {
					new TWEEN.Tween({opacity:part.material.opacity})
					.to({opacity:0}, this.options.cloneLife*1000)
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
		// }.bind(this), this.options.cloneLife*1000);
	}

	update(data) {
		this.performer = data;
	}
}

module.exports = Cloner;