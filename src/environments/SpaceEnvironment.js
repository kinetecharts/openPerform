/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:46:15
 * @modify date 2018-09-02 03:46:15
 * @desc [description]
*/

import FileLoader from '../util/Loader.js';
import SpaceMenu from '../react/menus/environment/SpaceMenu';

class SpaceEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = "Space";

    this.elements = [];
    this.lights = [];

    this.visible = true;

    this.options = {};

    this.loader = new FileLoader();

    this.initSkybox();
    // this.initSpace();
    this.initLights();
  }

  toggleVisible(val) {
    this.setVisible(!this.getVisible());
  }

  getVisible() {
    return this.visible;
  }

  setVisible(val) {
    // console.log(val);
    this.visible = val;
    this.elements.forEach((element) => {
      element.visible = val;
    });
  }

  initSpace() {
    this.loader.loadGLTF('../models/environments/moon/moon.gltf', {}, (gltf) => {
      const s = 0.2;
      gltf.scene.scale.set(s, s, s);
      // window.gltf = gltf.scene;
      gltf.scene.position.y = -14.75;
      
      this.elements.push(gltf.scene);
      this.parent.add(gltf.scene);
    });
  }

  initSkybox() {
    const cubeMap = new THREE.CubeTexture([]);
    cubeMap.format = THREE.RGBFormat;

    this.loader.loadImage('textures/newmoon.png', {}, (image) => {
        const getSide = (x, y) => {
            const size = 1024;

            const canvas = document.createElement('canvas');
            canvas.width = size;
            canvas.height = size;

            const context = canvas.getContext('2d');
            context.drawImage(image, -x * size, -y * size);

            return canvas;
        };

        cubeMap.images[0] = getSide(2, 1); // px
        cubeMap.images[1] = getSide(0, 1); // nx
        cubeMap.images[2] = getSide(1, 0); // py
        cubeMap.images[3] = getSide(1, 2); // ny
        cubeMap.images[4] = getSide(1, 1); // pz
        cubeMap.images[5] = getSide(3, 1); // nz
        cubeMap.needsUpdate = true;
    });

    const cubeShader = THREE.ShaderLib.cube;
    cubeShader.uniforms.tCube.value = cubeMap;

    this.skyBox = new THREE.Mesh(
        new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1, null, true),
        new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide,
        }),
    );

    this.parent.add(this.skyBox);
    this.elements.push(this.skyBox);
  }

  initFloor(size) {
    this.floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( size, size, 1 ),
      new THREE.ShadowMaterial({ opacity: 0.9 })
    );
    this.floor.rotation.x = -Math.PI/2;
    this.floor.receiveShadow = true;

    this.elements.push(this.floor);
    this.parent.add(this.floor);
  }

  initLights() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.75);

    directionalLight.position.set( -5, 10, 10 );
    directionalLight.castShadow = true;

    directionalLight.shadow.mapSize.width = 512;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 500;     // default

    this.lights.push(directionalLight);
    this.parent.add(directionalLight);
  }

  removeElements() {
    this.elements.forEach((element) => {
      this.parent.remove(element);
    });
  }

  removeLights() {
    this.lights.forEach((light) => {
      this.parent.remove(light);
    });
  }

  remove() {
    this.removeLights();
    this.removeElements();
  }

  update(timeDelta) {
    // put frame updates here.
  }
  
  // updated options from gui
  updateOptions(data) {
    this.options = data;
    this.remove();
  }

  // returns react gui object when effect is selected
  getGUI() {
    return <SpaceMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)}/>;
  }
}

module.exports = SpaceEnvironment;
