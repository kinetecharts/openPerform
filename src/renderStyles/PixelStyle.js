/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:58:09
 * @modify date 2018-09-02 06:15:46
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/shaders/PixelShader.js');

import PixelSettingsMenu from '../react/menus/render/PixelSettingsMenu';

class PixelStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.name = 'Pixel';

    this.options = {
      pixelSize: 13
    };

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.ShaderPass(THREE.PixelShader);
    this.firstPass.uniforms.resolution.value = new THREE.Vector2(this.w, this.h);
    this.firstPass.uniforms.resolution.value.multiplyScalar(window.devicePixelRatio);
    this.firstPass.uniforms.pixelSize.value = this.options.pixelSize;
    
    this.init = this.init.bind(this);
    
    this.updateOptions = this.updateOptions.bind(this);
  }

  init() {
    this.firstPass.renderToScreen = true;

    this.composer.addPass(this.firstPass);
  }

  remove() {
    this.firstPass.renderToScreen = false;
  }

  update(timeDelta) {
    // put frame updates here.
  }

  updateOptions(data) {
    this.options = data;
    this.firstPass.uniforms.pixelSize.value = this.options.pixelSize;
  }

  getGUI() {
    return (<PixelSettingsMenu data={this.options} updateOptions={this.updateOptions} />);
  }
}

module.exports = PixelStyle;
