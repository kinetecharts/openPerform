import _ from 'lodash'

var THREE = require('three');

import WaterShader from '../shaders/WaterShader'
import config from './../config'

class WaterEnvironment {
	constructor(renderer, parent, guiFolder, type) {
		this.renderer = renderer;
		this.parent = parent;
		this.guiFolder = guiFolder;

		this.floorSize = 50;
		this.numLines = 50;

		this.gridFloor;
		this.hemiLight;
		this.dirLight;

		var f = this.guiFolder.addFolder("Grid");
		f.add(this, "floorSize", 1, 100).step(1).name("Size").onChange(this.redrawGrid.bind(this));
		f.add(this, "numLines", 1, 100).step(1).name("# Lines").onChange(this.redrawGrid.bind(this));

		this.colors = {
			light: {
				floor: 0x000000,
				background: 0xFFFFFF
			},
			dark: {
				floor: 0xFFFFFF,
				background: 0x000000,
			}
		};

		this.renderer.setClearColor( this.colors['light'].background );
        this.initLights();
		this.initFloor(this.floorSize, this.numLines, this.colors['light'].floor);

	}


	initFloor(floorSize, numLines, color) {

        var parameters = {
            width: 100,
            height: 100,
            widthSegments: 5,
            heightSegments: 5,
            depth: 300,
            param: 4,
            filterparam: 1
        };


        var grass = new THREE.TextureLoader().load( 'textures/grasslight-big.jpg' );
        grass.wrapS = grass.wrapT = THREE.RepeatWrapping;

        this.floorMat  = new THREE.MeshPhongMaterial( { color: 0x111111});//new THREE.MeshPhongMaterial( { color: 0xffffff, map: grass } );// new THREE.MeshLambertMaterial( { color: 0x666666, emissive: 0xff0000, shading: THREE.SmoothShading } );//

        var geometry = new THREE.SphereGeometry(500, 50, 50, 0, Math.PI * 2, 0, Math.PI/4);
        //geometry.scale.y = -2;


        this.floor = new THREE.Mesh(  geometry, this.floorMat );
        this.floor.receiveShadow = true;
        //this.floor.rotation.x = -Math.PI/2;
        this.floor.position.setY(-150);
        this.floor.scale.y = .3;
        this.floor.scale.x = 2.5;
        this.floor.scale.z = 2.5;



        //this.parent.add(this.floor);

        var waterNormals = new THREE.TextureLoader().load( 'textures/waternormals.jpg' );
        waterNormals.wrapS = waterNormals.wrapT = THREE.RepeatWrapping;

        this.water = new WaterShader( this.renderer, window.camera, this.parent, {
            textureWidth: 512,
            textureHeight: 512,
            waterNormals: waterNormals,
            alpha: 	1.0,
            sunDirection: this.light.position.clone().normalize(),
            sunColor: 0xffffff,
            waterColor: 0x001e0f,
            distortionScale: 50.0,
            fog: this.parent.fog != undefined
        } );


        var mirrorMesh = new THREE.Mesh(
            new THREE.PlaneBufferGeometry( parameters.width * 50, parameters.height * 50 ),
            this.water.material
        );

        mirrorMesh.add( this.water );
        mirrorMesh.rotation.x = - Math.PI * 0.5;
        mirrorMesh.position.setY(0.5);
        this.parent.add( mirrorMesh );


        // skybox

        var cubeMap = new THREE.CubeTexture( [] );
        cubeMap.format = THREE.RGBFormat;

        var loader = new THREE.ImageLoader();
        loader.load( 'textures/skyboxsun25degtest.png', function ( image ) {

            var getSide = function ( x, y ) {

                var size = 1024;

                var canvas = document.createElement( 'canvas' );
                canvas.width = size;
                canvas.height = size;

                var context = canvas.getContext( '2d' );
                context.drawImage( image, - x * size, - y * size );

                return canvas;

            };

            cubeMap.images[ 0 ] = getSide( 2, 1 ); // px
            cubeMap.images[ 1 ] = getSide( 0, 1 ); // nx
            cubeMap.images[ 2 ] = getSide( 1, 0 ); // py
            cubeMap.images[ 3 ] = getSide( 1, 2 ); // ny
            cubeMap.images[ 4 ] = getSide( 1, 1 ); // pz
            cubeMap.images[ 5 ] = getSide( 3, 1 ); // nz
            cubeMap.needsUpdate = true;

        } );

        var cubeShader = THREE.ShaderLib[ 'cube' ];
        cubeShader.uniforms[ 'tCube' ].value = cubeMap;

        var skyBoxMaterial = new THREE.ShaderMaterial( {
            fragmentShader: cubeShader.fragmentShader,
            vertexShader: cubeShader.vertexShader,
            uniforms: cubeShader.uniforms,
            depthWrite: false,
            side: THREE.BackSide
        } );

        this.skyBox = new THREE.Mesh(
            new THREE.BoxGeometry( 5000, 5000, 5000 ),
            skyBoxMaterial
        );

        this.parent.add( this.skyBox );
	}

	initLights(scene, camera) {
		this.hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		this.hemiLight.color.setHSL( 0.6250011825856442, 60.75949367088608, 30.980392156862745 );
		this.hemiLight.groundColor.setHSL( 4.190951334017909e-8, 33.68421052631579, 37.254901960784316 );
		this.hemiLight.position.set( 0, 500, 0 );
		//this.parent.add( this.hemiLight );

		this.dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
		this.dirLight.position.set( -1, 0.75, 1 );
		this.dirLight.position.multiplyScalar( 50);
		this.dirLight.name = 'dirlight';

		//this.parent.add( this.dirLight );

		this.dirLight.castShadow = true;

		this.dirLight.shadow.mapSize.width = this.dirLight.shadow.mapSize.height = 1024 * 2;

		var d = 300;

		this.dirLight.shadow.camera.left = -d;
		this.dirLight.shadow.camera.right = d;
		this.dirLight.shadow.camera.top = d;
		this.dirLight.shadow.camera.bottom = -d;

		this.dirLight.shadow.camera.far = 3500;
		this.dirLight.shadow.bias = -0.0001;
		this.dirLight.shadow.darkness = 0.35;

		this.dirLight.shadow.camera.visible = true;

        this.parent.add( new THREE.AmbientLight( 0x444444 ) );

        //

        this.light = new THREE.DirectionalLight( 0xffffbb, 1 );
        this.light.position.set( - 1, 1, - 1 );
        this.parent.add( this.light );
	}

	remove() {
		this.parent.remove( this.gridFloor );
		this.parent.remove( this.hemiLight );
		this.parent.remove( this.dirLight );

		this.guiFolder.removeFolder("Grid");
	}

	redrawGrid() {
		this.parent.remove( this.gridFloor );
		this.initFloor(this.floorSize, this.numLines);
	}

	update(timeDelta) {
		//put frame updates here.

        this.water.material.uniforms.time.value += 1.0 / 60.0;

        this.water.render();
	}
}

module.exports = WaterEnvironment;