var THREE = require('three');

import $ from 'jquery'
import TWEEN from 'tween'
import _ from 'lodash'

import CoordinateTZ from 'coordinate-tz';

import TrackballControls from './../libs/three/controls/TrackballControls.js'

import Globe from './features/globe'
import Earth from './features/earth'
import Buildings from './features/buildings'
import Places from './features/places'
import Pois from './features/pois'
import Roads from './features/roads'
// import Earth from './features/earth'
import Landuse from './features/landuse'
import Transit from './features/transit'
import Water from './features/water'
// import Sky from './features/sky'


import VR from './vr/vr'

import DepthDisplay from './displayComponents/DepthDisplay'

import CameraControl from './camera/cameraControl'

import Common from './../util/Common'

class Scene {
	constructor() {
		this.renderer = null;
		this.scene = null;
		this.camera = null;
		this.controls = null;

		this.container;
		this.w;
		this.h;

		this.pts = [];
		this.layers = [];

		this.stats = null;

		this.prevLocation = '';
		this.prevTimezone = '';
	}
	initScene(startPos, radius, inputs, statsEnabled) {
		this.container = $('#scenes');

		this.w = this.container.width();
		this.h = this.container.height();

		/// Global : this.renderer
		this.renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
		
		this.renderer.setClearColor( 0x333 );
		this.renderer.setSize( this.w, this.h );

		this.renderer.shadowMap.enabled = true;
		// to antialias the shadow
		this.renderer.shadowMap.type = THREE.PCFSoftShadowMap

		/// Global : this.scene
		this.scene = new THREE.Scene();
		window.scene = this.scene;

		/// Global : this.camera
		this.camera = new THREE.PerspectiveCamera( 20, this.w / this.h, 0.1, 200000 );

		window.camera = this.camera;

		// var src = Common.convertLatLonToVec3(startPos.lat, startPos.lon).multiplyScalar(radius);
		
		// this.camera.position.copy(src);
		this.camera.position.set( 0, 0.5, 16 );
		// this.camera.lookAt(new THREE.Vector3(0,1000,0));


		var floorSize = 50;

		this.gridFloor = new THREE.GridHelper( floorSize/2, 50 );
		this.gridFloor.castShadow = true;
		this.gridFloor.receiveShadow = true;

		this.scene.add( this.gridFloor );

		this.scene.add( this.camera );

		this.initLights(this.scene, this.camera);

		this.controls = new THREE.TrackballControls( this.camera, this.renderer.domElement );

		this.controls.rotateSpeed = 1.0;
		this.controls.zoomSpeed = 1.2;
		this.controls.panSpeed = 0.8;
		this.controls.noZoom = false;
		this.controls.noPan = false;
		this.controls.staticMoving = true;
		this.controls.dynamicDampingFactor = 0.3;


		this.stats = new Stats();
		if (statsEnabled) {
			this.stats.dom.id = "stats";
			$('#statsBox').append( this.stats.dom );
		}

		//attach this.renderer to DOM
		this.container.append( this.renderer.domElement );

		this.clock = new THREE.Clock();
		
		this.cameraControl = new CameraControl(this.scene, this.camera, this.controls);

		this.vr = new VR(this.renderer, this.camera, this.scene, this.controls);

		//initiating renderer
		this.render();

		window.addEventListener( 'resize', this.onWindowResize, false );
	}

	initLights(scene, camera) {
		var hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
		hemiLight.color.setHSL( 0.6250011825856442, 60.75949367088608, 30.980392156862745 );
		hemiLight.groundColor.setHSL( 4.190951334017909e-8, 33.68421052631579, 37.254901960784316 );
		hemiLight.position.set( 0, 500, 0 );
		scene.add( hemiLight );

		var dirLight = new THREE.DirectionalLight( 0xffffff, 1 );
		dirLight.position.set( -1, 0.75, 1 );
		dirLight.position.multiplyScalar( 50);
		dirLight.name = 'dirlight';

		this.scene.add( dirLight );

		dirLight.castShadow = true;

		dirLight.shadow.mapSize.width = dirLight.shadow.mapSize.height = 1024 * 2;

		var d = 300;

		dirLight.shadow.camera.left = -d;
		dirLight.shadow.camera.right = d;
		dirLight.shadow.camera.top = d;
		dirLight.shadow.camera.bottom = -d;

		dirLight.shadow.camera.far = 3500;
		dirLight.shadow.bias = -0.0001;
		dirLight.shadow.darkness = 0.35;

		dirLight.shadow.camera.visible = true;
		// this.sky = new Sky(this.map);
		// this.layers.push(this.sky);
	}

	flyTo(lat, lon, radius, look, cb) {
		// this.controls.autoRotate = false;
		$('.globeDonutBox').fadeOut();
		$('.globalCallDisplay > div.numberDisplayBox > div.smallCube').fadeOut();

		var trg = Common.convertLatLonToVec3(lat,lon).multiplyScalar(radius);
		
		this.cameraControl.fly_to(
			trg,
			new THREE.Vector3(0,0,0),
			look,
			TWEEN.Easing.Quadratic.InOut,
			'path',
			3000,
			radius,
			cb
		);
	}

	toggleRotation() {
		this.controls.autoRotate = !this.controls.autoRotate;
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

	updateTiles(datas, origin, area, allowedLayers, colorScheme) {
		var allowedLayer = null;

		var features = this.gatherFeatures(datas, origin);		
		console.log(features);
		
		for (var featureType in features) {
			switch (featureType) { //buildings, places, pois, roads, earth, landuse, transit, water
			case 'buildings':
				allowedLayer = _.filter(allowedLayers, function(layer) {return layer.featureType == featureType});
				if (allowedLayer.length > 0) {
					this.layers.push(new Buildings(
						features[featureType].geometries,
						allowedLayer[0].drawType,
						colorScheme['buildings'],
						this.map,
						origin
					)); //shapes, segments, geo, buffer
				}
				break;
			case 'places':
				allowedLayer = _.filter(allowedLayers, function(layer) {return layer.featureType == featureType});
				if (allowedLayer.length > 0) {
					this.layers.push(new Places(
						features[featureType].geometries,
						allowedLayer[0].drawType,
						colorScheme['places'],
						this.map,
						origin
					)); //shapes, segments, geo, buffer
				}
				break;
			case 'pois':
				allowedLayer = _.filter(allowedLayers, function(layer) {return layer.featureType == featureType});
				if (allowedLayer.length > 0) {
					this.layers.push(new Pois(
						features[featureType].geometries,
						allowedLayer[0].drawType,
						colorScheme['pois'],
						this.map,
						origin
					)); //shapes, segments, geo, buffer
				}
				break;
			case 'roads':
				allowedLayer = _.filter(allowedLayers, function(layer) {return layer.featureType == featureType});
				if (allowedLayer.length > 0) {
					this.layers.push(new Roads(
						features[featureType].geometries,
						allowedLayer[0].drawType,
						colorScheme['roads'],
						this.map,
						origin
					)); //shapes, segments, geo, buffer
				}
				break;
			case 'earth':
				allowedLayer = _.filter(allowedLayers, function(layer) {return layer.featureType == featureType});
				if (allowedLayer.length > 0) {
					this.layers.push(new Earth(
						features[featureType].geometries,
						allowedLayer[0].drawType,
						colorScheme['earth'],
						this.map,
						origin
					)); //shapes, segments, geo, buffer
				}
				break;
			case 'landuse':
				allowedLayer = _.filter(allowedLayers, function(layer) {return layer.featureType == featureType});
				if (allowedLayer.length > 0) {
					this.layers.push(new Landuse(
						features[featureType].geometries,
						allowedLayer[0].drawType,
						colorScheme['landuse'],
						this.map,
						origin
					)); //shapes, segments, geo, buffer
				}
				break;
			case 'transit':
				allowedLayer = _.filter(allowedLayers, function(layer) {return layer.featureType == featureType});
				if (allowedLayer.length > 0) {
					this.layers.push(new Transit(
						features[featureType].geometries,
						allowedLayer[0].drawType,
						colorScheme['transit'],
						this.map,
						origin
					)); //shapes, segments, geo, buffer
				}
				break;
			case 'water':
				allowedLayer = _.filter(allowedLayers, function(layer) {return layer.featureType == featureType});
				if (allowedLayer.length > 0) {
					this.layers.push(new Water(
						features[featureType].geometries,
						allowedLayer[0].drawType,
						colorScheme['water'],
						this.map,
						origin
					)); //shapes, segments, geo, buffer
				}
				// this.layers[featureType].position(new THREE.Vector3(0, 0, 0.1));
				break;
			}
		}
	}

	gatherFeatures(datas) {
		var f = {};
		_.each(datas, function(data) {
			var location = data.location;
			// console.log(location);
			var tile = data.tile;
			for (var featureType in tile) {
				if (tile[featureType].features) {
					if (tile[featureType].features.length > 0) {
						if (f[featureType] == undefined) {
							f[featureType] = {
								features:[], 
								geometries:[]
							};
						}

						f[featureType].features.push(tile[featureType].features);

						_.each(tile[featureType].features, function(feature) {
							if (f[featureType].geometries[feature.geometry.type + 's'] == undefined) {
								f[featureType].geometries[feature.geometry.type + 's'] = [];
							}
							f[featureType].geometries[feature.geometry.type + 's'].push({
								coordinates: feature.geometry.coordinates, 
								location: location, 
								properties: feature.properties
							});
						});
					}
				}
			}
		});
		return f;
	}

	shuffleLayers() {
		this.layers = _.shuffle(this.layers);
	}

	randomSpread(amt) {
		this.shuffleLayers();
		this.spreadLayers(amt);
	}

	toggle(name) {
		_.each(this.layers, function(layer) {
			if (layer.name == name) {
				layer.toggle();
			}
		});
	}

	spreadLayers(amt) {
		var total = this.layers.length * amt;
		var z = total / 2;
		_.each(this.layers, function(layer, idx) {
			layer.tween = new TWEEN.Tween({z:layer.draw_object.position.z})
			.to({z:z}, 600)
			.onUpdate(function() {
				layer.position(new THREE.Vector3(0, 0, this.z));
			})
			.delay(idx * 50)
			.start();
			z -= amt;
		});
	}

	hide() {
		_.each(this.layers, function(layer) {
			layer.hide();
		});
	}

	show() {
		_.each(this.layers, function(layer) {
			layer.show();
		});
	}

	render() {
		this.controls.update();
		TWEEN.update();

		if(this.globe){
			this.globe.update(this.clock.getElapsedTime());
		}

		if(this.earth){
			this.earth.update(this.clock.getElapsedTime());
		}

		if (this.performer) {
			this.performer.update(this.clock.getDelta());
		}

		if (this.vr) {
			this.vr.update();
		}

		this.renderer.render( this.scene, this.camera );

		this.stats.update();

		requestAnimationFrame(this.render.bind(this));
	}

	onWindowResize() {
		this.w = this.container.width();
		this.h = this.container.height();
		
		this.camera.aspect = this.w / this.h;
		this.camera.updateProjectionMatrix();
		
		this.renderer.setSize( this.w, this.h );
	}
}

export default Scene;