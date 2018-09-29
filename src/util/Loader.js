require('three/examples/js/loaders/DDSLoader.js');
require('three/examples/js/loaders/MTLLoader.js');
require('three/examples/js/loaders/BVHLoader.js');
require('three/examples/js/loaders/FBXLoader.js');
require('three/examples/js/loaders/OBJLoader.js');
require('three/examples/js/loaders/ColladaLoader.js');
require('three/examples/js/loaders/GLTFLoader.js');
require('three/examples/js/loaders/STLLoader.js');
require('three/examples/js/loaders/TGALoader.js');

import FBXLoader from 'three-fbxloader-offical';

const sceneLoader = require('../libs/three/loaders/SceneLoader');

class Loader {
  constructor() {
    this.debug = false;
  }

  loadTGA(url, props, cb) {
    new THREE.TGALoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadJSON(url, props, cb) {
    new THREE.JSONLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadGLTF(url, props, cb) {
    new THREE.GLTFLoader().load(url, (result) => { cb(result, props); }, this.onError);
  }

  loadOBJ(url, props, cb) {
    let objLoader = new THREE.OBJLoader(new THREE.LoadingManager());
    if (props.materials) {
      objLoader.setMaterials(props.materials);
    }
    objLoader.load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadBVH(url, props, cb) {
    new THREE.BVHLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadFBX(url, props, cb) {
    new FBXLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadFBX2(url, props, cb) {
    new THREE.FBXLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadCollada(url, props, cb) {
    new THREE.ColladaLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadScene(url, props, cb) {
    new THREE.SceneLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadImage(url, props, cb) {
    new THREE.ImageLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadTexture(url, props, cb) {
    new THREE.TextureLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadMTL(url, props, cb) {
    THREE.Loader.Handlers.add(/\.dds$/i, new THREE.DDSLoader());
    new THREE.MTLLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  loadSTL(url, props, cb) {
    new THREE.STLLoader().load(url, (result) => { cb(result, props); }, this.onProgress, this.onError);
  }

  onProgress(xhr) {
    if (xhr.lengthComputable && this.debug) {
      const percentComplete = (xhr.loaded / xhr.total) * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  }

  onError(err) {
    // if (this.debug) {
      console.error('An error happened.', err);
    // }
  }
}

module.exports = Loader;