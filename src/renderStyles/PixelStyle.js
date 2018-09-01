/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:58:09
 * @modify date 2018-08-31 04:58:09
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/shaders/PixelShader.js');

class PixelStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.ShaderPass(THREE.PixelShader);
    this.firstPass.uniforms.resolution.value = new THREE.Vector2(this.w, this.h);
    this.firstPass.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio);
    this.firstPass.uniforms.pixelSize.value = 8;
    this.firstPass.renderToScreen = true;
    this.composer.addPass(this.firstPass);
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = PixelStyle;