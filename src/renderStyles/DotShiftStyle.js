/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:48
 * @modify date 2018-09-02 05:06:02
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/shaders/DotScreenShader.js');
require('imports-loader?THREE=three!three/examples/js/shaders/RGBShiftShader.js');

import DotShiftSettingsMenu from '../react/menus/render/DotShiftSettingsMenu';

class DotShiftStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.name = 'Dot Shift';

    this.options = {
      dotScale: 3,
      shiftAmt: 0.463,
    };

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.ShaderPass(THREE.DotScreenShader);
    this.firstPass.uniforms['scale'].value = this.options.dotScale;
    this.composer.addPass(this.firstPass);

    this.secondPass = new THREE.ShaderPass(THREE.RGBShiftShader);
    this.secondPass.uniforms['amount'].value = this.options.shiftAmt;
    this.secondPass.renderToScreen = true;
    this.composer.addPass(this.secondPass);

    this.updateOptions = this.updateOptions.bind(this);
  }

  remove() {
    // this.composer.removePass(this.firstPass);
    this.firstPass = null;

    // this.composer.removePass(this.secondPass);
    this.secondPass = null;
  }

  update(timeDelta) {
    // put frame updates here.
  }

  updateOptions(data) {
    this.options = data;
    this.firstPass.uniforms['scale'].value = this.options.dotScale;
    this.secondPass.uniforms['amount'].value = this.options.shiftAmt;
  }

  getGUI() {
    return (<DotShiftSettingsMenu data={this.options} updateOptions={this.updateOptions} />);
  }
}

module.exports = DotShiftStyle;
