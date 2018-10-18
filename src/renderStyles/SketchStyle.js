/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:58:18
 * @modify date 2018-09-02 06:54:57
 * @desc [description]
*/

import SketchSettingsMenu from './../react/menus/render/SketchSettingsMenu';

class SketchStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.name = "Sketch";

    this.options = {
      edgeColor: '#000000',
      bgColor: '#FFFFFF',
      noiseAmount: 0.01,
      errorPeriod: 30.0,
      errorRange: 0.003,
    };

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

    this.secondShader = {
      uniforms: {
        tDiffuse: { type: 't', value: null },
        iTime: { type: 'f', value: 0.0 },
        EdgeColor: {
          type: "v4",
          value: new THREE.Vector4(
            new THREE.Color(this.options.edgeColor).r,
            new THREE.Color(this.options.edgeColor).g,
            new THREE.Color(this.options.edgeColor).b,
            1.0,
          ),
        },
        BackgroundColor: {
          type: "v4",
          value: new THREE.Vector4(
            new THREE.Color(this.options.bgColor).r,
            new THREE.Color(this.options.bgColor).g,
            new THREE.Color(this.options.bgColor).b,
            1.0,
          ),
        },
        NoiseAmount: { type: 'f', value: this.options.noiseAmount },
        ErrorPeriod: { type: 'f', value: this.options.errorPeriod },
        ErrorRange: { type: 'f', value: this.options.errorRange },
        tNoise: { type: 't', value: new THREE.TextureLoader().load('/textures/noise.png') },
      },
      vertexShader: require('../shaders/sketch/drawVertex.glsl'),
      fragmentShader: require('../shaders/sketch/finalFragment.glsl')
    };

    this.secondPass = new THREE.ShaderPass(this.secondShader);
    this.secondPass.renderToScreen = true;
    this.secondPass.material.extensions.derivatives = true;

    this.init = this.init.bind(this);
    this.init();

    this.updateOptions = this.updateOptions.bind(this);
  }

  init() {
    this.composer.addPass(this.firstPass);
    this.composer.addPass(this.secondPass);
  }

  update(timeDelta) {
    // put frame updates here.
  }

  updateOptions(data) {
    this.options = data;
    this.secondPass.uniforms.EdgeColor.value = new THREE.Vector4(
      new THREE.Color(this.options.edgeColor).r,
      new THREE.Color(this.options.edgeColor).g,
      new THREE.Color(this.options.edgeColor).b,
      1.0,
    );

    this.secondPass.uniforms.BackgroundColor.value = new THREE.Vector4(
      new THREE.Color(this.options.bgColor).r,
      new THREE.Color(this.options.bgColor).g,
      new THREE.Color(this.options.bgColor).b,
      1.0,
    );

    this.secondPass.uniforms.NoiseAmount.value = this.options.noiseAmount;
    this.secondPass.uniforms.ErrorPeriod.value = this.options.errorPeriod;
    this.secondPass.uniforms.ErrorRange.value = this.options.errorRange;
  }

  getGUI() {
    return (<SketchSettingsMenu data={this.options} updateOptions={this.updateOptions} />);
  }
}

module.exports = SketchStyle;
