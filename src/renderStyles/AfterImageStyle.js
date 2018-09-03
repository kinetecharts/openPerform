/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:33
 * @modify date 2018-09-02 04:39:49
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

import AfterImageSettingsMenu from '../react/menus/render/AfterImageSettingsMenu';

class AfterImageStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.name = 'After Image';

    this.options = {
      damn: 0.96,
    };

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.afterimagePass = new THREE.AfterimagePass(this.options.damp);
    this.afterimagePass.renderToScreen = true;
    this.composer.addPass(this.afterimagePass);

    this.updateOptions = this.updateOptions.bind(this);
  }

  update(timeDelta) {
    // put frame updates here.
  }

  updateOptions(data) {
    this.options = data;
    this.afterimagePass.uniforms['damp'].value = this.options.damp;
  }

  getGUI() {
    return (<AfterImageSettingsMenu data={this.options} updateOptions={this.updateOptions} />);
  }
}

module.exports = AfterImageStyle;
