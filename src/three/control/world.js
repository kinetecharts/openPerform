

class WorldState {
	constructor(camera, defaultDistanceScale) {
		this.panningScale = 10;
		this.spine = 1;
		this.rotation = 0;
		this.distance = 0;
		this.time = {value: 0};
		this.clock = new THREE.Clock();
		this.camera = camera;
		this.world = 0;
		this.scale = 100;
		this.defaultDistanceScale = 100;//defaultDistanceScale;
		this.resolution = { value: new THREE.Vector2(window.innerWidth, window.innerHeight) };
		
		document.addEventListener('mousemove', this.onMouseMove, false);
	}

	getAngle(position) {
		return Math.atan2(position.y, position.z);
	}

	setSky(sky) {
		this.sky = sky;
	}

	setCamera(camera) {
		this.camera = camera;
		this.scale = this.camera.position.length();
		this.rotation = this.getAngle(this.camera.position);
		this.defaultDistance = this.camera.position.length();
	}

	onMouseMove(event) {
		// var x = event.clientX - window.innerWidth / 2;
		// var y = event.clientY - window.innerHeight / 2;

		//scope.updateRotation(Math.atan2(x, y));
		//scope.updateDistance(Math.sqrt(x*x + y*y)/window.innerWidth*2);
	}

	setMyos(myos) {
		this.myos = myos;

		// console.log(Myo);
		// Myo.on('fist', function(name){
		//   console.log("hello, fist!");
		// });

		// Myo.on('pose', function(name){
		//     switch(name) {
		//       case 'fist':
		//         console.log("fist");
		//         scope.updateWorld(0);
		//       break;

		//       case 'wave_out':
		//         console.log("wave_out");
		//         scope.updateWorld(1);
		//       break;

		//       case 'fingers_spread':
		//         console.log("fingers_spread");
		//         scope.updateWorld(2);
		//       break;
		//     } 
		//   });

	}

	setKinect(kt) {
		this.kinect = kt;
	}

	updateRotation(rotation) {
		// console.log('ro', rotation);
		/*if (rotation < -Math.PI) {
			rotation = (-rotation-Math.PI)-Math.PI;
		}
		if (rotation > 0) {
			rotation = -rotation;
		}*/
		if (rotation > 0) {
			rotation = -rotation;
		}
		if (rotation < -Math.PI / 2) {
			rotation = -Math.PI - rotation;
		}
		this.rotation = rotation;
	}

	updateDistance(distance) {
		this.distance = distance;
	}

	updateSpine(spine) {
		this.spine = spine;
	}

	updateWorld(world) {
		if (this.myos && this.sky) { 
			this.world = world;

			this.sky.changeMaterial(this.world);
			
			switch (world) {
			case 0:
				this.myos.vibrate('short');
				break;
			case 1:
				this.myos.vibrate('medium');
				break;
			case 2:
				this.myos.vibrate('long');
				break;
			}
		}
	}

	update() {
		var delta = this.clock.getDelta() * this.spine;
		this.time.value += delta;

		var y = this.camera.position.y;
		var z = this.camera.position.z;
		var length = Math.sqrt(z * z + y * y);
		var angle = this.rotation;
	
		this.camera.position.y = length * (Math.sin(angle));
		this.camera.position.z = length * (Math.cos(angle));

		this.camera.lookAt(new THREE.Vector3(0, 0, 0));
		
		if (this.distance) {
			var scale = this.distance / this.camera.position.length() * this.defaultDistance;
			
			this.camera.position.x *= scale;
			this.camera.position.y *= scale;
			this.camera.position.z *= scale;
		}
	}
}

export default WorldState;




