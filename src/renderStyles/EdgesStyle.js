/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:54
 * @modify date 2018-08-31 04:57:54
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/shaders/LuminosityShader.js');
require('imports-loader?THREE=three!three/examples/js/shaders/SobelOperatorShader.js');

class EdgesStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    // color to grayscale conversion
    this.firstPass = new THREE.ShaderPass(THREE.LuminosityShader);
    this.composer.addPass(this.firstPass);

    // you might want to use a gaussian blur filter before
    // the next pass to improve the result of the Sobel operator
    // Sobel operator
    this.secondPass = new THREE.ShaderPass(THREE.SobelOperatorShader);
    this.secondPass.renderToScreen = true;
    this.secondPass.uniforms.resolution.value.x = this.w;
    this.secondPass.uniforms.resolution.value.y = this.h;
    this.composer.addPass(this.secondPass);
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = EdgesStyle;