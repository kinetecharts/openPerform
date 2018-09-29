/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 12:40:29
 * @modify date 2018-08-31 12:40:29
 * @desc [Switcher to handle different render / postprocessing effects.]
*/

require('three/examples/js/shaders/CopyShader.js');
require('three/examples/js/shaders/FXAAShader.js');
require('three/examples/js/postprocessing/ShaderPass.js');
require('three/examples/js/postprocessing/OutlinePass.js');

import SketchStyle from './SketchStyle';
import DotShiftStyle from './DotShiftStyle';
import AfterImageStyle from './AfterImageStyle';
import HalftoneStyle from './HalftoneStyle';
import PixelStyle from './PixelStyle';
import EdgesStyle from './EdgesStyle';
import BloomStyle from './BloomStyle';
import OutlineStyle from './OutlineStyle';

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

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedObjects = [];

    this.updateRenderStyle = this.updateRenderStyle.bind(this);

    this.selectPerformer = () => {};
    this.deselectPerformer = () => {};

    if (config.defaults.performerOutline) {
      this.add('outline', {
        edgeStrength: 6.0,
        edgeGlow: 1.0,
        edgeThickness: 2.0,
        pulsePeriod: 1,
        rotate: false,
        usePatternTexture: true,
        visibleEdgeColor: '#ffffff',
        hiddenEdgeColor: '#190a05',
      });
    }

    this.add(this.defaultRenderStyle, defaults); // default
  }

  getRenderStyles() {
    return this.renderStyles;
  }

  updateRenderStyle(val) {
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
      case 'outline':
        let outline = new OutlineStyle(this.composer, this.scene, this.camera, defaults);
        this.selectPerformer = outline.selectPerformer;
        this.deselectPerformer = outline.deselectPerformer;
        this.renderStyles.push(outline);
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
