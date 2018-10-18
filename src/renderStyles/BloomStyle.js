/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:41
 * @modify date 2018-09-02 04:51:07
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass.js');

import BloomSettingsMenu from '../react/menus/render/BloomSettingsMenu';

class BloomStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.name = 'Bloom';

    this.options = {
      threshold: 0,
      strength: 1.5,
      radius: 0,
    };

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.UnrealBloomPass(
      new THREE.Vector2(this.w, this.h),
      this.options.strength,
      this.options.radius,
      this.options.threshold,
    );
    this.firstPass.renderToScreen = true;
    
    this.init = this.init.bind(this);
    this.init();

    this.updateOptions = this.updateOptions.bind(this);
  }

  init() {
    this.composer.addPass(this.firstPass);
  }

  update(timeDelta) {
    // put frame updates here.
  }

  updateOptions(data) {
    this.options = data;
    this.firstPass.threshold = data.threshold;
    this.firstPass.strength = data.strength;
    this.firstPass.radius = data.radius;
  }

  getGUI() {
    return (<BloomSettingsMenu data={this.options} updateOptions={this.updateOptions} />);
  }
}

module.exports = BloomStyle;