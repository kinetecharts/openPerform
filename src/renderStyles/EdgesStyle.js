/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:54
 * @modify date 2018-09-02 05:16:26
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/EffectComposer.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/RenderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/MaskPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');

require('imports-loader?THREE=three!three/examples/js/shaders/LuminosityShader.js');
require('imports-loader?THREE=three!three/examples/js/shaders/SobelOperatorShader.js');

import EdgesSettingsMenu from '../react/menus/render/EdgesSettingsMenu';

class EdgesStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.name = 'Edges';

    this.options = {};

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    // color to grayscale conversion
    this.firstPass = new THREE.ShaderPass(THREE.LuminosityShader);

    // you might want to use a gaussian blur filter before
    // the next pass to improve the result of the Sobel operator
    // Sobel operator
    this.secondPass = new THREE.ShaderPass(THREE.SobelOperatorShader);
    this.secondPass.uniforms.resolution.value.x = this.w;
    this.secondPass.uniforms.resolution.value.y = this.h;
    
    this.init = this.init.bind(this);

    this.updateOptions = this.updateOptions.bind(this);
  }

  init() {
    this.firstPass.clear = true;

    this.secondPass.clear = true;
    this.secondPass.enabled = true;
    this.secondPass.renderToScreen = true;

    this.composer.addPass(this.firstPass);
    this.composer.addPass(this.secondPass);
  }

  remove() {
    this.secondPass.enabled = false;
    this.secondPass.renderToScreen = false;
  }

  update(timeDelta) {
    // put frame updates here.
  }

  updateOptions(data) {
    this.options = data;
  }

  getGUI() {
    return (<EdgesSettingsMenu data={this.options} updateOptions={this.updateOptions} />);
  }
}

module.exports = EdgesStyle;