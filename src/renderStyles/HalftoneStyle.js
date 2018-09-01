/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:58:02
 * @modify date 2018-08-31 04:58:02
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/postprocessing/HalftonePass.js');
require('imports-loader?THREE=three!three/examples/js/shaders/HalftoneShader.js');
require('imports-loader?THREE=three!three/examples/js/shaders/DepthLimitedBlurShader.js');
require('imports-loader?THREE=three!three/examples/js/shaders/UnpackDepthRGBAShader.js');

class HalftoneStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.HalftonePass(this.w, this.h, {
      shape: 1,
      radius: 4,
      rotateR: Math.PI / 12,
      rotateB: Math.PI / 12 * 2,
      rotateG: Math.PI / 12 * 3,
      scatter: 0,
      blending: 1,
      blendingMode: 1,
      greyscale: false,
      disable: false,
    });
    this.firstPass.renderToScreen = true;
    this.composer.addPass(this.firstPass);
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = HalftoneStyle;