'use strict'


import _ from 'lodash'
import $ from 'jquery'

var ARUtils = require("./three.ar.js");

class AR {
	constructor(renderer, camera, parent, controls) {
		this.renderer = renderer;
		this.camera = camera;
		this.parent = parent;
		this.controls = controls;

		this.events = {};

		this.debug = true;
		this.arDebugger = null;

		this.vrDisplay = null;
		this.arView = null;
		this.reticle = null;

		// this.checkForAR();
	}

	init() {
		if (this.debug) {
			this.enableDebugging();
		}

		this.arView = new THREE.ARView(this.vrDisplay, this.renderer);

		this.camera = new THREE.ARPerspectiveCamera(this.vrDisplay, 60, window.innerWidth / window.innerHeight, 0.01, 100);

		// VRControls is a utility from three.js that applies the device's
		// orientation/position to the perspective camera, keeping our
		// real world and virtual world in sync.
		this.controls = new THREE.VRControls(this.camera);

		window.addEventListener('resize', this.onWindowResize.bind(this), false);
  		this.renderer.domElement.addEventListener('touchstart', this.onClick.bind(this), false);

  		// this.initCube();
  		this.addReticle();
	}

	addReticle() {
		this.reticle = new THREE.ARReticle(this.vrDisplay,
			0.03, // innerRadius
			0.04, // outerRadius
			0xff0077, // color
			0.25); // easing
		this.parent.add(this.reticle);
	}

	initCube() {
		// Create the cube geometry and add it to the scene. Set the position
		// to (Infinity, Infinity, Infinity) so that it won't appear visible
		// until the first hit is found, and move it there
		var geometry = new THREE.BoxGeometry(BOX_SCALE, BOX_SCALE, BOX_SCALE);
		var faceIndices = ['a', 'b', 'c'];
		for (var i = 0; i < geometry.faces.length; i++) {
			var f  = geometry.faces[i];
			for (var j = 0; j < 3; j++) {
				var vertexIndex = f[faceIndices[ j ]];
				f.vertexColors[j] = colors[vertexIndex];
			}
		}
		var material = new THREE.MeshBasicMaterial({ vertexColors: THREE.VertexColors });
		this.cube = new THREE.Mesh(geometry, material);

		// Place the cube very far to initialize
		this.cube.position.set(10000, 10000, 10000);
	}

	onWindowResize () {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	onClick() {
		console.log("fuck!");
		// If we don't have a touches object, abort
		// TODO: is this necessary?
		if (!e.touches[0]) {

			return;
		}

		// Inspect the event object and generate normalize screen coordinates
		// (between 0 and 1) for the screen position.
		var x = e.touches[0].pageX / window.innerWidth;
		var y = e.touches[0].pageY / window.innerHeight;

		// Send a ray from the point of click to the real world surface
		// and attempt to find a hit. `hitTest` returns an array of potential
		// hits.
		var hits = this.vrDisplay.hitTest(x, y);

		// If a hit is found, just use the first one
		if (hits && hits.length) {
			var hit = hits[0];
			// Use the `placeObjectAtHit` utility to position
			// the cube where the hit occurred
			THREE.ARUtils.placeObjectAtHit(this.cube,  // The object to place
			                           hit,   // The VRHit object to move the cube to
			                           true, // Whether or not we also apply orientation
			                           1);    // Easing value from 0 to 1; we want to move
			                                  // the cube directly to the hit position
		}
	}

	enableDebugging() {
		this.arDebugger = new THREE.ARDebug(this.vrDisplay);
		document.body.appendChild(this.arDebugger.getElement());
	}

	disableDebugging() {
		document.body.removeChild(this.arDebugger.getElement());
		this.arDebugger = null;
	}

	checkForAR() {
		THREE.ARUtils.getARDisplay().then(function (display) {
			if (display) {
				this.vrDisplay = display;
				this.init();
			} else {
				THREE.ARUtils.displayUnsupportedMessage();
			}
		}.bind(this));
	}

	update() {

		if (this.reticle) {
			this.reticle.update(0.5, 0.5);
		}

		if (this.camera) {
			this.camera.updateProjectionMatrix();
		}

		if (this.controls) {
			// Update our perspective camera's positioning
			this.controls.update();
		}
		if (this.arView) {
			// Render the device's camera stream on screen
			this.arView.render();
		}
	}

	on(name, callback) {
		this.events[name] = callback;
	}

	trigger(name, data) {
		if (this.events[name]) {
			this.events[name](data);
		} else {
			console.log('No one is listening to ' + name + '. :(');
		}
	}
}

export default AR