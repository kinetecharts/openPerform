/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-31 04:57:41
 * @modify date 2018-09-02 04:51:07
 * @desc [description]
*/

require('imports-loader?THREE=three!three/examples/js/shaders/CopyShader.js');
require('imports-loader?THREE=three!three/examples/js/shaders/FXAAShader.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/ShaderPass.js');
require('imports-loader?THREE=three!three/examples/js/postprocessing/OutlinePass.js');

class OutlineStyle {
  constructor(composer, scene, camera, defaults) {
    this.composer = composer;
    this.scene = scene;
    this.camera = camera;
    this.defaults = defaults;

    this.name = 'Outline';

    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.selectedObjects = [];

    this.container = $('#scenes');
    this.w = this.container.width();
    this.h = this.container.height();

    this.firstPass = new THREE.OutlinePass(
      new THREE.Vector2(this.w, this.h),
      this.scene,
      this.camera,
    );
    this.updateOptions(this.defaults);

    new THREE.TextureLoader().load('textures/tri_pattern.jpg', (texture) => {
      this.firstPass.patternTexture = texture;
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
    });

    this.effectFXAA = new THREE.ShaderPass(THREE.FXAAShader);
    this.effectFXAA.uniforms['resolution'].value.set(1 / this.w, 1 / this.h);
    this.effectFXAA.renderToScreen = true;
    
    this.init = this.init.bind(this);
    this.init();
    
    this.updateOptions = this.updateOptions.bind(this);
    this.selectPerformer = this.selectPerformer.bind(this);
    this.deselectPerformer = this.deselectPerformer.bind(this);
  }

  init() {
    this.composer.addPass(this.firstPass);
    this.composer.addPass(this.effectFXAA);
  }

  selectPerformer(performer) {
    this.firstPass.selectedObjects = performer.getMeshes();
  }

  deselectPerformer() {
    this.firstPass.selectedObjects = [];
  }

  update(timeDelta) {
    // put frame updates here.
  }

  updateOptions(data) {
    this.firstPass.edgeStrength = data.edgeStrength;
    this.firstPass.edgeGlow = data.edgeGlow;
    this.firstPass.edgeThickness = data.edgeThickness;
    this.firstPass.pulsePeriod = data.pulsePeriod;
    this.firstPass.usePatternTexture = data.usePatternTexture;
    this.firstPass.visibleEdgeColor.set(data.visibleEdgeColor);
    this.firstPass.hiddenEdgeColor.set(data.hiddenEdgeColor);
  }
}

module.exports = OutlineStyle;