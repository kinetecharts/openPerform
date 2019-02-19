/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 12:40:29
 * @modify date 2018-08-31 12:40:29
 * @desc [Switcher to handle different render / postprocessing effects.]
*/

import SketchStyle from './SketchStyle';
import DotShiftStyle from './DotShiftStyle';
import AfterImageStyle from './AfterImageStyle';
import HalftoneStyle from './HalftoneStyle';
import PixelStyle from './PixelStyle';
import EdgesStyle from './EdgesStyle';
import BloomStyle from './BloomStyle';

import config from './../config';

class RenderStyles {
  constructor(composer, scene, camera, defaults) {
    this.composer = composer;
    this.scene = scene;
    this.camera = camera;

    this.defaultRenderStyle = config.defaults.renderStyle.toLowerCase();

    this.currentRenderStyle = this.defaultRenderStyle;
    console.log("Loading default render style: ", this.currentRenderStyle);
    this.availRenderStyles = config.availRenderStyles;
    this.renderStyles = [];

    // this.currentEnvironment = this.defaultEnvironment;
    // console.log("Loading default environment: ", this.currentEnvironment);
    // this.availEnvironments = config.availEnvironments;
    // this.environments = [];

    // this.gui = new dat.GUI({ autoPlace: false, width: "100%" });
    // this.guiDOM = this.gui.domElement;
    // // this.guiFolder = this.gui.addFolder('Environments');
    // // this.guiFolder.open();

    this.updateRenderStyle = this.updateRenderStyle.bind(this);

    this.add(this.defaultRenderStyle, defaults); // default
  }

  getRenderStyles() {
    return this.renderStyles;
  }

  updateRenderStyle(val) {
    this.currentRenderStyle = val;
    this.add(this.availRenderStyles[val]);
  }

  add(type, defaults) {
    this.composer.reset();
    this.composer.addPass(new THREE.RenderPass(this.scene, this.camera));
    this.removeAll();
    switch (type.toLowerCase()) {
      default:
      case 'normal':
        break;
      case 'sketch':
        this.renderStyles.push(new SketchStyle(this.composer, defaults));
        break;
      case 'dotshift':
        this.renderStyles.push(new DotShiftStyle(this.composer, defaults));
        break;
      case 'afterimage':
        this.renderStyles.push(new AfterImageStyle(this.composer, defaults));
        break;
      case 'halftone':
        this.renderStyles.push(new HalftoneStyle(this.composer, defaults));
        break;
      case 'pixel':
        this.renderStyles.push(new PixelStyle(this.composer, defaults));
        break;
      case 'edges':
        this.renderStyles.push(new EdgesStyle(this.composer, defaults));
        break;
      case 'bloom':
        this.renderStyles.push(new BloomStyle(this.composer, defaults));
        break;
    }
    this.currentRenderStyle = type;
  }

  removeAll() {
    _.each(this.renderStyles, (renderStyle) => {
      if (renderStyle) {
        // renderStyle.remove();
      }
    });
    this.renderStyles = [];
  }

  update(data) {
    _.each(this.renderStyles, (renderStyle) => {
      renderStyle.update(data);
    });
  }
}

module.exports = RenderStyles;
