/*
Builds pointcloud depth object to view Kinect Depth data.
*/


import _ from 'lodash';

class DepthDisplay {
  constructor(parent, dimensions, depthScale, mirror) {
    this.parent = parent;
    this.dimensions = dimensions;
    this.depthScale = depthScale;
    this.mirror = mirror;

    this.sliceStart = 0;
    this.sliceDepth = 10;

    this.pc = null;
    this.buildPC(this.dimensions.width * this.dimensions.height);

    // var center = new THREE.Vector3(0, 0, 0);

    // this.pc.position.set( center.x, center.y, center.z );
    // this.pc.geometry.applyMatrix(new THREE.Matrix4().makeTranslation( -center.x, -center.y, -center.z ) );

    // var bbox = new THREE.BoundingBoxHelper( this.pc, 0x00FF00 );
    // bbox.update();
    // parent.add(bbox);

    // console.log( bbox );
  }

  buildPC(particles) {
    this.particles = particles;
    this.geometry = new THREE.BufferGeometry();
    this.positions = new Float32Array(this.particles * 3);
    this.colors = new Float32Array(this.particles * 3);
    this.sizes = new Float32Array(this.particles);
    this.color = new THREE.Color();

    this.idx = 0;
    this.y = 0;

    for (let i = 0; i < this.positions.length; i += 3) {
      if (this.idx % this.dimensions.width == 0) {
        this.y++;
        if (this.y >= this.dimensions.height) {
          this.y = 0;
        }
      }

      this.sizes[this.idx] = 1;

      this.idx++;
      // // positions
      const x = this.idx % this.dimensions.width;
      const y = this.y;
      const z = 0;
      this.positions[i] = x / 20;
      this.positions[i + 1] = y / 20;
      this.positions[i + 2] = z;
      // colors
      this.color.setRGB(255, 255, 255);
      this.colors[i] = this.color.r;
      this.colors[i + 1] = this.color.g;
      this.colors[i + 2] = this.color.b;
    }
    this.geometry.addAttribute('position', new THREE.BufferAttribute(this.positions, 3));
    this.geometry.addAttribute('color', new THREE.BufferAttribute(this.colors, 3));
    this.geometry.addAttribute('size', new THREE.BufferAttribute(this.sizes, 1));
    this.geometry.computeBoundingSphere();

    this.material = new THREE.PointsMaterial({ vertexColors: THREE.VertexColors });
    this.pc = new THREE.Points(this.geometry, this.material);

    this.parent.add(this.pc);
    this.pc.rotateZ(Math.PI);
    this.pc.rotateX(-Math.PI / 2);
    this.pc.position.x = (this.dimensions.width / 20) / 2;
    this.pc.position.y = (this.dimensions.height / 10);
  }

  moveSlice() {
    if ((this.sliceStart + this.sliceDepth) > 255) {
      this.sliceStart = 0;
    }
    this.updateNear(this.sliceStart);
    this.updateFar(this.sliceStart + this.sliceDepth);
    this.sliceStart += 3;
  }

  updateDepthScale(val) {
    this.depthScale = val;
  }

  updateNear(val) {
    this.dimensions.near = val;
  }

  updateFar(val) {
    this.dimensions.near = val;
  }

  updateDepth(type, imgArray) {
    if (this.mirror) {
      const newVerts = [];
      let i,
        j,
        temparray,
        chunk = this.dimensions.width;
      var imgArray = _.map(_.chunk(imgArray, this.dimensions.width), array => _.reverse(array));
      imgArray = _.flatten(imgArray);
    }

    this.updatePositions(type, imgArray);
    this.updateSizes(type, imgArray);
  }

  updatePositions(type, imgArray) {
    switch (type) {
      case 'kinecttransport':
        var positions = this.pc.geometry.attributes.position.array;
        var idx = 0;
        for (let i = 0; i < positions.length; i += 3) {
          if (imgArray[idx] > this.dimensions.near && imgArray[idx] < this.dimensions.far) {
            positions[i + 2] = this.mapRange(imgArray[idx], 0, 255, this.depthScale / 2, -this.depthScale / 2);
          } else {
            positions[i + 2] = 9999;
          }
          idx++;
        }
        break;
    }

    this.pc.geometry.attributes.position.needsUpdate = true;
  }

  updateSizes(type, imgArray) {
    switch (type) {
      case 'kinecttransport':
        console.log(this.pc.geometry.attributes.size.array);
        var sizes = this.pc.geometry.attributes.size.array;
        var idx = 0;
        for (let i = 0; i < sizes.length; i++) {
          if (imgArray[idx] > this.dimensions.near && imgArray[idx] < this.dimensions.far) {
            sizes[i] = 1;
          } else {
            sizes[i] = 0;
          }
          idx++;
        }
        break;
    }

    this.pc.geometry.attributes.size.needsUpdate = true;
  }

  updateColor(type, imgArray) {
    switch (type) {
      case 'kinecttransport':
        var colors = this.pc.geometry.attributes.color.array;

        if (this.mirror) {
          const newVerts = [];
          var i,
            j,
            temparray,
            chunk = this.dimensions.width;
          var imgArray = _.map(_.chunk(imgArray, this.dimensions.width), array => _.reverse(array));
          imgArray = _.flatten(imgArray);
        }

        var idx = 0;
        for (var i = 0; i < colors.length; i += 3) {
          if (imgArray[idx] > this.dimensions.near && imgArray[idx] < this.dimensions.far) {
            const c = this.mapRange(imgArray[idx], this.dimensions.far, this.dimensions.near, 0, 1);
            const color = new THREE.Color();
            color.setRGB(c, c, c);
            colors[i] = color.r;
            colors[i + 1] = color.g;
            colors[i + 2] = color.b;
          }
          idx++;
        }
        break;
    }

    this.pc.geometry.attributes.color.needsUpdate = true;
  }

  mapRange(num, oldMinValue, oldMaxValue, newMinValue, newMaxValue) {
    const a = oldMaxValue - oldMinValue;
    const b = newMaxValue - newMinValue;
    return (num - oldMinValue) / a * b + newMinValue;
  }
}

module.exports = DepthDisplay;
