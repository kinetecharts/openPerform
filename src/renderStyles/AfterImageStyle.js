/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:33
 * @modify date 2018-08-31 04:57:33
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/postprocessing/AfterimagePass.js');
require('imports-loader?THREE=three!three/examples/js/shaders/AfterimageShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/AfterimagePass.js');

class AfterImageStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.afterimagePass = new THREE.AfterimagePass();
    this.afterimagePass.renderToScreen = true;
    this.composer.addPass(this.afterimagePass);
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = AfterImageStyle;