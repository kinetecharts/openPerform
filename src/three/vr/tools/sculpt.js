

class Sculpt {
  constructor(parent) {
    this.parent = parent;

    this.blob = null;
    this.vector = null;

    this.points = [];

    this.color = new THREE.Color(0xFFFFFF);

    this.up = new THREE.Vector3(0, 1, 0);
    this.vector = new THREE.Vector3();

    this.matrix = null;

    this.initBlob();
  }

  updateStrength(id) {
    this.points[id].strength = (Math.sin(performance.now() / 1000) + 1.5) / 20.0;
  }

  erase() {
    if (this.points.length > 2) {
      this.points.shift();
      this.points.shift();

      this.update();

      const geometry = this.blob.generateGeometry();
      const mesh = new THREE.Mesh(geometry, this.blob.material.clone());
      mesh.position.y = 1;
      mesh.castShadow = true;
      mesh.receiveShadow = true;
      this.parent.add(mesh);

      this.initPoints();
    }
  }

  draw(id) {
    const strength = this.points[id].strength / 2;

    this.vector = new THREE.Vector3().setFromMatrixPosition(this.matrix);

    this.transformPoint(this.vector);

    this.points.push({ position: this.vector, strength, subtract: 10 });
  }

  transformPoint(vector) {
    this.vector.x = (vector.x + 1.0) / 2.0;
    this.vector.y = (vector.y / 2.0);
    this.vector.z = (vector.z + 1.0) / 2.0;
  }

  updatePoints(pivot, controller, id) {
    this.matrix = pivot.matrixWorld;

    this.points[id].position.setFromMatrixPosition(this.matrix);
    this.transformPoint(this.points[id].position);
  }

  clonePoints() {}

  updateColor(color) {
    this.color = color;
    this.blob.material.color = this.color;
  }

  initBlob() {
    const material = new THREE.MeshStandardMaterial({
      color: this.color,
      roughness: 0.9,
      metalness: 0.0,
    });

    this.blob = new THREE.MarchingCubes(64, material, true);
    this.blob.position.y = 1;
    this.parent.add(this.blob);

    this.initPoints();
  }

  initPoints() {
    this.points = [
      { position: new THREE.Vector3(), strength: -0.08, subtract: 10 },
      { position: new THREE.Vector3(), strength: 0.04, subtract: 10 },
    ];
  }

  update() {
    this.blob.reset();

    for (let i = 0; i < this.points.length; i++) {
      const point = this.points[i];
      const position = point.position;

      this.blob.addBall(position.x, position.y, position.z, point.strength, point.subtract);
    }
  }
}

export default Sculpt;
