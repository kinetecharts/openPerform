class ARPlanes extends THREE.Object3D {
  constructor(vrDisplay, addPlaneCallback) {
    super();
    this.vrDisplay = vrDisplay;
    this.addPlaneCallback = addPlaneCallback;

    this.planesVisible = true;
    this.planes = new Map();
    this.shadows = new Map();
    // this.materials = new Map();
    this.enable();
  }

  addPlane_(plane) {
    // console.log('addPlane_',plane, this);
    let planeObj = this.createPlane(plane, 'plane');
    let shadowObj = this.createPlane(plane, 'shadow');

    if (planeObj && shadowObj) {
      planeObj.visible = this.planesVisible;
      shadowObj.visible = this.planesVisible;

      this.add(planeObj);
      // this.add(shadowObj);

      this.planes.set(plane.identifier, planeObj);
      // this.shadows.set(plane.identifier, shadowObj);
      this.addPlaneCallback(this.size());
    }
  }

  removePlane_(identifier) {
    // console.log('removePlane_', identifier, this);
    let existingPlane = this.planes.get(identifier);
    if (existingPlane) {
      this.remove(existingPlane);

      let existingShadow = this.shadows.get(identifier);
      this.remove(existingShadow);
    }
    this.planes.delete(identifier);
    this.shadows.delete(identifier);
    this.addPlaneCallback(this.size());
  }

  onPlaneAdded_(event) {
    console.log('onPlaneAdded_', event, this);
    if (event.planes.length > 0 && event.planes[0] !== undefined) {
      event.planes.forEach(plane => this.addPlane_(plane));
    }
  }

  onPlaneUpdated_(event) {
    // console.log('onPlaneUpdated_', event, this);
    if (event.planes[0] !== undefined) {
      for (let plane of event.planes) {
        this.removePlane_(plane.identifier);
        this.addPlane_(plane);
      }
    }
  }

  onPlaneRemoved_(event) {
    // console.log('onPlaneRemoved_',event, this);
    if (event.planes[0] !== undefined) {
      for (let plane of event.planes) {
        this.removePlane_(plane.identifier);
      }
    }
  }

  enable() {
    this.vrDisplay.getPlanes().forEach(this.addPlane_);

    this.vrDisplay.addEventListener('planesadded', this.onPlaneAdded_.bind(this));
    this.vrDisplay.addEventListener('planesupdated', this.onPlaneUpdated_.bind(this));
    this.vrDisplay.addEventListener('planesremoved', this.onPlaneRemoved_.bind(this));
  }

  disable() {
    this.vrDisplay.removeEventListener('planesadded', this.onPlaneAdded_.bind(this));
    this.vrDisplay.removeEventListener('planesupdated', this.onPlaneUpdated_.bind(this));
    this.vrDisplay.removeEventListener('planesremoved', this.onPlaneRemoved_.bind(this));

    for (let identifier of this.planes.keys()) {
      this.removePlane_(identifier);
    }
    // this.materials.clear();
  }

  createPlane(plane, type) {
    if (plane == undefined || plane.vertices.length == 0) {
      return null;
    }

    const geo = new THREE.Geometry();
    // generate vertices
    for (let pt = 0; pt < plane.vertices.length / 3; pt++) {
      geo.vertices.push(
        new THREE.Vector3(
          plane.vertices[pt * 3],
          plane.vertices[pt * 3 + 1],
          plane.vertices[pt * 3 + 2]
        )
      );
    }

    // generate faces
    for (let face = 0; face < geo.vertices.length - 2; face++) {
      // this makes a triangle fan, from the first +Y point around
      geo.faces.push(new THREE.Face3(0, face + 1, face + 2));
    }

    let material;
    // if (this.materials.has(plane.identifier)) {
    //   // If we have a material stored for this plane already, reuse it
    //   material = this.materials.get(plane.identifier);
    // } else {
    //   // Otherwise, generate a new color, and assign the color to
    //   // this plane's ID
      console.log("!!!!!!!! Creating ", type);
      switch(type) {
        case 'plane':
          material = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            color: 0xFFFFFF,
            transparent: true,
            opacity: 0.25,
          });
          break;
        case 'shadow':
          material = new THREE.ShadowMaterial();
          material.opacity = 0.9;
          break;
      }

      // this.materials.set(plane.identifier, material);
    // }

    const planeObj = new THREE.Mesh(geo, material);
    planeObj.scale.set(10,10,10);
    
    switch(type) {
      case 'plane':
        planeObj.receiveShadow = false;
        break;
      case 'shadow':
        planeObj.receiveShadow = true;
        break;
    }

    const mm = plane.modelMatrix;
    planeObj.matrixAutoUpdate = false;
    planeObj.matrix.set(
      mm[0],
      mm[4],
      mm[8],
      mm[12],
      mm[1],
      mm[5],
      mm[9],
      mm[13],
      mm[2],
      mm[6],
      mm[10],
      mm[14],
      mm[3],
      mm[7],
      mm[11],
      mm[15]
    );

    // this.add(planeObj);
    return planeObj;
  }

  size() {
    return this.planes.size;
  }

  hidePlanes() {
    this.planes.forEach(plane => plane.visible = false);
    this.planesVisible = false;
  }

  showPlanes() {
    this.planes.forEach(plane => plane.visible = true);
    this.planesVisible = true;
  }

  hideShadows() {
    this.shadows.forEach(plane => plane.visible = false);
  }

  showShadows() {
    this.shadows.forEach(plane => plane.visible = true);
  }
}

export default ARPlanes;