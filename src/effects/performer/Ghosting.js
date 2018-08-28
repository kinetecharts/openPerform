/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 11:01:16
 * @modify date 2018-08-26 11:01:16
 * @desc [The Ghosting Effect creates a full body clone of a performer and fades it out over time.]
*/

import React from 'react';

import GhostingMenu from '../../react/effects/GhostingMenu';

class Ghosting {
  constructor(effectId, parent, color) {
    this.id = effectId;
    this.name = 'ghosting';
    this.parent = parent;
    this.color = color;

    this.performer = null;
    this.clones = [];
    this.trailInterval = null;

    this.options = {
      rate: 0.25,
      life: 1.25,
      size: 1,
      isPlaying: true,
      opacity: 0.15,
    };

    // start with cloner enabled
    if (this.options.isPlaying == true) {
      this.startCloning(this.options);
    }
  }

  // create the cloning timer
  startCloning(options) {
    if (this.trailInterval) {
      clearInterval(this.trailInterval);
    }
    this.trailInterval = setInterval(this.clonePerformer.bind(this, options), 1000 * options.rate);
  }

  // remove the cloning timer
  stopCloning() {
    if (this.trailInterval) {
      clearInterval(this.trailInterval);
    }
  }

  clonePerformer(options) {
    // console.lo g('----clonePerformer----', options);
    if (this.performer) {
      var clone = this.performer.clone(); // copy existing peformer model / object
      clone.scale.set(clone.scale.x * options.size, clone.scale.y * options.size, clone.scale.z * options.size);
      clone.traverse((part) => { // prepare material for fade out
        if (part instanceof THREE.Mesh) {
          part.castShadow = false;
          part.receiveShadow = false;
          part.material = part.material.clone();
          part.material.opacity = options.opacity;
          part.material.transparent = true;
        }
      });

      this.parent.add(clone); // add clone to scene
      this.clones.push(clone); // add clone to tracked array

      this.performer = null; // clean up exsting performer reference
    }

    var clone = this.clones.shift();
    if (clone) {
      clone.traverse((part) => { // fade out clone material over time
        if (part instanceof THREE.Mesh) {
          new TWEEN.Tween({ opacity: part.material.opacity })
            .to({ opacity: 0 }, options.life * 1000)
            .onUpdate(function() {
              part.material.opacity = this.opacity;
            })
            .onComplete(() => {
              if (clone) {
                this.parent.remove(clone);
                clone = null;
              }
            })
            .start();
        }
      });
    }
  }

  // remove effect / clean up objects, timers, etc
  remove() {
    console.log('Deleting Ghosts...');
    clearInterval(this.trailInterval);
    _.each(this.clones, (clone) => {
      this.parent.remove(clone);
      clone = null;
    });
  }

  // render call, passes existing performer data
  update(data, currentPose, distances) {
    this.performer = data;
  }

  // updated options from gui
  updateOptions(data) {
    this.options = data;

    if (this.options.isPlaying) {
      this.startCloning(this.options);
    } else {
      this.stopCloning();
    }
  }

  // returns react gui object when effect is selected
  getGUI() {
    return <GhostingMenu data={this.options} updateOptions={this.updateOptions.bind(this)} />;
  }
}

module.exports = Ghosting;