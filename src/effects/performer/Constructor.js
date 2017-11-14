import _ from 'lodash';
import TWEEN from 'tween';

import config from './../../config';

class Constructor {
  constructor(parent, color, guiFolder) {
    this.name = 'constructor';
    this.parent = parent;
    this.color = color;
    this.guiFolder = guiFolder;
    this.gui = null;
    this.performer = null;
    this.clones = [];
    this.cloneInterval = null;
    this.recordTimeout = null;

    this.startingOpacity = 1;// 0.15;
    
    this.recordLength = 3;
    this.maxClones = 6;

    this.cloneRate = this.recordLength/this.maxClones;
    
    this.cloneSize = 1;
    this.playback = 0;

    this.record = null;
    this.export = null;

    this.addToDatGui(this.guiFolder);
  }

  recordPerformer(val) {
    if (this.cloneInterval) {
      clearInterval(this.cloneInterval);
    }
    this.cloneInterval = setInterval(this.clonePerformer.bind(this), 1000 * val);
    this.recordTimeout = setTimeout(this.stopCloning.bind(this), this.recordLength*1000);
  }

  stopCloning() {
    if (this.cloneInterval) {
      clearInterval(this.cloneInterval);
    }
    if (this.recordTimeout) {
      clearTimeout(this.recordTimeout);
    }

    this.record.name("Start Recording");
    this.record.playing = false;
  }

  addToDatGui(guiFolder) {
    this.gui = guiFolder.addFolder('Constructor');
    const p = this.gui.add(this, 'playback', 0, 100).name("Record Timer").listen();
    p.domElement.style.pointerEvents = "none"
    this.gui.add(this, 'recordLength', 1, 5).name("Record Length");
    this.gui.add(this, 'maxClones', 0, 25).name("Number of Steps");
    const recordButton = {
      record: function () {
        if (this.record.playing == true) {
          this.stopCloning();
          this.record.name("Start Recording");
          this.record.playing = false;
          this.playback = 0;
        } else {
          this.recordPerformer(this.cloneRate);
          this.record.name("Stop Recording");
          this.record.playing = true;
        }
      }.bind(this),
    };
    this.record = this.gui.add(recordButton, 'record').name('Start Recording');
    this.gui.open();
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

      // if (!this.export) {
      //   const exportButton = {
      //     export: function () {
      //       console.log("export");
      //     }.bind(this),
      //   };
      //   this.export = this.gui.add(exportButton, 'export').name('Export');
      // }

      if (!this.merge) {
        const mergeButton = {
          merge: function () {
            this.mergeClones();
          }.bind(this),
        };
        this.merge = this.gui.add(mergeButton, 'merge').name('Merge Clones');
      }
    }
    this.playback += (this.cloneRate*(100/this.recordLength));
  }

  mergeClones() {
    // var geo = new THREE.Geometry();
    // _.each(this.clones, (c) => {
    //   c.traverse((part) => {
    //     if (part instanceof THREE.Mesh) {
    //       if (part.geomertry) {
    //         geo.merge(part.geomertry);
    //       }
    //     }
    //   });
    //   this.parent.remove(c);
    // });
    // var sculpture = new THREE.Mesh(geo, new THREE.MeshPhongMaterial());
    // this.parent.add(sculpture);
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

  // updateParameters(data) {
  //   switch (data.parameter) {
  //       case 'rate':
  //         this.cloneRate = (data.value * 10) + 0.25;
  //         this.updateCloneRate(this.cloneRate);
  //         break;
  //     }
  // }

  update(data) {
    this.performer = data;
  }
}

module.exports = Constructor;
