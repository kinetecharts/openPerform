

import _ from 'lodash';

import $ from 'jquery';

import WEBVR from './WebVR';
import VREffect from './VREffect';
import VRControls from './VRControls';

import Paint from './tools/paint';
import Sculpt from './tools/sculpt';

class VR {
  constructor(renderer, camera, parent, controls) {
    this.renderer = renderer;
    this.camera = camera;
    this.parent = parent;
    this.controls = controls;

    this.raycaster = new THREE.Raycaster();
    this.intersected = [];
    this.tempMatrix = new THREE.Matrix4();

    this.toolType = 'paint'; /* paint / sculpt */

    this.paint = null;
    this.sculpt = null;
    this.tool = null;

    this.vrControls = null;
    this.controllers = [];
    this.startingTransform = null;

    this.events = {};

    this.vrEffect = null;

    this.paint = null;
    this.sculpt = null;
    this.tool = null;

    const lazerGeo = new THREE.Geometry();
    lazerGeo.vertices.push(new THREE.Vector3(0, 0, 0));
    lazerGeo.vertices.push(new THREE.Vector3(0, 0, -1));

    this.lazerLine = new THREE.Line(lazerGeo);
    this.lazerLine.name = 'line';
    this.lazerLine.scale.z = 5;

    // this.group = new THREE.Group();
    // this.parent.add( this.group );

    // var geometries = [
    // 	new THREE.BoxGeometry( 0.2, 0.2, 0.2 ),
    // 	new THREE.ConeGeometry( 0.2, 0.2, 64 ),
    // 	new THREE.CylinderGeometry( 0.2, 0.2, 0.2, 64 ),
    // 	new THREE.IcosahedronGeometry( 0.2, 3 ),
    // 	new THREE.TorusGeometry( 0.2, 0.04, 64, 32 )
    // ];

    // for ( var i = 0; i < 50; i ++ ) {

    // 	var geometry = geometries[Math.floor( Math.random() * geometries.length )];
    // 	var material = new THREE.MeshStandardMaterial( {
    // 		color: Math.random() * 0xffffff,
    // 		roughness: 0.7,
    // 		metalness: 0.0
    // 	} );

    // 	var object = new THREE.Mesh( geometry, material );

    // 	object.position.x = Math.random() * 4 - 2;
    // 	object.position.y = Math.random() * 2;
    // 	object.position.z = Math.random() * 4 - 2;

    // 	object.rotation.x = Math.random() * 2 * Math.PI;
    // 	object.rotation.y = Math.random() * 2 * Math.PI;
    // 	object.rotation.z = Math.random() * 2 * Math.PI;

    // 	object.scale.setScalar( Math.random() + 0.5 );

    // 	object.castShadow = true;
    // 	object.receiveShadow = true;

    // 	this.group.add( object );

    // }

    if (WEBVR.isAvailable() === false) {
      console.log('¡¡¡¡¡ WebVR Not Available !!!!!');
    } else {
      switch (this.toolType) {
        case 'paint':
          this.paint = new Paint(this.parent);
          this.tool = this.paint;
          break;
        case 'sculpt':
          this.sculpt = new Sculpt(this.parent);
          this.tool = this.sculpt;
          break;
      }


      this.initEffect();

      window.addEventListener('resize', this.onWindowResize, false);
    }
  }

  initVRControls() {
    // disable existing contorls before enabling vr controls
    this.controls.enabled = false;

    this.vrControls = new THREE.VRControls(this.camera);
    this.vrControls.standing = true;
  }

  initEffect() {
    this.vrEffect = new THREE.VREffect(this.renderer);
    // this.vrEffect.setFullScreen( true );
    if (WEBVR.isAvailable() === true) {
      const vrButton = WEBVR.getButton(this.vrEffect);

      // override existing button style
      $(vrButton).removeAttr('style');
      $(vrButton).addClass('btn');
      $(vrButton).addClass('btn-default');
      $(vrButton).attr('type', 'button');

      vrButton.innerHTML = '<i title="Enter VR" class="vr-off" aria-hidden="true">'
					+ '<img src="images/vr_inactive.png" height="100%" width="auto"/>'
				+ '</i>';

      window.addEventListener('vrdisplaypresentchange', (event) => {
        vrButton.innerHTML = this.vrEffect.isPresenting ? '<i title="Exit VR" class="vr-on" aria-hidden="true">'
					+ '<img src="images/vr_active.png" height="100%" width="auto"/>'
				+ '</i>' : '<i title="Enter VR" class="vr-off" aria-hidden="true">'
					+ '<img src="images/vr_inactive.png" height="100%" width="auto"/>'
				+ '</i>';
        this.vrEffect.isPresenting ? $(vrButton).addClass('active') : $(vrButton).removeClass('active');
      });

      const vrDiv = document.createElement('div');
      $(vrDiv).attr('id', 'vrButton');
      const h5 = document.createElement('h5');
      h5.innerHTML = 'Enter VR';
      vrDiv.append(h5);
      vrDiv.append(vrButton);
      $('#vrTD').append(vrDiv);
      $(vrButton).click(() => {
        // RootObj.vrOffset = new THREE.Vector3();

        // RootObj.nodeSizeScale = RootObj.vrScale = 0.125;
        // RootObj.nodeSizeScale = 0.5;
        // RootObj.vrOffset.y = 200;

        this.initVRControls();
        this.addController(0);
        this.addController(1);
        this.loadControllerModel();
      });
    }
  }

  addController(id) {
    const controller = new THREE.ViveController(id);

    controller.standingMatrix = this.vrControls.getStandingMatrix();

    controller.userData.points = [new THREE.Vector3(), new THREE.Vector3()];
    controller.userData.matrices = [new THREE.Matrix4(), new THREE.Matrix4()];

    controller.scope = this;
    controller._id = id;

    controller.state = {
      axes: { x: 0, y: 0 }, thumbpad: false, trigger: false, grips: false, menu: false,
    };

    controller.addEventListener('axischanged', this.onAxischanged);

    controller.addEventListener('thumbpaddown', this.onThumbpaddown);
    controller.addEventListener('thumbpadup', this.onThumbpadup);

    controller.addEventListener('triggerdown', this.onTriggerdown);
    controller.addEventListener('triggerup', this.onTriggerup);

    // controller.addEventListener( 'triggerdown', this.tDown);
    // controller.addEventListener( 'triggerup', this.tUp);

    controller.addEventListener('gripsdown', this.onGripsdown);
    controller.addEventListener('gripsup', this.onGripsup);

    controller.addEventListener('menudown', this.onMenudown);
    controller.addEventListener('menuup', this.onMenuup);

    // controller.add( this.lazerLine.clone() );

    this.parent.add(controller);
    this.controllers.push(controller);
  }

  onAxischanged(event) {
    event.target.state.axes.x = event.target.getGamepad().axes[0];
    event.target.state.axes.y = event.target.getGamepad().axes[1];
  }

  onThumbpaddown(event) { event.target.state.thumbpad = true; }

  onThumbpadup(event) { event.target.state.thumbpad = false; }

  onTriggerdown(event) { event.target.state.trigger = true; }

  onTriggerup(event) { event.target.state.trigger = false; }

  onGripsdown(event) { event.target.state.grips = true; }

  onGripsup(event) { event.target.state.grips = false; }

  onMenudown(event) { event.target.state.menu = true; }

  onMenuup(event) { event.target.state.menu = false; }

  loadControllerModel() {
    const scope = this;

    const loader = new THREE.OBJLoader();
    loader.setPath('models/obj/vive-controller/');
    loader.load('vr_controller_vive_1_5.obj', (object) => {
      const loader = new THREE.TextureLoader();
      loader.setPath('models/obj/vive-controller/');

      const controller = object.children[0];
      controller.material.map = loader.load('onepointfive_texture.png');
      controller.material.specularMap = loader.load('onepointfive_spec.png');

      controller.castShadow = true;
      controller.receiveShadow = true;

      const pivot = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.002, 2),
        new THREE.MeshBasicMaterial({ opacity: 0, transparent: true }),
      );

      pivot.name = 'pivot';
      pivot.position.y = -0.016;
      pivot.position.z = -0.043;
      pivot.rotation.x = Math.PI / 5.5;

      const range = new THREE.Mesh(
        new THREE.IcosahedronGeometry(0.03, 3),
        new THREE.MeshBasicMaterial({ opacity: 0, transparent: true }),
      );

      pivot.add(range);

      for (let i = 0; i < scope.controllers.length; i++) {
        scope.controllers[i].add(pivot.clone());
        scope.controllers[i].add(controller.clone());
      }

      pivot.material = pivot.material.clone();
    });
  }

  compareTransforms(start, current) {
    const offset = current.midpoint.clone().sub(start.midpoint.clone());
    offset.x *= 2;
    offset.y *= 2;
    offset.z *= 2;
    return {
      scale: ((start.distance - current.distance) * -1) / 10,
      offset,
      rotate: this.find_angle(start.angle[0], current.angle[0], start.midpoint),
    };
  }

  calculateTransforms() {
    return {
      distance: this.controllers[0].position.distanceTo(this.controllers[1].position),
      midpoint: this.getPointInBetweenByPerc(this.controllers[0].position, this.controllers[1].position, 0.5),
      angle: [this.controllers[0].position, this.controllers[1].position],
    };
  }

  checkControllerState() {
    // if both controllers are squezed
    if (_.filter(this.controllers, controller => controller.state.grips === true).length == 2) {
      if (!this.startingTransform) {
        console.log('transform initiated');
        this.trigger('transformStart', { data: null });
      }

      // get current distance, angle, and midpoint
      const currentTransform = this.calculateTransforms();

      if (!this.startingTransform) {
        // set starting distance, angle, and midpoint
        this.startingTransform = currentTransform;
      }

      // compare between current and starting distance, angle, and midpoint
      const transforms = this.compareTransforms(this.startingTransform, currentTransform);
      this.trigger('transformUpdated', { data: transforms });
    } else if (this.startingTransform !== null) {
      console.log('transform end');
      this.trigger('transformEnd', { data: null });
      this.startingTransform = null;
    }

    if (_.filter(this.controllers, controller => controller.state.grip === true).length > 0) {
      this.trigger('gripClicked', { data: { controllers: this.controllers } });
    }

    if (_.filter(this.controllers, controller => controller.state.trigger === true).length > 0) {
      this.trigger('triggerClicked', { data: { controllers: this.controllers } });
    }

    if (_.filter(this.controllers, controller => controller.state.trigger === false).length > 0) {
      this.trigger('triggerReleased', { data: { controllers: this.controllers } });
    }

    const tool = this.tool;
    _.forEach(this.controllers, (controller, id) => {
      const pivot = controller.getObjectByName('pivot');

      if (pivot) {
        if (tool) {
          tool.updatePoints(pivot, controller, id);
        }

        if (controller.state.thumbpad === true) {
          // console.log('thumbpad '+id+' clicked');
          // if (tool)
          // tool.updateColor(new THREE.Color( Math.random() * 0xffffff ));
        }

        if (controller.state.trigger === true) {
          // scope.trigger('triggerClicked', {data:{controllers:scope.controllers}});
          // console.log('trigger '+id+' clicked');
          // if (tool)
          // tool.draw(id);
          // scope.tDown(controller);
        } else {
          // scope.tUp(controller);
        }

        if (controller.state.grips === true) {
          // console.log('grips '+id+' clicked');
          if (id === 0) {
            // if (tool)
            // tool.erase(id);
          }
          if (id === 1) {
            // if (tool)
            // tool.updateStrength(id);
          }
        }

        if (controller.state.menu === true) {
          // console.log('menu '+id+' clicked');
        }

        if (tool) {
          tool.clonePoints();
        }
      }
    });
  }
  // tDown(event) {
  // 	var controller = event.target;
  // 	var intersections = controller.scope.getIntersections( controller );

  // 	if ( intersections.length > 0 ) {

  // 		var intersection = intersections[0];

  // 		controller.scope.tempMatrix.getInverse( controller.matrixWorld );

  // 		var object = intersection.object;
  // 		object.matrix.premultiply( controller.scope.tempMatrix );
  // 		object.matrix.decompose( object.position, object.quaternion, object.scale );
  // 		object.material.emissive.b = 1;
  // 		controller.add( object );

  // 		controller.userData.selected = object;

  // 	}
  // }
  // tUp(event) {
  // 	var controller = event.target;
  // 	if ( controller.userData.selected !== undefined ) {
  // 		var object = controller.userData.selected;
  // 		object.matrix.premultiply( controller.matrixWorld );
  // 		object.matrix.decompose( object.position, object.quaternion, object.scale );
  // 		object.material.emissive.b = 0;
  // 		controller.scope.group.add( object );

  // 		controller.userData.selected = undefined;
  // 	}
  // }

  getIntersections(controller) {
    this.tempMatrix.identity().extractRotation(controller.matrixWorld);

    this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
    this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(this.tempMatrix);

    return this.raycaster.intersectObjects(this.group.children);
  }

  intersectObjects(controller) {
    // Do not highlight when already selected
    if (controller.userData.selected !== undefined) {
      return;
    }

    const lazerLine = controller.getObjectByName('line');
    const intersections = this.getIntersections(controller);

    if (intersections.length > 0) {
      const intersection = intersections[0];

      const object = intersection.object;
      object.material.emissive.r = 1;
      this.intersected.push(object);

      lazerLine.scale.z = intersection.distance;
    } else {
      lazerLine.scale.z = 5;
    }
  }

  cleanIntersected() {
    while (this.intersected.length) {
      const object = this.intersected.pop();
      object.material.emissive.r = 0;
    }
  }

  onWindowResize() {
    const width = $(this.parent).width();
    const height = $(this.parent).height();

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();

    this.vrEffect.setSize(width, height);
  }

  update() {
    if (WEBVR.isAvailable() !== false) {
      if (this.vrControls && this.vrEffect && this.vrEffect.isPresenting) {
        this.vrControls.update();

        // this.cleanIntersected();

        for (let i = 0; i < this.controllers.length; i++) {
          this.controllers[i].update();

          // this.intersectObjects( this.controllers[i] );

          const pivot = this.controllers[i].getObjectByName('pivot');
          if (pivot) {
            this.trigger('controllersUpdated', {
              data: {
                controllers: this.controllers,
                positions: [
                  THREEx.ObjCoord.worldPosition(this.controllers[0].getObjectByName('pivot')),
                  THREEx.ObjCoord.worldPosition(this.controllers[1].getObjectByName('pivot')),
                ],
              },
            });
          }
        }

        this.checkControllerState();

        if (this.tool) {
          this.tool.update();
        }

        this.vrEffect.render(this.parent, this.camera);
      }
    }
  }

  getPointInBetweenByPerc(pointA, pointB, percentage) {
    let dir = pointB.clone().sub(pointA);
    const len = dir.length();
    dir = dir.normalize().multiplyScalar(len * percentage);
    return pointA.clone().add(dir);
  }

  find_angle(v1, v2, v3) {
    const dot = v1.x * v2.x + v1.y * v2.y + v3.z * v3.z;
    const crossX = v1.y * v2.z - v1.z * v2.y;
    const crossY = v1.z * v2.x - v1.x * v2.z;
    const crossZ = v1.x * v2.y - v1.y * v2.x;
    const crosslen = Math.sqrt(crossX * crossX + crossY * crossY + crossZ * crossZ);
    return Math.atan2(dot, crosslen);
  }

  on(name, callback) {
    this.events[name] = callback;
  }

  trigger(name, data) {
    if (this.events[name]) {
      this.events[name](data);
    } else {
      console.log(`No one is listening to ${name}. :(`);
    }
  }
}

export default VR;
