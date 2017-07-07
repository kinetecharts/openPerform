var THREE = require('three');

import $ from 'jquery'
import TWEEN from 'tween'
import _ from 'lodash'

var OrbitControls = require('three-orbit-controls')(THREE);

import Common from './../util/Common'

import DepthDisplay from './displayComponents/DepthDisplay'
import CameraControl from './../camera/cameraControl'
import Environments from './../environments'

// import VR from './vr/vr.js'

class Scene {
	constructor() {
		this.renderer = null;
		this.scene = null;
		this.camera = null;
		this.controls = null;

		this.container;
		this.w;
		this.h;

		this.stats = null;

		this.vr = null;

		this.environments = null;
	}
	initScene(startPos, inputs, statsEnabled, performers) {
		this.container = $('#scenes');

		this.w = this.container.width();
		this.h = this.container.height();

		/// Global : this.renderer
		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		
		this.renderer.setClearColor( 0x000000 );
		this.renderer.setSize( this.w, this.h );

		this.renderer.shadowMap.enabled = true;
		// to antialias the shadow
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

		/// Global : this.scene
		this.scene = new THREE.Scene();
		window.scene = this.scene;

        this.scene.fog = new THREE.FogExp2( 0x171223, 0.00075 , 10000);
        //this.scene.fog = new THREE.FogExp2( 0x0C0F15, 0.0075 , 100);

		/// Global : this.camera
		this.camera = new THREE.PerspectiveCamera( 20, this.w / this.h, 0.1, 1000000 );

		window.camera = this.camera;

		// var src = Common.convertLatLonToVec3(startPos.lat, startPos.lon).multiplyScalar(radius);
		
		// this.camera.position.copy(src);
		this.camera.position.set( 0, 0.5, 16 );
		// this.camera.lookAt(new THREE.Vector3(0,1000,0));

		this.scene.add( this.camera );

		this.environments = new Environments(this.renderer, this.scene, performers);
		window.environments = this.environments;

		//orbit control
		this.controls = new OrbitControls(this.camera)

		this.controls.enableDamping = false;
		this.controls.enableZoom = (inputs.indexOf("mouse")>=0);
		this.controls.enableRotate = (inputs.indexOf("mouse")>=0);
		this.controls.enablePan = (inputs.indexOf("mouse")>=0);
		
		this.controls.autoRotate = false;
		this.controls.autoRotateSpeed = 3;
		
		this.controls.enableKeys = false;
		
		this.stats = new Stats();
		if (statsEnabled) {
			this.stats.dom.id = "stats";
			$('#statsBox').append( this.stats.dom );
		}

		//attach this.renderer to DOM
		this.container.append( this.renderer.domElement );

		this.clock = new THREE.Clock();
		
		this.cameraControl = new CameraControl(this.scene, this.camera, this.controls);

		// this.vr = new VR(this.renderer, this.camera, this.scene, this.controls);

		//initiating renderer
		this.render();

		window.addEventListener( 'resize', this.onWindowResize.bind(this), false );
	}

	toggleRotation() {
		this.controls.autoRotate = !this.controls.autoRotate;
	}

	setRotation() {
		this.controls.autoRotate = true;
	}

	unsetRotation() {
		this.controls.autoRotate = false;
	}

	setRotationSpeed(val) {
		this.controls.autoRotateSpeed = val;
	}

	switchEnvironment(env) {
		if (this.environments) {
			console.log("Switching Environment to: " + env);
			this.environments.add(env);
		}
	}

	viewKinectTransportDepth(depthObj) {
		var imgWidth = 512; var imgHeight = 424; //width and hight of kinect depth camera

		if (!this.kinectPC) { //create point cloud depth display if one doesn't exist
			var dimensions = {width: imgWidth, height: imgHeight, near: 58, far: 120}
			this.kinectPC = new DepthDisplay(this.scene, dimensions, 30, false);
		}

		// this.kinectPC.moveSlice();
		this.kinectPC.updateDepth('kinecttransport', depthObj.depth.buffer.data);
		this.kinectPC.updateColor('kinecttransport', depthObj.depth.buffer.data);
	}

	viewKinectTransportBodies(bodiesObj) {
		// console.log(bodiesObj.bodies.trackingIds.length);
		var bodies = bodiesObj.bodies.bodies;
		if (!this.bodies) {
			this.bodies = {};
		}

		_.each(bodies, function(body, idx){
			// body.id;
			if(!this.bodies[idx]) {
				this.bodies[idx] = new Performer(this.scene, idx);
			}

			this.bodies[idx].updateJoints(body.joints);
		}.bind(this));
	}

	render() {
		this.controls.update();
		TWEEN.update();

		if (this.performer) {
			this.performer.update(this.clock.getDelta());
		}

		if (this.environments) {
			this.environments.update(this.clock.getDelta());
		}

		this.cameraControl.update();

		// if (this.vr) {
		// 	this.vr.update();
		// }

		this.renderer.render( this.scene, this.camera );

		this.stats.update();

		requestAnimationFrame(this.render.bind(this));
	}

	onWindowResize() {
		this.controls.update();

		this.w = this.container.width();
		this.h = this.container.height();
		
		this.camera.aspect = this.w / this.h;
		this.camera.updateProjectionMatrix();
		
		this.renderer.setSize( this.w, this.h );
	}
}

export default Scene;