var THREE = require('three');
import TWEEN from 'tween'

import AnimateAlongSpline from './animations/animateAlongSpline'

class CameraControl{
	constructor(scene, camera, controls){
		this.scene = scene;
		this.camera = camera;
		this.controls = controls;

		this.cameraTween = null;
		this.cameraFocus = null;

		this.isAnimating = false;

		this.allowOverwrite = true;

		this.centerCam = null;
		this.posCamera = null;

		this.trackingObj = null;
	}

	pause() {
		if (this.cameraTween && this.cameraFocus) {
			this.cameraTween.stop();
			this.cameraFocus.stop();
			this.isAnimating = false;
		}
	}

	resume() {
		if (this.cameraTween && this.cameraFocus) {
			this.cameraTween.start();
			this.cameraFocus.start();
			this.isAnimating = true;
		}
	}

	stop() {
		if (this.cameraTween && this.cameraFocus) {
			this.cameraTween.stop();
			this.cameraFocus.stop();
			this.cameraTween = null;
			this.cameraFocus = null;
			this.centerCam = null;
			this.posCamera = null;
			this.isAnimating = false;
		}
	}

	zoom(zoomDistance, direction, transition_speed) {
		if (this.isAnimating && !this.allowOverwrite) {
			return;
		}
		else if (this.allowOverwrite){
			this.stop();
		}

		switch (direction) {
			case "in":
				zoomDistance = -Math.abs(zoomDistance);
			break;
			case "out":
				zoomDistance = Math.abs(zoomDistance);
			break;
		}

		this.fly_direct(this.controls.object.position.clone().add(new THREE.Vector3(0,this.zoomDistance,0)), new THREE.Vector3(0,0,0), {
	      	focus: this.controls.target.clone().add(new THREE.Vector3(0,this.zoomDistance,0)),
	      	duration: this.transition_speed,
	      	easing: TWEEN.Easing.Cubic.Out
	    });
	}

	pan(panDistance, direction, transition_speed) {
		if (this.isAnimating && !this.allowOverwrite) {
			return;
		}
		else if (this.allowOverwrite){
			this.stop();
		}
		
		switch (direction) {
			case "left":
				panDistance = Math.abs(panDistance);
			break;
			case "right":
				panDistance = -Math.abs(panDistance);
			break;
		}

		this.fly_direct(this.controls.object.position.clone().add(new THREE.Vector3(0,0,panDistance)), new THREE.Vector3(0,0,0), {
	      	focus: this.controls.target.clone().add(new THREE.Vector3(0,0,panDistance)),
	      	duration: transition_speed,
	      	easing: TWEEN.Easing.Cubic.Out
	    });
	}

	push(pushDistance, direction, transition_speed) {
		if (this.isAnimating && !this.allowOverwrite) {
			return;
		}
		else if (this.allowOverwrite){
			this.stop();
		}
		
		switch (direction) {
			case "in":
				pushDistance = -Math.abs(pushDistance);
			break;
			case "out":
				pushDistance = Math.abs(pushDistance);
			break;
		}

	    this.fly_direct(this.controls.object.position.clone().add(new THREE.Vector3(pushDistance,0,0)), new THREE.Vector3(0,0,0), {
	      	focus: this.controls.target.clone().add(new THREE.Vector3(pushDistance,0,0)),
	      	duration: transition_speed,
	      	easing: TWEEN.Easing.Cubic.Out
	    });
	}

	fly_to(targetPos, offset, lookAt, easing, type, transition_speed, arcHeight, callback){
		if (this.isAnimating && !this.allowOverwrite) {
			return false;
		}
		else if (this.allowOverwrite){
			this.stop();
		}

		//to prevent shaking camera bug
		var dTo = this.camera.position.clone().distanceTo(targetPos.clone().add(offset));
		if (dTo < 1) {
			this.stop();
			return false;
		}

		this.trackingObj = null;

		switch(type) {
			case "direct":
				this.fly_direct(targetPos, offset, lookAt, {
			      	focus: targetPos,
			      	duration: transition_speed,
			      	easing: easing
			    },
			    callback);
			break;
			case "top":
				this.fly_direct(targetPos, offset, lookAt, {
			      	focus: targetPos,
			      	duration: transition_speed,
			      	easing: easing
			    },
			    callback);
			break;
			case "front":
				this.fly_direct(targetPos, offset, lookAt, {
			      	focus: targetPos,
			      	duration: transition_speed,
			      	easing: easing
			    },
			    callback);
			break;
			case "path":
				this.fly_arc(targetPos, offset, lookAt, {
			      	arcHeight: arcHeight,
					visible:false,
					focus: targetPos,
					duration:transition_speed,
					easing:easing
			    },
			    callback);
			break;
		}
	}

	fly_direct(targetPos, offset, lookAt, params, callback) {
		if (this.isAnimating && !this.allowOverwrite) {
			return;
		}
		else if (this.allowOverwrite){
			this.stop();
		}
		
		var scope = this;
		scope.posCamera = scope.controls.object.position.clone();

		// camera location
		this.cameraTween = new TWEEN.Tween(scope.posCamera)
			.to(targetPos.clone().add(offset), params.duration)
			.onUpdate(function(){
				// scope.controls.object.up.x = -1;
				// scope.controls.object.up.z = 0;
				scope.controls.object.position.copy(scope.posCamera);
				scope.isAnimating = true;
			})
			.easing(params.easing)
			.onComplete(function(){
				scope.isAnimating = false;
				scope.cameraTween = null;
				callback();
			})
		.start();

		// camera focus
		scope.centerCam = scope.controls.target.clone();
		this.cameraFocus = new TWEEN.Tween(scope.centerCam)
			.to(params.focus, params.duration)
			.onUpdate(function(){
				scope.controls.target.copy(scope.centerCam);
				scope.isAnimating = true;
			})
			.easing(params.easing)
			.onComplete(function(){
				scope.isAnimating = false;
				scope.cameraFocus = null;
			})
		.start();
	}

	fly_arc(targetPos, offset, lookAt, params, callback) {
		if (this.isAnimating && !this.allowOverwrite) {
			return;
		}
		else if (this.allowOverwrite){
			this.stop();
		}

		console.log("Switching camera position...");
		
		var scope = this;
		this.isAnimating = true;
		
		var animateAlongSpline = new AnimateAlongSpline(
			this.scene,
			this.controls,
			this.controls.object,
			this.controls.object.position.clone(),
			// new THREE.Vector3().setFromMatrixPosition( this.controls.object.matrixWorld ),
			targetPos.clone().add(offset),
			lookAt,
			params
		)
		.onComplete(function(){
			scope.isAnimating = false;
			scope.cameraTween = null;
			scope.cameraFocus = null;
			callback();
		})
		.start();

	}

	jump (position, look) {
		if (this.isAnimating && !this.allowOverwrite) {
			return;
		}
		else if (this.allowOverwrite){
			this.stop();
		}

		console.log("Switching camera position...");

		this.trackingObj = null;

		this.controls.object.position.copy(position);
		this.controls.target = look;

		console.log("Done!");
	}

	changeParent(parent) {
		// this.controls.object.parent.remove(this.controls.object);
		var camGlobal = new THREE.Vector3().setFromMatrixPosition( this.controls.object.matrixWorld );//we need the global position
		this.controls.object.parent = parent;
		this.controls.object.position.copy(camGlobal);
	}

	lookAt(look) {
		this.controls.target = look;
	}

	track(target, look, offset) {
		if (this.trackingObj) {
			this.trackingObj = null;
		} else {
			this.trackingObj = target;
			this.offsetObj = offset;
			this.lookObj = look;
		}
	}

	update(timeDelta) {
		if (this.trackingObj) {
			var cam = this.camera.position.clone();
			cam.z = 0;
			var track = this.trackingObj.position.clone();
			track.z = 0;
			var dTo = cam.distanceTo(track);
			if (dTo > 1.5) {


				var vector = new THREE.Vector3();
				vector.setFromMatrixPosition( this.trackingObj.matrixWorld );
				vector.add(this.offsetObj);
				this.controls.object.position.x = vector.x;
				this.controls.object.position.y = vector.y;
				vector.add(this.lookObj);
				this.controls.target = vector;
			}
		}
	}
}

export default CameraControl