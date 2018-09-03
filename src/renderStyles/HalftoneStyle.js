/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:58:02
 * @modify date 2018-09-02 05:58:06
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

import HalftoneSettingsMenu from '../react/menus/render/HalftoneSettingsMenu';

class HalftoneStyle {
  constructor(composer, defaults) {
    this.composer = composer;
    this.defaults = defaults;

    this.name = 'Halftone';

    this.options = {
      shapeName: 'Dot',
      shape: 1,
      shapes: ['Dot', 'Ellipse', 'Line', 'Square'],
      radius: 4,
      rotateR: Math.PI / 12,
      rotateB: (Math.PI / 12) * 2,
      rotateG: (Math.PI / 12) * 3,
      scatter: 0,
      blending: 1,
      blendingModeName: 'Linear',
      blendingMode: 1,
      blendingModes: ['Linear', 'Multiply', 'Add', 'Lighter', 'Darker'],
      greyscale: false,
      disable: false,
    };

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.HalftonePass(this.w, this.h, this.options);
    this.firstPass.renderToScreen = true;
    this.composer.addPass(this.firstPass);

    this.updateOptions = this.updateOptions.bind(this);
  }

  update(timeDelta) {
    // put frame updates here.
  }

  updateOptions(data) {
    this.firstPass.uniforms.radius.value = data.radius;
    this.firstPass.uniforms.rotateR.value = data.rotateR * (Math.PI / 180);
    this.firstPass.uniforms.rotateG.value = data.rotateG * (Math.PI / 180);
    this.firstPass.uniforms.rotateB.value = data.rotateB * (Math.PI / 180);
    this.firstPass.uniforms.scatter.value = data.scatter;
    this.firstPass.uniforms.shape.value = data.shapes.indexOf(data.shapeName) + 1;
    this.firstPass.uniforms.greyscale.value = data.greyscale;
    this.firstPass.uniforms.blending.value = data.blending;
    this.firstPass.uniforms.blendingMode.value = data.blendingModes.indexOf(data.blendingModeName) + 1;
    this.firstPass.uniforms.disable.value = data.disable;

    this.options = data;
  }

  getGUI() {
    return (<HalftoneSettingsMenu data={this.options} updateOptions={this.updateOptions} />);
  }
}

module.exports = HalftoneStyle;
