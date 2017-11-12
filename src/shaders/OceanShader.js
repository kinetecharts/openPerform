/**
 * @author jbouny / https://github.com/jbouny
 *
 * Work based on :
 * @author Slayvin / http://slayvin.net : Flat mirror for three.js
 * @author Stemkoski / http://www.adelphi.edu/~stemkoski : An implementation of water shader based on the flat mirror
 * @author Jonas Wagner / http://29a.ch/ && http://29a.ch/slides/2012/webglwater/ : Water shader explanations in WebGL
 */


// Author: Aleksandr Albert
// Website: www.routter.co.tt

// Description: A deep water ocean shader set
// based on an implementation of a Tessendorf Waves
// originally presented by David Li ( www.david.li/waves )

// The general method is to apply shaders to simulation Framebuffers
// and then sample these framebuffers when rendering the ocean mesh

// The set uses 7 shaders:

// -- Simulation shaders
// [1] ocean_sim_vertex         -> Vertex shader used to set up a 2x2 simulation plane centered at (0,0)
// [2] ocean_subtransform       -> Fragment shader used to subtransform the mesh (generates the displacement map)
// [3] ocean_initial_spectrum   -> Fragment shader used to set intitial wave frequency at a texel coordinate
// [4] ocean_phase              -> Fragment shader used to set wave phase at a texel coordinate
// [5] ocean_spectrum           -> Fragment shader used to set current wave frequency at a texel coordinate
// [6] ocean_normal             -> Fragment shader used to set face normals at a texel coordinate

// -- Rendering Shader
// [7] ocean_main               -> Vertex and Fragment shader used to create the final render


THREE.ShaderLib.ocean_sim_vertex = {
  vertexShader: [
    'varying vec2 vUV;',

    'void main (void) {',
    'vUV = position.xy * 0.5 + 0.5;',
    'gl_Position = vec4(position, 1.0 );',
    '}',
  ].join('\n'),
};
THREE.ShaderLib.ocean_subtransform = {
  uniforms: {
    u_input: { value: null },
    u_transformSize: { value: 512.0 },
    u_subtransformSize: { value: 250.0 },
  },
  fragmentShader: [
    // GPU FFT using a Stockham formulation

    'precision highp float;',
    '#include <common>',

    'uniform sampler2D u_input;',
    'uniform float u_transformSize;',
    'uniform float u_subtransformSize;',

    'varying vec2 vUV;',

    'vec2 multiplyComplex (vec2 a, vec2 b) {',
    'return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);',
    '}',

    'void main (void) {',
    '#ifdef HORIZONTAL',
    'float index = vUV.x * u_transformSize - 0.5;',
    '#else',
    'float index = vUV.y * u_transformSize - 0.5;',
    '#endif',

    'float evenIndex = floor(index / u_subtransformSize) * (u_subtransformSize * 0.5) + mod(index, u_subtransformSize * 0.5);',

    // transform two complex sequences simultaneously
    '#ifdef HORIZONTAL',
    'vec4 even = texture2D(u_input, vec2(evenIndex + 0.5, gl_FragCoord.y) / u_transformSize).rgba;',
    'vec4 odd = texture2D(u_input, vec2(evenIndex + u_transformSize * 0.5 + 0.5, gl_FragCoord.y) / u_transformSize).rgba;',
    '#else',
    'vec4 even = texture2D(u_input, vec2(gl_FragCoord.x, evenIndex + 0.5) / u_transformSize).rgba;',
    'vec4 odd = texture2D(u_input, vec2(gl_FragCoord.x, evenIndex + u_transformSize * 0.5 + 0.5) / u_transformSize).rgba;',
    '#endif',

    'float twiddleArgument = -2.0 * PI * (index / u_subtransformSize);',
    'vec2 twiddle = vec2(cos(twiddleArgument), sin(twiddleArgument));',

    'vec2 outputA = even.xy + multiplyComplex(twiddle, odd.xy);',
    'vec2 outputB = even.zw + multiplyComplex(twiddle, odd.zw);',

    'gl_FragColor = vec4(outputA, outputB);',
    '}',
  ].join('\n'),
};
THREE.ShaderLib.ocean_initial_spectrum = {
  uniforms: {
    u_wind: { value: new THREE.Vector2(10.0, 10.0) },
    u_resolution: { value: 512.0 },
    u_size: { value: 250.0 },
  },
  fragmentShader: [
    'precision highp float;',
    '#include <common>',

    'const float G = 9.81;',
    'const float KM = 370.0;',
    'const float CM = 0.23;',

    'uniform vec2 u_wind;',
    'uniform float u_resolution;',
    'uniform float u_size;',

    'float omega (float k) {',
    'return sqrt(G * k * (1.0 + pow2(k / KM)));',
    '}',

    'float tanh (float x) {',
    'return (1.0 - exp(-2.0 * x)) / (1.0 + exp(-2.0 * x));',
    '}',

    'void main (void) {',
    'vec2 coordinates = gl_FragCoord.xy - 0.5;',

    'float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;',
    'float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;',

    'vec2 K = (2.0 * PI * vec2(n, m)) / u_size;',
    'float k = length(K);',

    'float l_wind = length(u_wind);',

    'float Omega = 0.84;',
    'float kp = G * pow2(Omega / l_wind);',

    'float c = omega(k) / k;',
    'float cp = omega(kp) / kp;',

    'float Lpm = exp(-1.25 * pow2(kp / k));',
    'float gamma = 1.7;',
    'float sigma = 0.08 * (1.0 + 4.0 * pow(Omega, -3.0));',
    'float Gamma = exp(-pow2(sqrt(k / kp) - 1.0) / 2.0 * pow2(sigma));',
    'float Jp = pow(gamma, Gamma);',
    'float Fp = Lpm * Jp * exp(-Omega / sqrt(10.0) * (sqrt(k / kp) - 1.0));',
    'float alphap = 0.006 * sqrt(Omega);',
    'float Bl = 0.5 * alphap * cp / c * Fp;',

    'float z0 = 0.000037 * pow2(l_wind) / G * pow(l_wind / cp, 0.9);',
    'float uStar = 0.41 * l_wind / log(10.0 / z0);',
    'float alpham = 0.01 * ((uStar < CM) ? (1.0 + log(uStar / CM)) : (1.0 + 3.0 * log(uStar / CM)));',
    'float Fm = exp(-0.25 * pow2(k / KM - 1.0));',
    'float Bh = 0.5 * alpham * CM / c * Fm * Lpm;',

    'float a0 = log(2.0) / 4.0;',
    'float am = 0.13 * uStar / CM;',
    'float Delta = tanh(a0 + 4.0 * pow(c / cp, 2.5) + am * pow(CM / c, 2.5));',

    'float cosPhi = dot(normalize(u_wind), normalize(K));',

    'float S = (1.0 / (2.0 * PI)) * pow(k, -4.0) * (Bl + Bh) * (1.0 + Delta * (2.0 * cosPhi * cosPhi - 1.0));',

    'float dk = 2.0 * PI / u_size;',
    'float h = sqrt(S / 2.0) * dk;',

    'if (K.x == 0.0 && K.y == 0.0) {',
    'h = 0.0;', // no DC term
    '}',
    'gl_FragColor = vec4(h, 0.0, 0.0, 0.0);',
    '}',
  ].join('\n'),
};
THREE.ShaderLib.ocean_phase = {
  uniforms: {
    u_phases: { value: null },
    u_deltaTime: { value: null },
    u_resolution: { value: null },
    u_size: { value: null },
  },
  fragmentShader: [
    'precision highp float;',
    '#include <common>',

    'const float G = 9.81;',
    'const float KM = 370.0;',

    'varying vec2 vUV;',

    'uniform sampler2D u_phases;',
    'uniform float u_deltaTime;',
    'uniform float u_resolution;',
    'uniform float u_size;',

    'float omega (float k) {',
    'return sqrt(G * k * (1.0 + k * k / KM * KM));',
    '}',

    'void main (void) {',
    'float deltaTime = 1.0 / 60.0;',
    'vec2 coordinates = gl_FragCoord.xy - 0.5;',
    'float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;',
    'float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;',
    'vec2 waveVector = (2.0 * PI * vec2(n, m)) / u_size;',

    'float phase = texture2D(u_phases, vUV).r;',
    'float deltaPhase = omega(length(waveVector)) * u_deltaTime;',
    'phase = mod(phase + deltaPhase, 2.0 * PI);',

    'gl_FragColor = vec4(phase, 0.0, 0.0, 0.0);',
    '}',
  ].join('\n'),
};
THREE.ShaderLib.ocean_spectrum = {
  uniforms: {
    u_size: { value: null },
    u_resolution: { value: null },
    u_choppiness: { value: null },
    u_phases: { value: null },
    u_initialSpectrum: { value: null },
  },
  fragmentShader: [
    'precision highp float;',
    '#include <common>',

    'const float G = 9.81;',
    'const float KM = 370.0;',

    'varying vec2 vUV;',

    'uniform float u_size;',
    'uniform float u_resolution;',
    'uniform float u_choppiness;',
    'uniform sampler2D u_phases;',
    'uniform sampler2D u_initialSpectrum;',

    'vec2 multiplyComplex (vec2 a, vec2 b) {',
    'return vec2(a[0] * b[0] - a[1] * b[1], a[1] * b[0] + a[0] * b[1]);',
    '}',

    'vec2 multiplyByI (vec2 z) {',
    'return vec2(-z[1], z[0]);',
    '}',

    'float omega (float k) {',
    'return sqrt(G * k * (1.0 + k * k / KM * KM));',
    '}',

    'void main (void) {',
    'vec2 coordinates = gl_FragCoord.xy - 0.5;',
    'float n = (coordinates.x < u_resolution * 0.5) ? coordinates.x : coordinates.x - u_resolution;',
    'float m = (coordinates.y < u_resolution * 0.5) ? coordinates.y : coordinates.y - u_resolution;',
    'vec2 waveVector = (2.0 * PI * vec2(n, m)) / u_size;',

    'float phase = texture2D(u_phases, vUV).r;',
    'vec2 phaseVector = vec2(cos(phase), sin(phase));',

    'vec2 h0 = texture2D(u_initialSpectrum, vUV).rg;',
    'vec2 h0Star = texture2D(u_initialSpectrum, vec2(1.0 - vUV + 1.0 / u_resolution)).rg;',
    'h0Star.y *= -1.0;',

    'vec2 h = multiplyComplex(h0, phaseVector) + multiplyComplex(h0Star, vec2(phaseVector.x, -phaseVector.y));',

    'vec2 hX = -multiplyByI(h * (waveVector.x / length(waveVector))) * u_choppiness;',
    'vec2 hZ = -multiplyByI(h * (waveVector.y / length(waveVector))) * u_choppiness;',

    // no DC term
    'if (waveVector.x == 0.0 && waveVector.y == 0.0) {',
    'h = vec2(0.0);',
    'hX = vec2(0.0);',
    'hZ = vec2(0.0);',
    '}',

    'gl_FragColor = vec4(hX + multiplyByI(h), hZ);',
    '}',
  ].join('\n'),
};
THREE.ShaderLib.ocean_normals = {
  uniforms: {
    u_displacementMap: { value: null },
    u_resolution: { value: null },
    u_size: { value: null },
  },
  fragmentShader: [
    'precision highp float;',

    'varying vec2 vUV;',

    'uniform sampler2D u_displacementMap;',
    'uniform float u_resolution;',
    'uniform float u_size;',

    'void main (void) {',
    'float texel = 1.0 / u_resolution;',
    'float texelSize = u_size / u_resolution;',

    'vec3 center = texture2D(u_displacementMap, vUV).rgb;',
    'vec3 right = vec3(texelSize, 0.0, 0.0) + texture2D(u_displacementMap, vUV + vec2(texel, 0.0)).rgb - center;',
    'vec3 left = vec3(-texelSize, 0.0, 0.0) + texture2D(u_displacementMap, vUV + vec2(-texel, 0.0)).rgb - center;',
    'vec3 top = vec3(0.0, 0.0, -texelSize) + texture2D(u_displacementMap, vUV + vec2(0.0, -texel)).rgb - center;',
    'vec3 bottom = vec3(0.0, 0.0, texelSize) + texture2D(u_displacementMap, vUV + vec2(0.0, texel)).rgb - center;',

    'vec3 topRight = cross(right, top);',
    'vec3 topLeft = cross(top, left);',
    'vec3 bottomLeft = cross(left, bottom);',
    'vec3 bottomRight = cross(bottom, right);',

    'gl_FragColor = vec4(normalize(topRight + topLeft + bottomLeft + bottomRight), 1.0);',
    '}',
  ].join('\n'),
};
THREE.ShaderLib.ocean_main = {
  uniforms: {
    u_displacementMap: { value: null },
    u_normalMap: { value: null },
    u_geometrySize: { value: null },
    u_size: { value: null },
    u_projectionMatrix: { value: null },
    u_viewMatrix: { value: null },
    u_cameraPosition: { value: null },
    u_skyColor: { value: null },
    u_oceanColor: { value: null },
    u_sunDirection: { value: null },
    u_exposure: { value: null },
  },
  vertexShader: [
    'precision highp float;',

    'varying vec3 vPos;',
    'varying vec2 vUV;',

    'uniform mat4 u_projectionMatrix;',
    'uniform mat4 u_viewMatrix;',
    'uniform float u_size;',
    'uniform float u_geometrySize;',
    'uniform sampler2D u_displacementMap;',

    'void main (void) {',
    'vec3 newPos = position + texture2D(u_displacementMap, uv).rgb * (u_geometrySize / u_size);',
    'vPos = newPos;',
    'vUV = uv;',
    'gl_Position = u_projectionMatrix * u_viewMatrix * vec4(newPos, 1.0);',
    '}',
  ].join('\n'),
  fragmentShader: [
    'precision highp float;',

    'varying vec3 vPos;',
    'varying vec2 vUV;',

    'uniform sampler2D u_displacementMap;',
    'uniform sampler2D u_normalMap;',
    'uniform vec3 u_cameraPosition;',
    'uniform vec3 u_oceanColor;',
    'uniform vec3 u_skyColor;',
    'uniform vec3 u_sunDirection;',
    'uniform float u_exposure;',

    'vec3 hdr (vec3 color, float exposure) {',
    'return 1.0 - exp(-color * exposure);',
    '}',

    'void main (void) {',
    'vec3 normal = texture2D(u_normalMap, vUV).rgb;',

    'vec3 view = normalize(u_cameraPosition - vPos);',
    'float fresnel = 0.02 + 0.98 * pow(1.0 - dot(normal, view), 5.0);',
    'vec3 sky = fresnel * u_skyColor;',

    'float diffuse = clamp(dot(normal, normalize(u_sunDirection)), 0.0, 1.0);',
    'vec3 water = (1.0 - fresnel) * u_oceanColor * u_skyColor * diffuse;',

    'vec3 color = sky + water;',

    'gl_FragColor = vec4(hdr(color, u_exposure), 1.0);',
    '}',
  ].join('\n'),
};


const WaterShader = function (renderer, camera, scene, options) {
  THREE.Object3D.call(this);
  this.name = `water_${this.id}`;

  function optionalParameter(value, defaultValue) {
    return value !== undefined ? value : defaultValue;
  }

  options = options || {};

  this.matrixNeedsUpdate = true;

  const width = optionalParameter(options.textureWidth, 512);
  const height = optionalParameter(options.textureHeight, 512);
  this.clipBias = optionalParameter(options.clipBias, 0.0);
  this.alpha = optionalParameter(options.alpha, 1.0);
  this.time = optionalParameter(options.time, 0.0);
  this.normalSampler = optionalParameter(options.waterNormals, null);
  this.sunDirection = optionalParameter(options.sunDirection, new THREE.Vector3(0.70707, 0.70707, 0.0));
  this.sunColor = new THREE.Color(optionalParameter(options.sunColor, 0xffffff));
  this.waterColor = new THREE.Color(optionalParameter(options.waterColor, 0x7F7F7F));
  this.eye = optionalParameter(options.eye, new THREE.Vector3(0, 0, 0));
  this.distortionScale = optionalParameter(options.distortionScale, 20.0);
  this.side = optionalParameter(options.side, THREE.FrontSide);
  this.fog = optionalParameter(options.fog, false);

  this.renderer = renderer;
  this.scene = scene;
  this.mirrorPlane = new THREE.Plane();
  this.normal = new THREE.Vector3(0, 0, 1);
  this.mirrorWorldPosition = new THREE.Vector3();
  this.cameraWorldPosition = new THREE.Vector3();
  this.rotationMatrix = new THREE.Matrix4();
  this.lookAtPosition = new THREE.Vector3(0, 0, -1);
  this.clipPlane = new THREE.Vector4();

  if (camera instanceof THREE.PerspectiveCamera) {
    this.camera = camera;
  } else {
    this.camera = new THREE.PerspectiveCamera();
    console.log(`${this.name}: camera is not a Perspective Camera!`);
  }

  this.textureMatrix = new THREE.Matrix4();

  this.mirrorCamera = this.camera.clone();

  this.renderTarget = new THREE.WebGLRenderTarget(width, height);
  this.renderTarget2 = new THREE.WebGLRenderTarget(width, height);

  const mirrorShader = {

    uniforms: THREE.UniformsUtils.merge([
      THREE.UniformsLib.fog,
      {
        normalSampler: { value: null },
        mirrorSampler: { value: null },
        alpha: { value: 1.0 },
        time: { value: 0.0 },
        distortionScale: { value: 20.0 },
        noiseScale: { value: 1.0 },
        textureMatrix: { value: new THREE.Matrix4() },
        sunColor: { value: new THREE.Color(0x7F7F7F) },
        sunDirection: { value: new THREE.Vector3(0.70707, 0.70707, 0) },
        eye: { value: new THREE.Vector3() },
        waterColor: { value: new THREE.Color(0x555555) },
      },
    ]),

    vertexShader: [
      'uniform mat4 textureMatrix;',
      'uniform float time;',

      'varying vec4 mirrorCoord;',
      'varying vec3 worldPosition;',

      THREE.ShaderChunk.fog_pars_vertex,

      'void main() {',
      '	mirrorCoord = modelMatrix * vec4( position, 1.0 );',
      '	worldPosition = mirrorCoord.xyz;',
      '	mirrorCoord = textureMatrix * mirrorCoord;',
      '	vec4 mvPosition =  modelViewMatrix * vec4( position, 1.0 );',
      '	gl_Position = projectionMatrix * mvPosition;',

      THREE.ShaderChunk.fog_vertex,

      '}',
    ].join('\n'),

    fragmentShader: [
      'precision highp float;',

      'uniform sampler2D mirrorSampler;',
      'uniform float alpha;',
      'uniform float time;',
      'uniform float distortionScale;',
      'uniform sampler2D normalSampler;',
      'uniform vec3 sunColor;',
      'uniform vec3 sunDirection;',
      'uniform vec3 eye;',
      'uniform vec3 waterColor;',

      'varying vec4 mirrorCoord;',
      'varying vec3 worldPosition;',

      'vec4 getNoise( vec2 uv ) {',
      '	vec2 uv0 = ( uv / 103.0 ) + vec2(time / 17.0, time / 29.0);',
      '	vec2 uv1 = uv / 107.0-vec2( time / -19.0, time / 31.0 );',
      '	vec2 uv2 = uv / vec2( 8907.0, 9803.0 ) + vec2( time / 101.0, time / 97.0 );',
      '	vec2 uv3 = uv / vec2( 1091.0, 1027.0 ) - vec2( time / 109.0, time / -113.0 );',
      '	vec4 noise = texture2D( normalSampler, uv0 ) +',
      '		texture2D( normalSampler, uv1 ) +',
      '		texture2D( normalSampler, uv2 ) +',
      '		texture2D( normalSampler, uv3 );',
      '	return noise * 0.5 - 1.0;',
      '}',

      'void sunLight( const vec3 surfaceNormal, const vec3 eyeDirection, float shiny, float spec, float diffuse, inout vec3 diffuseColor, inout vec3 specularColor ) {',
      '	vec3 reflection = normalize( reflect( -sunDirection, surfaceNormal ) );',
      '	float direction = max( 0.0, dot( eyeDirection, reflection ) );',
      '	specularColor += pow( direction, shiny ) * sunColor * spec;',
      '	diffuseColor += max( dot( sunDirection, surfaceNormal ), 0.0 ) * sunColor * diffuse;',
      '}',

      THREE.ShaderChunk.common,
      THREE.ShaderChunk.fog_pars_fragment,

      'void main() {',
      '	vec4 noise = getNoise( worldPosition.xz );',
      '	vec3 surfaceNormal = normalize( noise.xzy * vec3( 1.5, 1.0, 1.5 ) );',

      '	vec3 diffuseLight = vec3(0.0);',
      '	vec3 specularLight = vec3(0.0);',

      '	vec3 worldToEye = eye-worldPosition;',
      '	vec3 eyeDirection = normalize( worldToEye );',
      '	sunLight( surfaceNormal, eyeDirection, 100.0, 2.0, 0.5, diffuseLight, specularLight );',

      '	float distance = length(worldToEye);',

      '	vec2 distortion = surfaceNormal.xz * ( 0.001 + 1.0 / distance ) * distortionScale;',
      '	vec3 reflectionSample = vec3( texture2D( mirrorSampler, mirrorCoord.xy / mirrorCoord.z + distortion ) );',

      '	float theta = max( dot( eyeDirection, surfaceNormal ), 0.0 );',
      '	float rf0 = 0.3;',
      '	float reflectance = rf0 + ( 1.0 - rf0 ) * pow( ( 1.0 - theta ), 5.0 );',
      '	vec3 scatter = max( 0.0, dot( surfaceNormal, eyeDirection ) ) * waterColor;',
      '	vec3 albedo = mix( sunColor * diffuseLight * 0.3 + scatter, ( vec3( 0.1 ) + reflectionSample * 0.9 + reflectionSample * specularLight ), reflectance );',
      '	vec3 outgoingLight = albedo;',
      '	gl_FragColor = vec4( outgoingLight, alpha );',

      THREE.ShaderChunk.fog_fragment,

      '}',
    ].join('\n'),

  };

  const mirrorUniforms = THREE.UniformsUtils.clone(mirrorShader.uniforms);

  this.material = new THREE.ShaderMaterial({
    fragmentShader: mirrorShader.fragmentShader,
    vertexShader: mirrorShader.vertexShader,
    uniforms: mirrorUniforms,
    transparent: true,
    side: this.side,
    fog: this.fog,
  });

  this.material.uniforms.mirrorSampler.value = this.renderTarget.texture;
  this.material.uniforms.textureMatrix.value = this.textureMatrix;
  this.material.uniforms.alpha.value = this.alpha;
  this.material.uniforms.time.value = this.time;
  this.material.uniforms.normalSampler.value = this.normalSampler;
  this.material.uniforms.sunColor.value = this.sunColor;
  this.material.uniforms.waterColor.value = this.waterColor;
  this.material.uniforms.sunDirection.value = this.sunDirection;
  this.material.uniforms.distortionScale.value = this.distortionScale;

  this.material.uniforms.eye.value = this.eye;

  if (!THREE.Math.isPowerOfTwo(width) || !THREE.Math.isPowerOfTwo(height)) {
    this.renderTarget.texture.generateMipmaps = false;
    this.renderTarget.texture.minFilter = THREE.LinearFilter;
    this.renderTarget2.texture.generateMipmaps = false;
    this.renderTarget2.texture.minFilter = THREE.LinearFilter;
  }

  this.updateTextureMatrix();
  this.render();
};

module.exports = {};
