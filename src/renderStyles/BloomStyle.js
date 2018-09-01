/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:41
 * @modify date 2018-08-31 04:57:41
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/shaders/LuminosityHighPassShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/UnrealBloomPass.js');

class BloomStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.UnrealBloomPass( new THREE.Vector2( this.w, this.h ), 1.5, 0.4, 0.85 );
    this.firstPass.renderToScreen = true;
    this.firstPass.threshold = 0;
    this.firstPass.strength = 1.5;
    this.firstPass.radius = 0;
    this.composer.addPass(this.firstPass);
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = BloomStyle;