require('three/examples/js/loaders/OBJLoader.js');
require('three/examples/js/loaders/DDSLoader.js');
require('three/examples/js/loaders/MTLLoader.js');
require('three/examples/js/loaders/BVHLoader.js');
require('three/examples/js/loaders/FBXLoader.js');
require('three/examples/js/loaders/OBJLoader.js');
require('three/examples/js/loaders/ColladaLoader.js');

const sceneLoader = require('../libs/three/loaders/SceneLoader');

class Loader {
  constructor() {
    this.debug = false;
  }

  loadMTL(url, cb) {
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    new THREE.MTLLoader().load(url, cb, this.onProgress, this.onError);
  }

  loadOBJ(url, props, cb) {
    let objLoader = new THREE.OBJLoader(new THREE.LoadingManager());
    if (props.materials) {
      objLoader.setMaterials(materials);
    }
    objLoader.load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadImage(url, cb) {
    new THREE.ImageLoader().load(url, cb, this.onProgress, this.onError);
  }

  loadTexture(url, props, cb) {
    new THREE.TextureLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadBVH(url, cb) {
    new THREE.BVHLoader().load(url, cb, this.onProgress, this.onError);
  }

  loadFBX(url, props, callback) {
    new THREE.FBXLoader(new THREE.LoadingManager()).load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadCollada(url, props, cb) {
    new THREE.ColladaLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadScene(url, props, cb) {
    new THREE.SceneLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  onProgress(xhr) {
    if (xhr.lengthComputable && this.debug) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  }

  onError(err) {
    if (this.debug) {
      console.error('An error happened.');
    }
  }
}

module.exports = Loader;