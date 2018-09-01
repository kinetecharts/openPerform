/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:48
 * @modify date 2018-08-31 04:57:48
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/shaders/DotScreenShader.js');
require('imports-loader?THREE=three!three/examples/js/shaders/RGBShiftShader.js');
    
class DotShiftStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.ShaderPass(THREE.DotScreenShader);
    this.firstPass.uniforms['scale'].value = 4;
    this.composer.addPass(this.firstPass);
    
    this.secondPass = new THREE.ShaderPass(THREE.RGBShiftShader);
    this.secondPass.uniforms['amount'].value = 0.0015;
    this.secondPass.renderToScreen = true;
    this.composer.addPass(this.secondPass);
  }

  update(timeDelta) {
    // put frame updates here.
  }
}

module.exports = DotShiftStyle;