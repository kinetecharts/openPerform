

var ARUtils = require("./ar/three.ar.js");

import Environments from './../environments'

class ARScene {
	constructor() {
		this.vrDisplay = null;
		this.arDebug = null;
		this.renderer = null;
		this.canvas = null;
		this.scene = null;
		this.arView = null;
		this.camera = null;
		this.reticle = null;
		this.vrControls = null;
		this.environments = null;
		this.stats = null;

		this.statsEnabled = null;
		this.performers = null;
	}

	initScene(statsEnabled, performers) {
		this.statsEnabled = statsEnabled;
		this.performers = performers;
		this.checkForAR();
	}

	init() {
		// Turn on the debugging panel
		this.arDebug = new THREE.ARDebug(this.vrDisplay);
		document.body.appendChild(this.arDebug.getElement());

		// Setup the three.js rendering environment
		this.renderer = new THREE.WebGLRenderer({ alpha: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		this.renderer.autoClear = false;
		this.canvas = this.renderer.domElement;
		document.body.appendChild(this.canvas);
		this.scene = new THREE.Scene();

		// Creating the ARView, which is the object that handles
		// the rendering of the camera stream behind the three.js
		// scene
		this.arView = new THREE.ARView(this.vrDisplay, this.renderer);

		// The ARPerspectiveCamera is very similar to THREE.PerspectiveCamera,
		// except when using an AR-capable browser, the camera uses
		// the projection matrix provided from the device, so that the
		// perspective camera's depth planes and field of view matches
		// the physical camera on the device.
		this.camera = new THREE.ARPerspectiveCamera(this.vrDisplay, 60, window.innerWidth / window.innerHeight, 0.01, 100);

		// Create our ARReticle, which will continuously fire `hitTest` to trace
		// the detected surfaces
		this.reticle = new THREE.ARReticle(this.vrDisplay,
			0.03, // innerRadius
			0.04, // outerRadius
			0xff0077, // color
			0.25); // easing
		this.scene.add(this.reticle);

		// VRControls is a utility from three.js that applies the device's
		// orientation/position to the perspective camera, keeping our
		// real world and virtual world in sync.
		this.vrControls = new THREE.VRControls(this.camera);

		this.environments = new Environments(this.renderer, this.scene, this.performers);
		window.environments = this.environments;

		this.stats = new Stats();
		if (this.statsEnabled) {
			this.stats.dom.id = "stats";
			$('#statsBox').append( this.stats.dom );
		}

		// Bind our event handlers
		window.addEventListener('resize', this.onWindowResize.bind(this), false);
		this.update();
	}

	checkForAR() {
		/**
		* Use the `getARDisplay()` utility to leverage the WebVR API
		* to see if there are any AR-capable WebVR VRDisplays. Returns
		* a valid display if found. Otherwise, display the unsupported
		* browser message.
		*/
		THREE.ARUtils.getARDisplay().then(function (display) {
			if (display) {
				this.vrDisplay = display;
				this.init();
			} else {
				THREE.ARUtils.displayUnsupportedMessage();
			}
		});
	}

	update() {
		// Render the device's camera stream on screen first of all.
		// It allows to get the right pose synchronized with the right frame.
		this.arView.render();

		// Update our camera projection matrix in the event that
		// the near or far planes have updated
		this.camera.updateProjectionMatrix();

		// Update our ARReticle's position, and provide normalized
		// screen coordinates to send the hit test -- in this case, (0.5, 0.5)
		// is the middle of our screen
		this.reticle.update(0.5, 0.5);

		// Update our perspective camera's positioning
		this.vrControls.update();

		if (this.performer) {
			this.performer.update(this.clock.getDelta());
		}

		if (this.environments) {
			this.environments.update(this.clock.getDelta());
		}

		if (this.stats) {
			this.stats.update();
		}

		// Render our three.js virtual scene
		this.renderer.clearDepth();
		this.renderer.render(this.scene, this.camera);

		if (this.render) {
			requestAnimationFrame(this.render.bind(this));
		}
	}

		/**
		* On window resize, update the perspective camera's aspect ratio,
		* and call `updateProjectionMatrix` so that we can get the latest
		* projection matrix provided from the device
		*/
	onWindowResize () {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}
}

export default ARScene;