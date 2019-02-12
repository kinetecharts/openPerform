
import FileLoader from '../util/Loader.js';
import KidsRoomMenu from '../react/menus/environment/KidsRoomMenu';

class KidsRoomEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = "Kids Room";

    this.elements = [];
    this.lights = [];

    this.visible = true;

    this.options = {};

    this.loader = new FileLoader();

    // this.initSkybox();
    this.initSpace();
    this.initFloor(50);
    this.initLights();
    this.initMirror();  
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

    // this.toggleSkybox(val);
  }

  toggleSkybox(visible) {
    switch(visible) {
      case true:
        this.initSkybox();
        break;
      case false:
        this.parent.remove(this.skyBox);
        break;
    }
  }

  initSpace() {
    this.loader.loadGLTF('../models/environments/kids_room/scene.gltf', {}, (gltf) => {
      this.gltf = gltf;
      window.gltf = this.gltf.scene;
      this.gltf.scene.traverse((child) => {
        // console.log(child);
        switch (child.type) {
          default:
            break;
          case 'Mesh':
            if (child.material.color.r.toFixed(1) == 0.8
              && child.material.color.g.toFixed(1) == 0.8
              && child.material.color.b.toFixed(1) == 0.8) {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0x30312D),
                flatShading:true
              });
            } else if (child.material.color.r == 1
              && child.material.color.g == 0
              && child.material.color.b == 0) {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0xC0320C),
                flatShading:true,
                // transparent: true,
                // opacity: 0.75,
              });
            } else if (child.material.color.r.toFixed(1) == 0.3
            && child.material.color.g.toFixed(1) == 0.8
            && child.material.color.b.toFixed(1) == 0.7) {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0xDC900E),
                flatShading:true
              });
            } else if (child.material.color.r.toFixed(1) == 0.0
            && child.material.color.g == 1
            && child.material.color.b.toFixed(1) == 0.5) {
              child.material = new THREE.MeshPhongMaterial({
                color: new THREE.Color(0xDED20E),
                flatShading:true
              });
            } else {
              child.material = new THREE.MeshPhongMaterial({
                color: child.material.color,
                flatShading:true
              });
            }
            
            if (child.name.indexOf('Circle00') > -1) { child.visible = false; }
            child.castShadow = true;
            child.receiveShadow = true;
            break;
        }
      });

      gltf.scene.scale.set(0.05, 0.05, 0.05);

      gltf.scene.position.x = -0.39;
      gltf.scene.position.y = -1.78;
      gltf.scene.position.z = 25.6;

      gltf.scene.rotation.y = 14.75;


      if (this.gltf.animations.length > 0) {
        this.gltf.clock = new THREE.Clock();
        this.gltf.mixer = new THREE.AnimationMixer(this.gltf.scene);
        let clip = this.gltf.mixer.clipAction(gltf.animations[0]);
        clip.loop = THREE.LoopPingPong;
        clip.play();

        // clip.startAt(3).play();
        // setTimeout(() => {
        //   clip.paused = true;
        // }, 1000);
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
        new THREE.CubeGeometry(10, 10, 10, 1, 1, 1, null, true),
        new THREE.ShaderMaterial({
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide,
        }),
    );

    this.parent.add(this.skyBox);
    // this.elements.push(this.skyBox);
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
    // window.verticalMirror = verticalMirror;
    verticalMirror.position.y = 1.25;
    verticalMirror.position.z = 5;
    this.parent.add(verticalMirror);
    this.elements.push(verticalMirror);
  }

  initFloor(size) {
    this.floor = new THREE.Mesh(
      new THREE.PlaneBufferGeometry( size, size, 1 ),
      new THREE.MeshPhongMaterial({ color:0xead184, opacity: 1 })
    );
    // window.floor = this.floor;
    this.floor.position.y = -1.0875;
    this.floor.position.z = 15;
    this.floor.rotation.x = -Math.PI/2;
    this.floor.receiveShadow = true;

    this.elements.push(this.floor);
    this.parent.add(this.floor);
  }

  // initLights() {
  //   const directionalLight = new THREE.DirectionalLight(0xFFFFFF, 0.75);

  //   directionalLight.position.set(1, 2, 0);
  //   let lightTarget = new THREE.Object3D();
  //   this.parent.add(lightTarget);
  //   lightTarget.position.set(0, 0, 20);
  //   directionalLight.target = lightTarget
  //   directionalLight.castShadow = true;

  //   directionalLight.shadow.mapSize.width = 512;  // default
  //   directionalLight.shadow.mapSize.height = 512; // default
  //   directionalLight.shadow.camera.near = 0.5;    // default
  //   directionalLight.shadow.camera.far = 500;     // default

  //   var helper = new THREE.DirectionalLightHelper(directionalLight, 5);
  //   this.parent.add(helper);

  //   this.lights.push(directionalLight);
  //   this.parent.add(directionalLight);

  //   let hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x797979, 0.7);

  //   this.lights.push(hemiLight);
  //   this.parent.add(hemiLight);
  // }

  initLights() {
    const hemiLight = new THREE.HemisphereLight( 0xFFFFFF, 0xFFFFFF, 0.6 );
    hemiLight.groundColor.setHSL( 0, 0, 0 );
    hemiLight.position.set( 1, 1.5, 0 );
    // hemiLight.position.multiplyScalar( 30 );
    this.parent.add( hemiLight );

    // const hemiLightHelper = new THREE.HemisphereLightHelper( hemiLight, 10 );
    // this.parent.add( hemiLightHelper );
    //
    const dirLight = new THREE.DirectionalLight( 0xFFFFFF, 0.95 );
    // dirLight.color.setHSL( 0.95, 0.95, 0.95 );
    dirLight.position.set( 1, 1.5, 0 );
    // dirLight.position.multiplyScalar( 30 );
    this.parent.add( dirLight );

    let lightTarget = new THREE.Object3D();
    this.parent.add(lightTarget);
    lightTarget.position.set(0, 0, 5);
    dirLight.target = lightTarget;
    dirLight.castShadow = true;
    
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    
    var d = 50;
    dirLight.shadow.camera.left = - d;
    dirLight.shadow.camera.right = d;
    dirLight.shadow.camera.top = d;
    dirLight.shadow.camera.bottom = - d;
    dirLight.shadow.camera.far = 3500;
    dirLight.shadow.bias = 0.000;
    
    // const dirLightHeper = new THREE.DirectionalLightHelper( dirLight, 10 );
    // this.parent.add( dirLightHeper );
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
    return <KidsRoomMenu data={this.options}
      updateOptions={this.updateOptions.bind(this)}/>;
  }
}

module.exports = KidsRoomEnvironment;
