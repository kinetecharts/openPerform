/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 05:49:29
 * @modify date 2018-08-26 05:49:29
 * @desc [The Movement Sculpture Effect creates a series of clones, merges their meshes and turns them into a downloable file.]
*/



import MovementSculptureMenu from '../../react/menus/effects/MovementSculptureMenu'

require('three/examples/js/exporters/GLTFExporter');
require('three/examples/js/exporters/OBJExporter');
require('three/examples/js/exporters/STLExporter');

import Common from './../../util/Common';
import config from './../../config';

class MovementSculpture {
  constructor(effectId, parent, color) {
    this.id = effectId;
    this.name = 'MovementSculpture';
    this.parent = parent;
    this.color = color;

    this.performer = null;
    this.clones = [];
    this.cloneInterval = null;
    this.recordTimeout = null;

    this.startingOpacity = 1;// 0.15;
    
    this.cloneSize = 1;
    this.playback = 0;

    // this.record = null;
    this.export = null;
    
    this.options = {
      recordLength: 3,
      maxClones: 6,
      type: 'gltf',
      types: ['gltf', 'obj', 'stl'],
    };
    this.options.cloneRate = this.options.recordLength / (this.options.maxClones - 1);

    this.showBoundingBox = false;
  }

  recordPerformer(val) {
    if (this.cloneInterval) {
      clearInterval(this.cloneInterval);
    }
    this.clonePerformer();
    this.cloneInterval = setInterval(this.clonePerformer.bind(this), 1000 * val);
    this.recordTimeout = setTimeout(this.stopCloning.bind(this), this.options.recordLength * 1000);
  }

  stopCloning() {
    if (this.cloneInterval) {
      clearInterval(this.cloneInterval);
    }
    if (this.recordTimeout) {
      clearTimeout(this.recordTimeout);
    }

    this.mergeClones();
  }

  record() {
    this.recordPerformer(this.options.cloneRate);
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
    this.playback += (this.options.cloneRate*(100/this.options.recordLength));
  }

  mergeClones() {
    var geo = new THREE.Geometry();

    // default material
    let material = new THREE.MeshPhongMaterial({
      color: 0xFFFFFF,
    });

    // merge performer geometries
    _.each(this.clones, (c) => {
      c.traverse((part) => {
        if (part instanceof THREE.Mesh) {
          if (part.geometry) {
            material = part.material;
            geo.merge(part.geometry, part.matrixWorld);
          }
        }
      });
      this.parent.remove(c);
    });

    // get geometry dimensions
    geo.computeBoundingBox();
    let bb = geo.boundingBox.clone();

    let w = bb.max.x - bb.min.x;
    let h = bb.max.y - bb.min.y;
    let d = bb.max.z - bb.min.z;

    // center performer geometry
    geo.applyMatrix(new THREE.Matrix4().makeTranslation(
      (-bb.min.x) - (w / 2),
      (-bb.min.y) - (h / 2),
      (-bb.min.z) - (d / 2),
    ));

    // add a cylinder base to performer geometry
    const baseHeight = 0.05;
    let base = new THREE.Mesh(
      new THREE.CylinderGeometry(w / 2, w / 2, baseHeight, 32),
      material,
    );

    base.geometry.applyMatrix(new THREE.Matrix4().makeTranslation(
      0,
      ((-bb.min.y) - (h / 2)) - (baseHeight / 2),
      0,
    ));

    geo.merge(base.geometry, base.matrixWorld);
    // end sculpture base

    geo.computeBoundingBox();
    bb = geo.boundingBox.clone();

    w = bb.max.x - bb.min.x;
    h = bb.max.y - bb.min.y;
    d = bb.max.z - bb.min.z;

    const sculpture = new THREE.Mesh(
      geo,
      material,
    );
    sculpture.position.y = (h / 2);
    this.parent.add(sculpture);

    // bounding box
    if (this.showBoundingBox) {
      const mesh = new THREE.Mesh(
        new THREE.BoxBufferGeometry(w, h, d),
        new THREE.MeshBasicMaterial({ wireframe: true }),
      );
      mesh.position.y = h / 2;
      this.parent.add(mesh);
    }
    // end bounding box

    switch (this.options.type) {
      default:
      case 'gltf':
        this.exportGLTF(sculpture);
        break;
      case 'obj':
        this.exportToObj(sculpture);
        break;
      case 'stl':
        this.exportToStl(sculpture);
        break;
    }
  }

  exportToStl(input) {
    const options = {
      binary: false,
    };
    const exporter = new THREE.STLExporter();
    if (options.binary) {
      this.saveArrayBuffer(exporter.parse(input, { binary: true }), 'op_sculpture.stl');
    } else {
      this.saveString(exporter.parse(input), 'op_sculpture.stl');
    }
  }

  exportToObj(input) {
    const exporter = new THREE.OBJExporter();
    this.saveString(exporter.parse(input), 'op_sculpture.obj');
  }

  exportGLTF(input) {
    const gltfExporter = new THREE.GLTFExporter();
    const options = {
      trs: false,
      onlyVisible: false,
      truncateDrawRange: false,
      binary: false,
      forceIndices: false,
      forcePowerOfTwoTextures: false,
    };
    gltfExporter.parse(input, (result) => {
      if (result instanceof ArrayBuffer) {
        this.saveArrayBuffer(result, 'op_sculpture.glb');
      } else {
        const output = JSON.stringify(result, null, 2);
        this.saveString(output, 'op_sculpture.gltf');
      }
    }, options);
  }

  save(blob, filename) {
    let link = document.createElement('a');
    link.style.display = 'none';
    document.body.appendChild(link); // Firefox workaround, see #6594
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
    return this;
  }

  saveString(text, filename) {
    this.save(new Blob([text], { type: 'text/plain' }), filename);
  }

  saveArrayBuffer(buffer, filename) {
    this.save(new Blob([buffer], { type: 'application/octet-stream' }), filename);
  }

  remove() {
    console.log('Deleting Movement Sculpture...');
    clearInterval(this.cloneInterval);
    _.each(this.clones, (clone) => {
      this.parent.remove(clone);
      clone = null;
    });
  }

  update(data, currentPose, distances) {
    this.performer = data;
  }

  // updated target list from gui
  updateParts(data) {
    this.targets = data;
    this.remove();
  }

  // updated options from gui
  updateOptions(data) {
    this.options = data;
    this.remove();
  }

  // returns react gui object when effect is selected
  getGUI() {
    return <MovementSculptureMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)}
      record={this.record.bind(this)}/>;
  }
}

module.exports = MovementSculpture;