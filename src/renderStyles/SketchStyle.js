/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:58:18
 * @modify date 2018-08-31 04:58:18
 * @desc [description]
*/

class SketchStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstShader = {
      uniforms: {
        tDiffuse: { type: 't', value: null },
        tShadow: { type: 't', value: null },
        iResolution: { type: 'v2', value: new THREE.Vector2(this.w, this.h) },
      },
      vertexShader: require('../shaders/sketch/drawVertex.glsl'),
      fragmentShader: require('../shaders/sketch/drawFragment.glsl'),
    };

    this.firstPass = new THREE.ShaderPass(this.firstShader);
    this.composer.addPass(this.firstPass);

    this.secondShader = {
      uniforms: {
        tDiffuse: { type: 't', value: null },
        iTime: { type: 'f', value: 0.0 },
        tNoise: { type: 't', value: new THREE.TextureLoader().load('/textures/noise.png') },
      },
      vertexShader: require('../shaders/sketch/drawVertex.glsl'),
      fragmentShader: require('../shaders/sketch/finalFragment.glsl')
    };

    this.secondPass = new THREE.ShaderPass(this.secondShader);
    this.secondPass.renderToScreen = true;
    this.secondPass.material.extensions.derivatives = true;
    this.composer.addPass(this.secondPass);
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = SketchStyle;