import _ from 'lodash';

import WaterShader from '../shaders/WaterShader';
import OceanShader from '../shaders/OceanShader';
import Ocean from '../libs/ocean';
import config from './../config';

class WaterEnvironment {
  constructor(renderer, parent, guiFolder, type) {
    this.renderer = renderer;
    this.parent = parent;
    this.guiFolder = guiFolder;

    this.floorSize = 50;
    this.numLines = 50;
    this.distortionScale = 10.0;
    this.waves = 0.25;
    this.lastTime = 0;

    this.gridFloor;
    this.hemiLight;
    this.dirLight;

    this.colors = {
      light: {
        floor: 0x000000,
        background: 0xFFFFFF,
      },
      dark: {
        floor: 0xFFFFFF,
        background: 0x000000,
      },
    };

    this.renderer.setClearColor(this.colors.light.background);
    this.initLights();
    this.initFloor(this.floorSize, this.numLines, this.colors.light.floor);

    const f = this.guiFolder.addFolder('Water');
    f.add(this, 'waves', 0.1, 10).step(0.1).name('# Waves').listen();
    // f.add(this.ms_Ocean, "choppiness", 0, 10).step(1).name("# chopiness");
    f.add(this.parent.fog, 'density', 0, 0.1).step(0.0001).name('# fog');
  }

  initFloor(floorSize, numLines, color) {
    const parameters = {
      width: 100,
      height: 100,
      widthSegments: 5,
      heightSegments: 5,
      depth: 300,
      param: 4,
      filterparam: 1,
    };


    const grass = new THREE.TextureLoader().load('textures/grasslight-big.jpg');
    grass.wrapS = grass.wrapT = THREE.RepeatWrapping;

    this.floorMat = new THREE.MeshPhongMaterial({ color: 0x111111 });// new THREE.MeshPhongMaterial( { color: 0xffffff, map: grass } );// new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0xff0000, shading: THREE.SmoothShading } );//

    const geometry = new THREE.SphereGeometry(500, 50, 50, 0, Math.PI * 2, 0, Math.PI / 4);
    // geometry.scale.y = -2;


    this.floor = new THREE.Mesh(geometry, this.floorMat);
    this.floor.receiveShadow = true;
    // this.floor.rotation.x = -Math.PI/2;
    this.floor.position.setY(-150);
    this.floor.scale.y = 0.3;
    this.floor.scale.x = 2.5;
    this.floor.scale.z = 2.5;


    // this.parent.add(this.floor);

    const waterNormals = new THREE.TextureLoader().load('textures/waternormals.jpg');
    waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

    this.water = new WaterShader(this.renderer, window.camera, this.parent, {
      textureWidth: 512,
      textureHeight: 512,
      waterNormals,
      alpha: 1,
      sunDirection: this.light.position.clone().normalize(),
      sunColor: 0x5177ff,
      waterColor: 0x002d3a,
      distortionScale: 50.0,
      fog: this.parent.fog != undefined,
    });

    this.water.scale.y = 1;
    this.water.scale.z = 1;

    this.mirrorMesh = new THREE.Mesh(
      new THREE.PlaneBufferGeometry(parameters.width * 10, parameters.height * 10),
      this.water.material,
    );

    this.mirrorMesh.add(this.water);
    this.mirrorMesh.rotation.x = -Math.PI * 0.5;
    this.mirrorMesh.position.setY(0.05);
    this.parent.add(this.mirrorMesh);


    const gsize = 1024;
    const res = 1024;
    const gres = res / 2;
    const origx = -gsize / 2;
    const origz = -gsize / 2;


    // skybox

    // var cubeMap = THREE.ImageUtils.loadTextureCube([
    //     'textures/sleepyhollow/sleepyhollow_rt.jpg',
    //     'textures/sleepyhollow/sleepyhollow_lf.jpg',
    //     'textures/sleepyhollow/sleepyhollow_up.jpg',
    //     'textures/sleepyhollow/sleepyhollow_dn.jpg',
    //     'textures/sleepyhollow/sleepyhollow_bk.jpg',
    //     'textures/sleepyhollow/sleepyhollow_ft.jpg'
    // ]);
    // cubeMap.format = THREE.RGBFormat;
    // cubeMap.anisotropy = 0.1;

    const cubeMap = new THREE.CubeTexture([]);
    cubeMap.format = THREE.RGBFormat;

    const loader = new THREE.ImageLoader();
    loader.load('textures/newmoon.png', (image) => {
      const getSide = function (x, y) {
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

    const skyBoxMaterial = new THREE.ShaderMaterial({
      fragmentShader: cubeShader.fragmentShader,
      vertexShader: cubeShader.vertexShader,
      uniforms: cubeShader.uniforms,
      depthWrite: false,
      side: THREE.BackSide,
    });

    this.skyBox = new THREE.Mesh(new THREE.CubeGeometry(10000, 10000, 10000, 1, 1, 1, null, true), skyBoxMaterial);
    // this.skyBox.rotation.y = Math.PI ;
    // this.skyBox.position.setY(100);
    // this.skyBox.updateMatrix();
    // this.parent.fog.color = 0x171717;

    this.parent.add(this.skyBox);
  }

  initLights(scene, camera) {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.hemiLight.color.setHSL(0.6250011825856442, 60.75949367088608, 30.980392156862745);
    this.hemiLight.groundColor.setHSL(4.190951334017909e-8, 33.68421052631579, 37.254901960784316);
    this.hemiLight.position.set(0, 500, 0);
    // this.parent.add( this.hemiLight );

    this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
    this.dirLight.position.set(-1, 0.75, 1);
    this.dirLight.position.multiplyScalar(50);
    this.dirLight.name = 'dirlight';

    // this.parent.add( this.dirLight );

    this.dirLight.castShadow = true;

    this.dirLight.shadow.mapSize.width = this.dirLight.shadow.mapSize.height = 1024 * 2;

    const d = 300;

    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;

    this.dirLight.shadow.camera.far = 3500;
    this.dirLight.shadow.bias = -0.0001;
    this.dirLight.shadow.darkness = 0.35;

    this.dirLight.shadow.camera.visible = true;

    this.parent.add(new THREE.AmbientLight(0x444444));

    //

    this.light = new THREE.DirectionalLight(0xffffff, 1);
    this.light.position.set(-1, 0.75, 1);
    this.light.position.multiplyScalar(50);
    this.light.name = 'dirlight';

    // this.parent.add( this.dirLight );

    this.light.castShadow = true;
    this.parent.add(this.light);
  }

  remove() {
    this.parent.remove(this.light);
    this.parent.remove(this.mirrorMesh);
    this.parent.remove(this.skyBox);

    this.guiFolder.removeFolder('Water');
  }

  redrawGrid() {
    this.parent.remove(this.gridFloor);
    this.initFloor(this.floorSize, this.numLines);
    this.water.distortionScale = this.distortionScale;
  }

  updateParameters(data) {
    switch (data.parameter) {
      case 'waves':
        this.waves = data.value;
        break;
    }
  }

  update(timeDelta) {
    // put frame updates here.

    this.water.material.uniforms.time.value += this.waves / 60.0;
    this.water.render();

    // var currentTime = new Date().getTime();
    // this.ms_Ocean.deltaTime = (currentTime - this.lastTime) / 1000 || 0.0;
    // this.lastTime = currentTime;
    // this.ms_Ocean.render(this.ms_Ocean.deltaTime);
    // this.ms_Ocean.overrideMaterial = this.ms_Ocean.materialOcean;
    // if (this.ms_Ocean.changed) {
    //     this.ms_Ocean.materialOcean.uniforms.u_size.value = this.ms_Ocean.size;
    //     this.ms_Ocean.materialOcean.uniforms.u_sunDirection.value.set( this.ms_Ocean.sunDirectionX, this.ms_Ocean.sunDirectionY, this.ms_Ocean.sunDirectionZ );
    //     this.ms_Ocean.materialOcean.uniforms.u_exposure.value = this.ms_Ocean.exposure;
    //     this.ms_Ocean.changed = false;
    // }
    // this.ms_Ocean.materialOcean.uniforms.u_normalMap.value = this.ms_Ocean.normalMapFramebuffer.texture;
    // this.ms_Ocean.materialOcean.uniforms.u_displacementMap.value = this.ms_Ocean.displacementMapFramebuffer.texture;
    // this.ms_Ocean.materialOcean.uniforms.u_projectionMatrix.value = window.camera.projectionMatrix;
    // this.ms_Ocean.materialOcean.uniforms.u_viewMatrix.value = window.camera.matrixWorldInverse;
    // this.ms_Ocean.materialOcean.uniforms.u_cameraPosition.value = window.camera.position;
    // this.ms_Ocean.materialOcean.depthTest = true;
  }
}

module.exports = WaterEnvironment;
