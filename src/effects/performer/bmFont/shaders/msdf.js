
module.exports = function createMSDFShader(o) {
  const opt = o || {};
  const opacity = typeof opt.opacity === 'number' ? opt.opacity : 1;
  const alphaTest = typeof opt.alphaTest === 'number' ? opt.alphaTest : 0.0001;
  const precision = opt.precision || 'highp';
  const color = opt.color;
  const map = opt.map;

  // remove to satisfy r73
  delete opt.map;
  delete opt.color;
  delete opt.precision;
  delete opt.opacity;

  return Object.assign({
    uniforms: {
      opacity: {
        type: 'f',
        value: opacity,
      },
      map: {
        type: 't',
        value: map || new THREE.Texture(),
      },
      color: {
        type: 'c',
        value: new THREE.Color(color),
      },
    },
    vertexShader: [
      'attribute vec2 uv;',
      'attribute vec4 position;',
      'uniform mat4 projectionMatrix;',
      'uniform mat4 modelViewMatrix;',
      'varying vec2 vUv;',
      'varying float distToCamera;',
      'void main() {',
      'vUv = uv;',
      'vec4 cs_position = modelViewMatrix * position;',
      'distToCamera = -cs_position.z;',
      'gl_Position = projectionMatrix * cs_position;',
      '//gl_Position = projectionMatrix * modelViewMatrix * position;',
      '}',
    ].join('\n'),
    fragmentShader: [
      '#ifdef GL_OES_standard_derivatives',
      '#extension GL_OES_standard_derivatives : enable',
      '#endif',
      'precision ' + precision + ' float;',
      'uniform float opacity;',
      'uniform vec3 color;',
      'uniform sampler2D map;',
      'varying vec2 vUv;',
      'varying float distToCamera;',

      'float median(float r, float g, float b) {',
      '  return max(min(r, g), min(max(r, g), b));',
      '}',

      'void main() {',
      '  vec3 sample = 1.0 - texture2D(map, vUv).rgb;',
      '  float sigDist = median(sample.r, sample.g, sample.b) - 0.5;',
      '  float compensate = abs(distToCamera) * 0.3;',
      '  float lighten = abs(distToCamera) * 0.01;',
      '  // float alpha = clamp(sigDist/fwidth(sigDist) + 0.5 + compensate, 0.0, 1.0);',
      '  float alpha = clamp(sigDist/fwidth(sigDist) / (1.0+compensate) + 0.5 + lighten, 0.0, 1.0);',
      '  // alpha = clamp(sigDist + 0.5, 0.0, 1.0);',
      '  gl_FragColor = vec4(color.xyz, alpha * opacity);',
      alphaTest === 0
        ? ''
        : '  if (gl_FragColor.a < ' + alphaTest + ') discard;',
      '}',
    ].join('\n'),
  }, opt);
};
