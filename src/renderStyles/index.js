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

    this.renderPass = new THREE.RenderPass(this.scene, this.camera);

    this.outlineStyle = new OutlineStyle(this.composer, this.scene, this.camera, defaults);
    this.pixelStyle = new PixelStyle(this.composer, defaults);
    this.sketchStyle = new SketchStyle(this.composer, defaults);
    this.dotShiftStyle = new DotShiftStyle(this.composer, defaults);
    this.afterImageStyle = new AfterImageStyle(this.composer, defaults);
    this.halftoneStyle = new HalftoneStyle(this.composer, defaults);
    this.edgesStyle = new EdgesStyle(this.composer, defaults);
    this.bloomStyle = new BloomStyle(this.composer, defaults);

    // this.add = this.add.bind(this);

    this.add(this.defaultRenderStyle, defaults); // default
  }

  getRenderStyles() {
    return this.renderStyles;
  }

  updateRenderStyle(val) {
    this.add(this.availRenderStyles[val]);
  }

  add(type, defaults) {
    this.removeAll();

    this.composer.addPass(this.renderPass);
    switch (type.toLowerCase()) {
      default:
      case 'normal':
        break;
      case 'outline':
        this.outlineStyle.composer = this.composer;
        this.outlineStyle.init();
        this.selectPerformer = this.outlineStyle.selectPerformer;
        this.deselectPerformer = this.outlineStyle.deselectPerformer;
        this.renderStyles.push(this.outlineStyle);
        break;
      case 'sketch':
        this.sketchStyle.composer = this.composer;
        this.sketchStyle.init();
        this.renderStyles.push(this.sketchStyle);
        break;
      case 'dotshift':
        this.dotShiftStyle.composer = this.composer;
        this.dotShiftStyle.init();
        this.renderStyles.push(this.dotShiftStyle);
        break;
      case 'afterimage':
        this.afterImageStyle.composer = this.composer;
        this.afterImageStyle.init();
        this.renderStyles.push(this.afterImageStyle);
        break;
      case 'halftone':
        this.halftoneStyle.composer = this.composer;
        this.halftoneStyle.init();
        this.renderStyles.push(this.halftoneStyle);
        break;
      case 'pixel':
        this.pixelStyle.composer = this.composer;
        this.pixelStyle.init();
        this.renderStyles.push(this.pixelStyle);
        break;
      case 'edges':
        this.edgesStyle.composer = this.composer;
        this.edgesStyle.init();
        this.renderStyles.push(this.edgesStyle);
        break;
      case 'bloom':
        this.bloomStyle.composer = this.composer;
        this.bloomStyle.init();
        this.renderStyles.push(this.bloomStyle);
        break;
    }
    this.currentRenderStyle = type;
  }

  removeAll() {
    _.each(this.renderStyles, (renderStyle) => {
      if (renderStyle) {
        renderStyle.remove();
      }
    });

    this.composer.reset();
    this.composer.passes = [];
    this.renderStyles = [];
  }

  update(data) {
    _.each(this.renderStyles, (renderStyle) => {
      renderStyle.update(data);
    });
  }
}

module.exports = RenderStyles;
