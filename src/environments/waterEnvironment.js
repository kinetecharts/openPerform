/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 12:20:02
 * @modify date 2018-09-02 12:49:51
 * @desc [description]
*/

import WaterShader from '../shaders/WaterShader';
import FileLoader from '../util/Loader';
import WaterMenu from '../react/menus/environment/WaterMenu';

class WaterEnvironment {
  constructor(renderer, parent, performers, defaults) {
    this.renderer = renderer;
    this.parent = parent;
    this.performers = performers;
    this.defaults = defaults;

    this.name = 'Water';

    this.elements = [];
    this.lights = [];
    this.visible = true;

    this.loader = new FileLoader();

    this.dirLight = null;
    this.water = null;
    this.mirrorMesh = null;

    this.initLights();

    this.options = {
        sunColor: '#5177FF',
        waterColor: '#002D3A',
        distortionScale: 10.0,
        waves: 0.25,
    };

    this.initFloor(this.options);
    }

    initFloor(options) {
        this.removeElements();

        // load water normals
        this.loader.loadTexture('textures/waternormals.jpg', {}, (waterNormals) => {
            let wn = waterNormals;
            wn.wrapS = THREE.RepeatWrapping;
            wn.wrapT = THREE.RepeatWrapping;

            this.water = new WaterShader(this.renderer, window.camera, this.parent, {
                textureWidth: 512,
                textureHeight: 512,
                alpha: 1,
                waterNormals: wn,
                sunDirection: this.dirLight.position.clone().normalize(),
                sunColor: new THREE.Color(options.sunColor).getHex(),
                waterColor: new THREE.Color(options.water).getHex(),
                distortionScale: options.distortionScale,
                fog: this.parent.fog !== undefined,
            });

            this.mirrorMesh = new THREE.Mesh(
                new THREE.PlaneBufferGeometry(1000, 1000),
                this.water.material,
            );

            this.elements.push(this.water);
            this.mirrorMesh.add(this.water);

            this.mirrorMesh.rotation.x = -Math.PI * 0.5;
            this.mirrorMesh.position.setY(0.05);

            this.elements.push(this.mirrorMesh);

            this.parent.add(this.mirrorMesh);
        });

        const gsize = 1024;
        const res = 1024;

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

    initLights(scene, camera) {
        this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
        this.dirLight.position.set(-1, 0.75, 1);
        this.dirLight.position.multiplyScalar(50);
        this.dirLight.name = 'dirlight';

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

        this.ambLight = new THREE.AmbientLight(0x444444);
        this.lights.push(this.ambLight);
        this.parent.add(this.ambLight);

        this.dirLight = new THREE.DirectionalLight(0xffffff, 1);
        this.dirLight.position.set(-1, 0.75, 1);
        this.dirLight.position.multiplyScalar(50);
        this.dirLight.name = 'dirlight';

        this.dirLight.castShadow = true;
        this.lights.push(this.dirLight);
        this.parent.add(this.dirLight);
    }

    setColor(color) {
        this.renderer.setClearColor(color);
    }

    toggleVisible(val) {
        this.setVisible(!this.getVisible());
    }

    getVisible() {
        return this.visible;
    }

    setVisible(val) {
        this.visible = val;
        this.elements.forEach((element) => {
            element.visible = val;
        });
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
        this.removeElements();
        this.removeLights();
    }

    update(timeDelta) {
        // put frame updates here.

        if (this.water) {
            this.water.material.uniforms.time.value += this.options.waves / 60.0;
            this.water.render();
        }
    }

    // updated options from gui
    updateOptions(data) {
        this.options = data;
        this.initFloor(this.options);
    }

    // returns react gui object when effect is selected
    getGUI() {
        return <WaterMenu data={this.options}
            updateOptions={this.updateOptions.bind(this)} />;
    }
}

module.exports = WaterEnvironment;
