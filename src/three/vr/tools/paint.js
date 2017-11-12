

class Paint {
  constructor(parent) {
    this.parent = parent;

    this.line;
    this.shapes = {};

    this.vector1 = new THREE.Vector3();
    this.vector2 = new THREE.Vector3();
    this.vector3 = new THREE.Vector3();
    this.vector4 = new THREE.Vector3();

    this.color = new THREE.Color(255, 255, 255);

    this.point1 = null;
    this.point2 = null;

    this.point4 = new THREE.Vector3();
    this.point5 = new THREE.Vector3();

    this.matrix = null;

    this.matrix1 = null;
    this.matrix2 = null;

    this.up = new THREE.Vector3(0, 1, 0);

    this.initGeometry();
  }

  updatePoints(pivot, controller, id) {
    this.matrix = pivot.matrixWorld;

    this.point1 = controller.userData.points[0];
    this.point2 = controller.userData.points[1];

    this.matrix1 = controller.userData.matrices[0];
    this.matrix2 = controller.userData.matrices[1];

    this.point1.setFromMatrixPosition(this.matrix);
    this.matrix1.lookAt(this.point2, this.point1, this.up);
  }

  clonePoints() {
    this.point2.copy(this.point1);
    this.matrix2.copy(this.matrix1);
  }

  updateColor(color) {
    this.color = color;
  }

  initGeometry() {
    const geometry = new THREE.BufferGeometry();

    const positions = new THREE.BufferAttribute(new Float32Array(1000000 * 3), 3);
    geometry.addAttribute('position', positions);

    const normals = new THREE.BufferAttribute(new Float32Array(1000000 * 3), 3);
    geometry.addAttribute('normal', normals);

    const colors = new THREE.BufferAttribute(new Float32Array(1000000 * 3), 3);
    geometry.addAttribute('color', colors);

    geometry.drawRange.count = 0;

    const material = new THREE.MeshStandardMaterial({
      roughness: 0.9,
      metalness: 0.0,
      // envMap: reflectionCube,
      vertexColors: THREE.VertexColors,
      side: THREE.DoubleSide,
    });

    this.line = new THREE.Mesh(geometry, material);
    this.line.frustumCulled = false;
    this.line.castShadow = true;
    this.line.receiveShadow = true;
    this.parent.add(this.line);

    // Shapes

    const PI2 = Math.PI * 2;

    const sides = 10;
    const array = [];

    for (let i = 0; i < sides; i++) {
      const angle = (i / sides) * PI2;
      array.push(new THREE.Vector3(Math.sin(angle) * 0.01, Math.cos(angle) * 0.01, 0));
    }

    this.shapes.tube = array;
  }

  draw() {
    const shape = this.shapes.tube;

    const geometry = this.line.geometry;
    const attributes = geometry.attributes;
    let count = geometry.drawRange.count;

    const positions = attributes.position.array;
    const normals = attributes.normal.array;
    const colors = attributes.color.array;

    for (let j = 0, jl = shape.length; j < jl; j++) {
      const vertex1 = shape[j];
      const vertex2 = shape[(j + 1) % jl];

      // positions

      this.vector1.copy(vertex1);
      this.vector1.applyMatrix4(this.matrix2);
      this.vector1.add(this.point2);

      this.vector2.copy(vertex2);
      this.vector2.applyMatrix4(this.matrix2);
      this.vector2.add(this.point2);

      this.vector3.copy(vertex2);
      this.vector3.applyMatrix4(this.matrix1);
      this.vector3.add(this.point1);

      this.vector4.copy(vertex1);
      this.vector4.applyMatrix4(this.matrix1);
      this.vector4.add(this.point1);

      this.vector1.toArray(positions, (count + 0) * 3);
      this.vector2.toArray(positions, (count + 1) * 3);
      this.vector4.toArray(positions, (count + 2) * 3);

      this.vector2.toArray(positions, (count + 3) * 3);
      this.vector3.toArray(positions, (count + 4) * 3);
      this.vector4.toArray(positions, (count + 5) * 3);

      // normals

      this.vector1.copy(vertex1);
      this.vector1.applyMatrix4(this.matrix2);
      this.vector1.normalize();

      this.vector2.copy(vertex2);
      this.vector2.applyMatrix4(this.matrix2);
      this.vector2.normalize();

      this.vector3.copy(vertex2);
      this.vector3.applyMatrix4(this.matrix1);
      this.vector3.normalize();

      this.vector4.copy(vertex1);
      this.vector4.applyMatrix4(this.matrix1);
      this.vector4.normalize();

      this.vector1.toArray(normals, (count + 0) * 3);
      this.vector2.toArray(normals, (count + 1) * 3);
      this.vector4.toArray(normals, (count + 2) * 3);

      this.vector2.toArray(normals, (count + 3) * 3);
      this.vector3.toArray(normals, (count + 4) * 3);
      this.vector4.toArray(normals, (count + 5) * 3);

      // colors

      this.color.toArray(colors, (count + 0) * 3);
      this.color.toArray(colors, (count + 1) * 3);
      this.color.toArray(colors, (count + 2) * 3);

      this.color.toArray(colors, (count + 3) * 3);
      this.color.toArray(colors, (count + 4) * 3);
      this.color.toArray(colors, (count + 5) * 3);

      count += 6;
    }

    geometry.drawRange.count = count;
    attributes.position.needsUpdate = true;
    attributes.normal.needsUpdate = true;
    attributes.color.needsUpdate = true;
  }

  erase() {}

  updateStrength() {}

  update() {
  }
}

export default Paint;
