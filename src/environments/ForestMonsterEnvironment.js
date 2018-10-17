/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 03:46:15
 * @modify date 2018-10-03 15:54:15
 * @desc [description]
*/

import FileLoader from '../util/Loader.js';
import SpaceMenu from '../react/menus/environment/SpaceMenu';

class ForestMonsterEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = "Forest Monster";

    this.elements = [];
    this.lights = [];

    this.visible = true;

    this.options = {};

    this.loader = new FileLoader();

    this.initSkybox();
    this.initSpace();
    // this.initFloor(25);
    this.initLights();
    this.initMirror();
    this.initShadowFloor(100);

  }

  initShadowFloor(size) {
    this.shadowFloor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( size, size, 1 ),
      new THREE.ShadowMaterial({ opacity: 0.9 })
    );
    this.shadowFloor.rotation.x = -Math.PI/2;
    this.shadowFloor.position.z = 16;
    this.shadowFloor.position.y = -0.8999999999999999;
    this.shadowFloor.receiveShadow = true;
    this.parent.add(this.shadowFloor);
    this.elements.push(this.shadowFloor);
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
    this.lights.forEach((light) => {
      light.visible = val;
    });
  }

  initLights() {
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.65);

    window.directionalLight = directionalLight;
    directionalLight.position.set(0, 2, 0);
    let lightTarget = new THREE.Object3D();
    this.parent.add(lightTarget);
    lightTarget.position.set(0, 0, 20);
    directionalLight.target = lightTarget
    directionalLight.castShadow = true;

    // let targetObj = new THREE.Object3D();
    // targetObj.position.set(0, 1.75, 0);
    // directionalLight.target = targetObj;
    // this.parent.add(directionalLight.target);

    directionalLight.shadow.mapSize.width = 512;  // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5;    // default
    directionalLight.shadow.camera.far = 500;     // default

    // var helper = new THREE.DirectionalLightHelper(directionalLight, 5);
    // this.parent.add(helper);

    this.lights.push(directionalLight);
    this.parent.add(directionalLight);

    let hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x797979, 0.75);

    this.lights.push(hemiLight);
    this.parent.add(hemiLight);
  }

  initMirror() {
    const w = 1920/250;
    const h = 1080/250;
    var geo = new THREE.PlaneBufferGeometry( w * 2, h * 2 );
    let overflow = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({color:0xFFFFFF}));
    overflow.position.z = -0.1;
    this.parent.add(overflow);
    this.elements.push(overflow);

    var geometry = new THREE.PlaneBufferGeometry( w, h );
    var verticalMirror = new THREE.Reflector( geometry, {
      // clipBias: 0.003,
      textureWidth: $('#scenes').width() * window.devicePixelRatio,
      textureHeight: $('#scenes').height() * window.devicePixelRatio,
      color: 0x889999,
      recursion: 1
    } );
    window.verticalMirror = verticalMirror;
    verticalMirror.position.y = 1.25;
    verticalMirror.position.z = 5;
    this.parent.add(verticalMirror);
    this.elements.push(verticalMirror);
  }

  initSpace() {
    this.loader.loadGLTF('../models/environments/alien/scene.gltf', {}, (gltf) => {
      this.gltf = gltf;
      window.gltf = this.gltf.scene;
      
      this.gltf.scene.traverse((child) => {
        // console.log(child);
        switch (child.type) {
          default:
            break;
          case 'Mesh':
            // child.material.transparent = true;
            // child.material.opacity = 0.25;
            child.castShadow = true;
            child.receiveShadow = true;
            break;
        }
      });

      gltf.scene.scale.set(20, 20, 20);
      gltf.scene.position.set(-7.699999999999992, 35.4, 66.1);
      gltf.scene.rotation.set(-0.01, 28.270796326794898, 0.03);

      if (this.gltf.animations.length > 0) {
        this.gltf.clock = new THREE.Clock();
        this.gltf.mixer = new THREE.AnimationMixer(this.gltf.scene);
        this.gltf.mixer.clipAction(gltf.animations[0]).play();
      }
      
      this.elements.push(gltf.scene);
      this.parent.add(gltf.scene);
    });
  }

  initSkybox() {
    const cubeMap = new THREE.CubeTexture([]);
    cubeMap.format = THREE.RGBFormat;

    this.loader.loadImage('textures/de38ad4f55903add2fdbe290bcc6ef79.png', {}, (image) => {
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
        new THREE.CubeGeometry(25, 25, 25, 1, 1, 1, null, true),
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
      new THREE.MeshPhongMaterial({ color:0x797979, opacity: 0.9 })
    );
    this.floor.position.z = 10;
    this.floor.position.y = 0.0125;
    this.floor.rotation.x = -Math.PI/2;
    this.floor.receiveShadow = true;

    this.elements.push(this.floor);
    this.parent.add(this.floor);
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
    if (this.gltf && this.gltf.mixer) { this.gltf.mixer.update(this.gltf.clock.getDelta()); }
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

module.exports = ForestMonsterEnvironment;
