import _ from 'lodash';
import TWEEN from 'tween';

import config from './../../config';

class Vogue {
  constructor(parent, color, guiFolder) {
    this.name = 'cloner';
    this.parent = parent;
    this.color = color;
    this.guiFolder = guiFolder;
    this.performer = null;
    this.clones = [];
    this.cloneInterval = null;
    this.lastClick = 0;
    this.clickCount = 0;

    this.startingOpacity = 1;// 0.15;
    this.cloneRate = 0.25;
    this.fadeDelay = 2;
    this.cloneLife = 2;// 1.25;
    this.cloneSize = 1;

    this.addToDatGui(this.guiFolder);

    // this.updateCloneRate(this.cloneRate);
  }

  updateCloneRate(val) {
    if (this.cloneInterval) {
      clearInterval(this.cloneInterval);
    }
    this.cloneInterval = setInterval(this.clonePerformer.bind(this), 1000 * val);
  }

  addToDatGui(guiFolder) {
    const f = guiFolder.addFolder('Vogue Cloner');
    const cloneButton = {
      add: function () {
        this.clonePerformer();
      }.bind(this),
    };
    f.add(cloneButton, 'add').name('Create Clone');
  }

  clonePerformer() {
    if (this.performer) {
      var clone = this.performer.clone();
      clone.visible = true;
      clone.scale.set(clone.scale.x * this.cloneSize, clone.scale.y * this.cloneSize, clone.scale.z * this.cloneSize);
      clone.traverse((part) => {
        if (part instanceof THREE.Mesh) {
          part.material = part.material.clone();
          part.material.opacity = this.startingOpacity;
          part.material.transparent = true;
        }
      });

      this.parent.add(clone);
      this.clones.push(clone);

      this.performer = null;
    }

    var clone = this.clones.shift();
    if (clone) {
      clone.traverse((part) => {
        if (part instanceof THREE.Mesh) {
          setTimeout(
            () => {
              new TWEEN.Tween({ opacity: part.material.opacity })
                .to({ opacity: 0 }, this.cloneLife * 1000)
                .onUpdate(function () {
                  part.material.opacity = this.opacity;
                })
                .onComplete(() => {
                  if (clone) {
                    this.parent.remove(clone);
                    clone = null;
                  }
                })
                .start();
            },
            this.fadeDelay * 1000,
          );
        }
      });
    }
  }

  remove() {
    console.log('Deleting cloner...');
    clearInterval(this.cloneInterval);
    _.each(this.clones, (clone) => {
      this.parent.remove(clone);
      clone = null;
    });
    this.guiFolder.removeFolder('Cloner');
  }

  updateParameters(data) {
    switch (data.parameter) {
    		case 'rate':
    			this.cloneRate = (data.value * 10) + 0.25;
    			this.updateCloneRate(this.cloneRate);
    			break;
    		case 'life':
        this.cloneLife = (data.value * 10) + 0.25;
    			break;
    	}
  }

  update(data) {
    this.performer = data;
  }
}

module.exports = Vogue;
