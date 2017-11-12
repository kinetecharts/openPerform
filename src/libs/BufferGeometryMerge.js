THREE.BufferGeometry.prototype.merge = function (geometry) {
  if (geometry instanceof THREE.BufferGeometry === false) {
    console.error('THREE.BufferGeometry.merge(): geometry not an instance of THREE.BufferGeometry.', geometry);
    return;
  }

  const attributes = this.attributes;

  if (this.index) {
    const indices = geometry.index.array;

    const offset = attributes.position.count;

    for (let i = 0, il = indices.length; i < il; i++) {
      indices[i] = offset + indices[i];
    }

    this.index.array = Uint32ArrayConcat(this.index.array, indices);
  }

  for (const key in attributes) {
    if (geometry.attributes[key] === undefined) continue;

    attributes[key].array = Float32ArrayConcat(attributes[key].array, geometry.attributes[key].array);
  }

  return this;

  /** *
     * @param {Float32Array} first
     * @param {Float32Array} second
     * @returns {Float32Array}
     * @constructor
     */
  function Float32ArrayConcat(first, second) {
    let firstLength = first.length,
      result = new Float32Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
  }

  /**
     * @param {Uint32Array} first
     * @param {Uint32Array} second
     * @returns {Uint32Array}
     * @constructor
     */
  function Uint32ArrayConcat(first, second) {
    let firstLength = first.length,
      result = new Uint32Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
  }
};
