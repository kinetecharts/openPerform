import _ from 'lodash';

require('./../libs/three/SkyShader.js');

import config from './../config';

class GradientEnvironment {
  constructor(renderer, parent, performers, guiFolder) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.guiFolder = guiFolder;

    this.hemiLight;
    this.dirLight;

    this.floor;
    this.floorMat;

    this.turbidity = 1;
    this.rayleigh = 0.3;
    this.mieCoefficient = 0;
    this.mieDirectionalG = 0.53;
    this.luminance = 1;
    this.inclination = 0.31; // elevation / inclination
    this.azimuth = 0.25; // Facing front,
    this.sun = true;

    this.skyGroup;
    this.sky;
    this.sunSphere;

    const f = this.guiFolder.addFolder('Gradient');
    f.add(this, 'turbidity', 1.0, 20.0, 0.1).onChange(this.guiChanged.bind(this));
    f.add(this, 'rayleigh', 0.0, 4, 0.001).onChange(this.guiChanged.bind(this));
    f.add(this, 'mieCoefficient', 0.0, 0.1, 0.001).onChange(this.guiChanged.bind(this));
    f.add(this, 'mieDirectionalG', 0.0, 1, 0.001).onChange(this.guiChanged.bind(this));
    f.add(this, 'luminance', 0.0, 2).onChange(this.guiChanged.bind(this));
    f.add(this, 'inclination', 0, 1, 0.0001).onChange(this.guiChanged.bind(this));
    f.add(this, 'azimuth', 0, 1, 0.0001).onChange(this.guiChanged.bind(this));
    f.add(this, 'sun').onChange(this.guiChanged.bind(this));

    this.initLights();
    this.initFloor();
    this.initSky();

    this.guiChanged();
  }

  initLights() {
    this.hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
    this.hemiLight.groundColor.setHSL(0.095, 1, 0.75);
    this.hemiLight.position.set(0, 500, 0);
    this.parent.add(this.hemiLight);

    this.dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
    this.parent.add(this.dirLight);

    this.dirLight.castShadow = true;

    this.dirLight.shadow.mapSize.width = 2048;
    this.dirLight.shadow.mapSize.height = 2048;

    const d = 50;

    this.dirLight.shadow.camera.left = -d;
    this.dirLight.shadow.camera.right = d;
    this.dirLight.shadow.camera.top = d;
    this.dirLight.shadow.camera.bottom = -d;

    this.dirLight.shadow.camera.far = 10000;
    this.dirLight.shadow.bias = -0.0001;
  }

  initFloor() {
    this.floorMat = new THREE.MeshPhongMaterial({ color: 0xf26d54 });

    this.floor = new THREE.Mesh(new THREE.PlaneGeometry(9000, 9000, 6, 6), this.floorMat);
    this.floor.receiveShadow = true;
    this.floor.rotation.x = -Math.PI / 2;

    this.parent.add(this.floor);

    return this.floor;
  }

  initSky() {
    this.skyGroup = new THREE.Object3D();

    // Add Sky Mesh
    this.sky = new THREE.Sky();
    this.sky.mesh.scale.set(0.0001, 0.0001, 0.0001);
    this.skyGroup.add(this.sky.mesh);

    // Add Sun Helper
    this.sunSphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry(20000, 16, 8),
      new THREE.MeshBasicMaterial({ color: 0xffffff }),
    );
    this.sunSphere.position.y = -700000;
    this.sunSphere.visible = false;
    this.skyGroup.add(this.sunSphere);

    this.parent.add(this.skyGroup);

    return this.skyGroup;
  }

  remove() {
    this.parent.remove(this.floor);
    this.parent.remove(this.hemiLight);
    this.parent.remove(this.dirLight);
    this.parent.remove(this.skyGroup);

    this.guiFolder.removeFolder('Gradient');
  }

  guiChanged() {
    const uniforms = this.sky.uniforms;
    uniforms.turbidity.value = this.turbidity;
    uniforms.rayleigh.value = this.rayleigh;
    uniforms.luminance.value = this.luminance;
    uniforms.mieCoefficient.value = this.mieCoefficient;
    uniforms.mieDirectionalG.value = this.mieDirectionalG;

    const theta = Math.PI * (this.inclination - 0.5);
    const phi = 2 * Math.PI * (this.azimuth - 0.5);

    const distance = 9000;

    this.sunSphere.position.x = distance * Math.cos(phi);
    this.sunSphere.position.y = distance * Math.sin(phi) * Math.sin(theta);
    this.sunSphere.position.z = distance * Math.sin(phi) * Math.cos(theta);

    this.sunSphere.visible = this.sun;

    this.sky.uniforms.sunPosition.value.copy(this.sunSphere.position);

    this.dirLight.position.copy(this.sunSphere.position);
  }

  toggle(variableName) {
    if (this.toggles[variableName]) {
      this.toggles[variableName] = !this.toggles[variableName];
    }
  }

  updateParameters(data) {
    	console.log('Updating environment parameter: ', data);
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = GradientEnvironment;
