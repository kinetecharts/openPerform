/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-02 10:45:28
 * @modify date 2018-09-02 10:45:28
 * @desc [description]
*/

// Parent should be a Three Scene, updateFromPN recieves data from PerceptionNeuron.js
import TWEEN from 'tween.js';

require('three/examples/js/controls/TransformControls.js');
require('three/examples/js/utils/SkeletonUtils.js');

require('./../libs/BufferGeometryMerge.js');

import PerformerEffects from './../effects/performer';

import SkeletalTranslator from './SkeletalTranslator';
import FileLoader from '../util/Loader.js';

import Common from './../util/Common';

import config from './../config';

class Performer {
  constructor(parent, inputId, performerId, type, leader, actions, inputManager, outputManager, options, character, scene) {
    this.activeTimeout == null;
    this.ranges = {
      min: new THREE.Vector3(),
      max: new THREE.Vector3(),
    }
    window.bonescale = 45;
    this.character = character;
    window.lineVisible = true;
    window.toggleLineVislble = () => { window.lineVisible = !window.lineVisible }

    this.inputManager = inputManager;
    this.outputManager = outputManager;

    this.skeletalTranslator = new SkeletalTranslator();

    this.actions = actions;

    this.dataBuffer = [];
    this.delay = 0;
    this.origScale = 1;
    this.scale = 1;
    
    this.styleInt = null;
    this.modelGeos = {};
    this.colladaScenes = {};
    this.animationMixers = [];

    this.parent = parent;
    this.inputId = inputId;
    this.type = type;
    this.leader = leader;

    this.performer = null;
    this.name = 'Performer ' + performerId;

    this.loader = new FileLoader();
    
    (options.offset == null) ? this.offset = new THREE.Vector3(0, 0, 0) : this.offset = options.offset;
    this.rotation = new THREE.Euler(0, 0, 0);
    
    if (this.type === 'clone_bvh' || this.type === 'clone_perceptionNeuron' || this.type === 'clone_poseNet') {
      if (options.offset == null) {
        this.offset = new THREE.Vector3((parseInt(performerId) - 1), 0, 0);
      }
      this.name = 'Clone ' + (parseInt(performerId) - 1);
    }
    this.color = options.color;

    this.prefix = 'mixamorig';

    this.wireframe = options.wireframe;
    this.visible = options.visible;
    this.following = options.following;
    this.snorried = options.snorry;
    this.firstPersoned = options.firstPerson;

    this.styles = ['default', 'boxes', 'spheres', 'planes', 'robot', 'discs', 'hands', 'heads'];
    this.styleId = this.styles.indexOf(options.style);
    this.style = options.style;
    this.intensity = options.intensity;

    this.material = options.material.toLowerCase();
    this.materials = ['Shader', 'Basic', 'Lambert', 'Phong', 'Standard'];

    this.displayType = { value: 'bvhMeshGroup', label: 'Mesh Group' };
    this.displayTypes = [
      { value: 'bvhMeshGroup', label: 'Mesh Group' },
      // { value: 'abstractLines', label: 'Abstract Lines' },
      // { value: 'stickFigure', label: 'Stick Figure' },
      
      // { value: 'riggedMesh', label: 'Rigged Model' },
    ];

    // this.loadColladaModels([
    //  {
    //    id:'oxygen',
    //    url: '/models/dae/oxygen_atom.dae'
    //  }
    // ]);

    // this.loadFBXModels([
    //  {
    //    id:'oxygen',
    //    url: '/models/fbx/oxygen_atom.fbx'
    //  }
    // ]);

    this.loadObjModels([
      {
        id: 'hand',
        url: '/models/obj/hand.obj',
      },
      {
        id: 'head',
        url: '/models/obj/head.obj',
      },
      /* {
        id:'chair',
        url: '/models/obj/chair.obj'
      },
      {
        id:'heart',
        url: '/models/obj/heart.obj'
      } */
    ]);

    this.scene = null;
    this.modelShrink = 100;

    this.hiddenParts = [
      // 'hips'
    ];

    console.log('New Performer: ', this.inputId);

    this.effects = config.effects;

    // this.gui = new dat.GUI({ autoPlace: true });
    // this.guiFolder = this.gui.addFolder(this.name + ' Effects');
    // this.guiFolder.open()

    this.performerEffects = new PerformerEffects(this.parent, parseInt(this.color, 16));

    this.addEffects([config.defaults.performer.effect]);//defaults

    this.scaleInterval = null;
    this.colorInterval = null;
  }

  loadColladaModels(models) {
    _.each(models, (m) => {
      this.loader.loadCollada(m.url, { id: m.id }, (result, props) => {
        this.setColladaScenes(props.id, result.scene);
      });
    });
  }

  loadFBXModels(models) {
    _.each(models, (m) => {
      this.loader.loadFBX(m.url, { id: m.id }, (object) => {
        object.mixer = new THREE.AnimationMixer(object);

        this.animationMixers.push(object.mixer);
        const action = object.mixer.clipAction(object.animations[0]);
        action.play();

        this.setColladaScenes(id, object);
      });
    });
  }

  loadObjModels(models) {
    _.each(models, (m) => {
      this.loader.loadOBJ(m.url, { id: m.id }, (object, props) => {
        let singleGeo = null;
        object.traverse((child) => {
          // console.log(child.name, child.type);
          if (child instanceof THREE.Mesh) {
            if (!singleGeo) {
              singleGeo = child.geometry;
            } else {
              child.updateMatrix();
              singleGeo.merge(child.geometry, child.matrix);
            }
          }
        });
        this.setModelGeo(props.id, singleGeo);
      });
    });
  }

  loadPerformer(source, type, hide, size, style, intensity) {
    switch (type) {
      case 'bvhMeshGroup':
        this.loadSceneBody(source, './models/json/avatar.json', hide, size, style, intensity);
        break;
      case 'meshGroup':
        this.loadMeshGroupBody(source, './models/characters/alien/', hide, size, style, intensity);
        break;
      case 'riggedMesh':
        // this.loadColladaBody(source, './models/characters/astronaut/model.fbx', hide, size, style, intensity);
        this.loadFBXBody(source, './models/characters/' + this.character.name + '/model.fbx', hide, size, style, intensity);
        break;
      case 'riggedKinect':
        this.loadGLTFBody(source, './models/gltf/rick_sanchez/scene.gtlf', hide, size, style, intensity);
        break;
      case 'abstractLines':
        this.createAbstractLines(source, '', hide, size, style, intensity);
        break;
      case 'stickFigure':
        this.createStickFigure(source, '', hide, size, style, intensity);
        break;
    }
  }

  loadGLTFBody(source, filename, hide, size, style, intensity) {
    this.prefix = 'mixamorig';

    this.setPerformer({
      meshes: {},
      newMeshes: [],
      keys: {},
      scene: null,
    });


    this.loader.loadGLTF(filename, {}, (result) => {
      const meshes = {};
      const newMeshes = {};
      const keys = {};
      let s = result.scene;

      // console.log(result.scene);
      // s.traverse((object) => {
      //   //  // console.log(object.name + ': ' + object.type);
      //   switch (object.type) {
      //     case 'SkinnedMesh':
      //       s = object;
      // //      meshes[this.prefix+object.name.toLowerCase()] = object;
      // //      keys[this.prefix+object.name.toLowerCase()] = this.prefix+object.name.toLowerCase();
      // //      break;
      //   }
      // });

      // s.scale.set(size, size, size);
      // // console.log(s.skeleton);

      // _.each(s.skeleton.bones, (b) => {
      //   meshes[this.prefix + b.name.toLowerCase()] = b;
      //   b.srcScale = 0.1;
      //   newMeshes[this.prefix + b.name.toLowerCase()] = b;
      //   keys[this.prefix + b.name.toLowerCase()] = this.prefix + b.name.toLowerCase();
      // });

      // console.log(meshes);
      // console.log(keys);

      this.setScene(s);
      window.s = s;
      this.parent.add(s);

      this.setPerformer({
        meshes,
        newMeshes,
        keys,
        scene: this.getScene(),
      });
    });
  }

  loadColladaBody(source, filename, hide, size, style, intensity) {
    this.prefix = 'mixamorig';

    this.setPerformer({
      meshes: {},
      newMeshes: [],
      keys: {},
      scene: null,
    });


    this.loader.loadCollada(filename, {}, (result) => {
      const meshes = {};
      const newMeshes = {};
      const keys = {};
      let s = result.scene;

      // console.log(result.scene);
      s.traverse((object) => {
        //  // console.log(object.name + ': ' + object.type);
        switch (object.type) {
          case 'SkinnedMesh':
            s = object;
      //      meshes[this.prefix+object.name.toLowerCase()] = object;
      //      keys[this.prefix+object.name.toLowerCase()] = this.prefix+object.name.toLowerCase();
      //      break;
        }
      });

      s.scale.set(size, size, size);
      // console.log(s.skeleton);

      _.each(s.skeleton.bones, (b) => {
        meshes[this.prefix + b.name.toLowerCase()] = b;
        b.srcScale = 0.1;
        newMeshes[this.prefix + b.name.toLowerCase()] = b;
        keys[this.prefix + b.name.toLowerCase()] = this.prefix + b.name.toLowerCase();
      });

      // console.log(meshes);
      // console.log(keys);

      this.setScene(s);
      window.s = s;
      this.parent.add(s);

      this.setPerformer({
        meshes,
        newMeshes,
        keys,
        scene: this.getScene(),
      });
    });
  }

  loadFBXBody(source, filename, hide, size, style, intensity) {
    this.prefix = 'mixamorig';

    this.setPerformer({
      meshes: {},
      bones: {},
      newMeshes: [],
      keys: {},
      scene: null,
    });

    console.log('Loading: ', filename);

    this.loader.loadFBX(filename, {}, (result) => {
      const meshes = {};
      const bones = {};
      const newMeshes = {};
      const keys = {};
      let s = null;

      result.traverse((object) => {
        //  // console.log(object.name + ': ' + object.type);
        switch (object.type) {
          case 'SkinnedMesh':
            s = object;
            s.material.transparent = true;
            s.material.opacity = 1;
            s.receiveShadow = true;
            s.castShadow = true;
            // s.visible = false;
           break;
        }
      });
      window.character = result;
      result.scale.set(size, size, size);
      console.log(result);

      _.each(s.skeleton.bones, (b) => {
        b.srcMatrix = b.matrix.clone();
        b.srcMatrixWorld = b.matrixWorld.clone();
        b.srcPosition = b.position.clone();
        b.srcQuaternion = b.quaternion.clone();
        b.srcScale = b.scale.x;

        meshes[b.name.toLowerCase()] = b;
        bones[b.name.toLowerCase()] = b;
        newMeshes[b.name.toLowerCase()] = b;
        keys[b.name.toLowerCase()] = b.name.toLowerCase();
      });

      console.log('Bone Names: ' + _.map(bones, 'name'));

      this.skeletonHelper = new THREE.SkeletonHelper(result.children[2]);
			this.skeletonHelper.skeleton = s.skeleton;
			this.parent.add(this.skeletonHelper);

      result.clock = new THREE.Clock();
      result.mixer = new THREE.AnimationMixer(result);
      // result.mixer.clipAction(result.animations[0]).play();

      this.setScene(result);
      this.parent.add(result);

      this.setPerformer({
        meshes,
        bones,
        newMeshes,
        keys,
        scene: this.getScene(),
      });

      this.addEffects([
        this.character.effect
      ]);
    });
  }

  loadMeshGroupBody(source, folderPath, hide, size, style, intensity) {
    this.prefix = 'mixamorig';
    
    this.setPerformer({ loading: true });
    this.loader.loadJSONs([
      folderPath + 'chest.json',
      folderPath + 'head.json',
      folderPath + 'hips.json',
      folderPath + 'lArm.json',
      folderPath + 'lFoot.json',
      folderPath + 'lForearm.json',
      folderPath + 'lHand.json',
      folderPath + 'lShin.json',
      folderPath + 'lThigh.json',
      folderPath + 'neck.json',
      folderPath + 'rArm.json',
      folderPath + 'rFoot.json',
      folderPath + 'rForearm.json',
      folderPath + 'rHand.json',
      folderPath + 'rShin.json',
      folderPath + 'rThigh.json',
      folderPath + 'spine.json',
      folderPath + 'spine2.json',
      folderPath + 'spine3.json',
    ], {}, (results) => {
      // result.scene.visible = false;
      // console.log(result.scene);
      let scene = new THREE.Object3D();
      let bboxes = new THREE.Object3D();
      let meshes = {}
      let boxes = {};
      this.setScene(scene);
      this.getScene().scale.set(size, size, size);
      _.each(results, (result) => {
        let mesh = new THREE.Mesh(result.geo, new THREE.MeshPhongMaterial({color: 0x626653}));
        let box = new THREE.BoxHelper(mesh, 0xffff00);

        mesh.srcQuat = mesh.quaternion.clone();
        mesh.name = result.name;
        box.name = result.name;

        let jointNames = _.filter(this.skeletalTranslator.kinectPairs, (p) => {
          return p.indexOf(this.skeletalTranslator.kinectronMeshGroupKeys[result.name]) !== -1;
        })[0];

        console.log(jointNames);

        mesh.jointNames = jointNames;
        box.jointNames = jointNames;

        bboxes.add(box);
        scene.add(mesh);

        meshes[result.name] = mesh;
        boxes[result.name] = box;
      });

      this.setPerformer({
        keys: this.skeletalTranslator.bvhKeys,
        meshes: meshes,
        boxes: boxes,
        newMeshes: {},
        scene: scene,
      });
      this.parent.add(scene);
      this.parent.add(bboxes);

      console.log(_.map(meshes, 'name'));
    });
    // this.loader.loadScene(filename, {}, (result) => {
    //   result.scene.visible = false;
    //   console.log(result.scene);
    //   this.setScene(result.scene);
      
    //   this.getScene().scale.set(size, size, size);
      
    //   this.setPerformer(this.parseBVHGroup(source, hide, style, intensity));
    //   const s = this.getScene();
    //   s.position.copy(this.getOffset().clone());
    //   this.parent.add(s);
    //   // this.addEffects([
    //     // this.effects[4],
    //   //   // this.effects[6] // Midi Streamer
    //   // ]);// defaults
    // });
  }

  loadSceneBody(source, filename, hide, size, style, intensity) {
    this.prefix = 'mixamorig';
    
    this.loader.loadScene(filename, {}, (result) => {
      result.scene.visible = false;
      console.log(result.scene);
      this.setScene(result.scene);
      
      this.getScene().scale.set(size, size, size);
      
      this.setPerformer(this.parseBVHGroup(source, hide, style, intensity));
      const s = this.getScene();
      s.position.copy(this.getOffset().clone());
      this.parent.add(s);
      // this.addEffects([
        // this.effects[4],
      //   // this.effects[6] // Midi Streamer
      // ]);// defaults
    });
  }

  createStickFigure(source, filename, hide, size, style, intensity) {
  }

  createAbstractLines(source, filename, hide, size, style, intensity) {
    // this.setScene(result.scene);
    // this.parent.add(s);

    var geometry = new THREE.BufferGeometry();
    var material = new THREE.LineBasicMaterial( { vertexColors: THREE.VertexColors } );
    var indices = [];
    var positions = [];
    var colors = [];
    
    positions.push( 0, 0, 0 );
    colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );
    indices.push( 0, 0 + 1 );
    positions.push( 10, 0, 0 );
    colors.push( Math.random() * 0.5 + 0.5, Math.random() * 0.5 + 0.5, 1 );
    indices.push( 1, 1 + 1 );
    
    geometry.setIndex( indices );
    geometry.addAttribute( 'position', new THREE.Float32BufferAttribute( positions, 3 ) );
    geometry.addAttribute( 'color', new THREE.Float32BufferAttribute( colors, 3 ) );
    geometry.computeBoundingSphere();
    var mesh = new THREE.LineSegments( geometry, material );
    
    // this.setScene(mesh);
    // this.parent.add(mesh);

    const scene = new THREE.Object3D();
    scene.add(mesh);
    this.setScene(scene);
    console.log(source);
    switch (source) {
      default:
        case 'bvh':
        case 'clone_bvh':
          this.getScene().scale.set(size, size, size);
          break;
    }

    this.setPerformer({
      keys: this.skeletalTranslator.bvhKeys,
      meshes: {},
      newMeshes: {},
      scene: scene,
    });
    const s = this.getScene();
    s.position.copy(this.getOffset().clone());
    this.parent.add(s);
    this.addEffects([
      this.effects[2],
      // this.effects[6] // Midi Streamer
    ]);// defaults
  }

  setPerformer(performer) {
    this.performer = performer;
  }

  getPerformer() {
    return this.performer;
  }

  clearPerformer() {
    this.clearScene();
    this.setPerformer(null);
  }

  setType(type) {
    console.log(type);
    if (this.getType() !== type) {
      this.displayType = type;
      this.clearPerformer();
    }
  }

  getType(type) {
    return this.displayType;
  }

  getTypes(type) {
    return this.displayTypes;
  }

  clearScene() {
    this.parent.remove(this.getScene());
    if (this.lineGroup) { this.parent.remove(this.lineGroup); }
    if (this.axesGroup) { this.parent.remove(this.axesGroup); }
    if (this.cubeBoneGroup) { this.parent.remove(this.cubeBoneGroup); }
    if (this.skeletonHelper) { this.parent.remove(this.skeletonHelper); }
    this.scene = null;
  }

  setScene(scene) {
    this.scene = scene;
    this.scene.distances = {};
    this.scene.outputManager = this.outputManager;
  }

  getScene() {
    return this.scene;
  }

  getWireframe() {
    return this.wireframe;
  }

  getMaterialColor() {
    return this.color;
  }

  setMaterialColor(color) {
    this.color = color;
    this.updateMaterialColor();
  }

  updateMaterialColor() {
    _.each(this.getPerformer().meshes, (parent) => {
      parent.traverse((object) => {
        if (object.hasOwnProperty('material')) {
          object.material.color.set(parseInt(this.getMaterialColor(), 16));
        }
      });
    });
  }

  getStyleInt() {
    return this.styleInt;
  }

  setStyleInt(styleInt) {
    this.styleInt = styleInt;
  }

  getIntensity() {
    return this.intensity;
  }

  setIntensity(intensity) {
    this.intensity = intensity;
  }

  getStyles() {
    return this.styles;
  }

  getStyle() {
    return this.style;
  }

  getStyleId() {
    return this.styleId;
  }

  setStyleId(id) {
    this.styleId = id;
  }

  getNextStyle() {
    const styles = this.getStyles();
    let id = this.getStyleId();
    id++;
    if (id > styles.length - 1) {
      id = 0;
    }
    this.setStyleId(id);
    return styles[id];
  }

  getPrevStyle() {
    const styles = this.getStyles();
    let id = this.getStyleId();
    id--;
    if (id < 0) {
      id = styles.length - 1;
    }
    this.setStyleId(id);
    return styles[id];
  }

  setStyle(style) {
    this.style = style;
  }

  getHiddenParts() {
    return this.hiddenParts;
  }

  toggleVisible(val) {
    this.setVisible(!this.getVisible());
  }

  getVisible() {
    return this.visible;
  }

  setVisible(val) {
    this.visible = val;
    this.getScene().visible = val;
  }

  getMaterial() {
    return this.material;
  }

  setMaterial(val) {
    this.material = val;
  }

  getMaterials() {
    return this.materials;
  }

  generateMaterial() {
    let material = new THREE.MeshBasicMaterial(); 
    switch (this.getMaterial().toLowerCase()) {
      case 'shader':    
        break;
      case 'lambert':
        material = new THREE.MeshLambertMaterial();
        break;
      default:
      case 'phong':
        material = new THREE.MeshPhongMaterial();
        break;
      case 'standard':
        material = new THREE.MeshStandardMaterial();
        break;
    }
    material.wireframe = this.getWireframe();
    material.color.set(parseInt(this.getMaterialColor(), 16));
    return material;
  }

  updateMaterial() {
    _.each(this.getPerformer().meshes, (parent) => {
      parent.traverse((object) => {
        if (object.hasOwnProperty('material')) {
          object.material = this.generateMaterial(this.getMaterial());
          object.material.needsUpdate = true;
        }
      });
    });
  }

  toggleSnorried() { this.setSnorried(!this.getSnorried()); }
  getSnorried() { return this.snorried; }
  setSnorried(val) { this.snorried = val; }
  clearSnorried() { this.snorried = false; }

  toggleFirstPersoedn() { this.setFirstPersoned(!this.getFirstPersoned()); }
  getFirstPersoned() { return this.firstPersoned; }
  setFirstPersoned(val) { this.firstPersoned = val; }
  clearFirstPersoned() { this.firstPersoned = false; }

  toggleFollowing() { this.setFollowing(!this.getFollowing()); }
  getFollowing() { return this.following; }
  setFollowing(val) { this.following = val; }
  clearFollowing() { this.following = false; }

  updateIntensity(intensity) {
    this.setIntensity(intensity);
    // this.parseBVHGroup('bvh', this.getHiddenParts(), this.getStyle(), intensity);
    _.each(this.getPerformer().newMeshes, (mesh) => {
      mesh.scale.set(mesh.srcScale * intensity, mesh.srcScale * intensity, mesh.srcScale * intensity);
    });
  }

  updateStyle(style) {
    this.setStyle(style);
    this.getScene().visible = false;
    this.parseBVHGroup('bvh', this.getHiddenParts(), style, this.getIntensity());
  }

  parseBVHGroup(source, hide, style, intensity) {
    const meshes = {};
    const newMeshes = [];
    const keys = {};

    if (this.getStyleInt()) {
      clearInterval(this.getStyleInt());
      this.setStyleInt(null);
    }
    this.setStyleInt(setTimeout(
      () => {
        this.getScene().traverse((object) => {
          if (object.name.toLowerCase().match(/mixamorig/g)) {
            if (meshes[object.name.toLowerCase()] == undefined) {
              meshes[object.name.toLowerCase()] = object;
            }
            
            if (_.some(hide, el => _.includes(object.name.toLowerCase(), el))) {
              object.visible = false;
            } else {
              object.visible = this.visible;
            }

            object.castShadow = true;
            object.receiveShadow = true;
          }
          if (object.hasOwnProperty('material')) {
            object.material = this.generateMaterial(this.material);
            object.material.needsUpdate = true;
          }
          if (object instanceof THREE.Mesh) {
            switch (source) {
              default:
                break;
              case 'bvh':
              case 'clone_bvh':
                object.scale.set(2 * intensity, 2 * intensity, 2 * intensity);
                break;
            }

            if (!object.srcBox) {
              object.geometry.computeBoundingBox();
              object.srcBox = object.geometry.boundingBox;
            }

            if (!object.srcSphere) {
              object.geometry.computeBoundingSphere();
              object.srcSphere = object.geometry.boundingSphere;
            }
            object.rotation.x = 0;
            switch (style) {
              default:
                break;
              case 'spheres':
                var scale = (0.075*6) * intensity;// Common.mapRange(intensity, 1, 10, 0.01, 3)
                object.geometry = new THREE.SphereGeometry(
                  object.srcSphere.radius * scale,
                  10, 10,
                );
                object.srcScale = 1;
                break;

              case 'planes':
                var scale = 2 * intensity;// Common.mapRange(intensity, 1, 10, 0.01, 1)
                object.geometry = new THREE.BoxGeometry(
                  1,
                  object.srcSphere.radius * scale, object.srcSphere.radius * scale,
                );
                object.srcScale = 1;
                break;

              case 'boxes':
                var scale = (0.125*6) * intensity;// Common.mapRange(intensity, 1, 10, 0.01, 5)
                object.geometry = new THREE.BoxGeometry(
                  object.srcSphere.radius * scale,
                  object.srcSphere.radius * scale,
                  object.srcSphere.radius * scale,
                );
                object.srcScale = 1;
                break;

              case 'robot':
                var scale = (0.5*2) * intensity;// Common.mapRange(intensity, 1, 10, 0.01, 2)
                object.geometry = new THREE.BoxGeometry(
                  object.srcBox.max.x * scale,
                  object.srcBox.max.z * scale,
                  object.srcBox.max.y * scale,
                );
                object.srcScale = 1;
                break;

              case 'discs':
                var scale = (0.5*2) * intensity;// Common.mapRange(intensity, 1, 10, 0.01, 2)
                object.geometry = new THREE.CylinderGeometry(
                  object.srcBox.max.x * scale,
                  object.srcBox.max.x * scale,
                  object.srcBox.max.y * scale,
                  10,
                );
                object.srcScale = 1;
                break;

              case 'oct':
                var scale = (0.1*2) * intensity;// Common.mapRange(intensity, 1, 10, 0.01, 2)
                object.geometry = new THREE.TetrahedronGeometry(object.srcSphere.radius * scale, 1);
                object.geometry.needsUpdate = true;
                object.srcScale = 1;
                break;

              case 'hands':
                object.geometry = this.getModelGeo('hand');
                object.geometry.needsUpdate = true;
                object.srcScale = object.srcSphere.radius * 0.01;
                object.scale.set((object.srcScale*7) * intensity, (object.srcScale*7) * intensity, (object.srcScale*7) * intensity);
                break;

              case 'heads':
                object.geometry = this.getModelGeo('head');
                object.geometry.needsUpdate = true;
                object.rotation.x = Math.PI;
                object.srcScale = object.srcSphere.radius * 0.1;
                object.scale.set((object.srcScale*10) * intensity, (object.srcScale*10) * intensity, (object.srcScale*10) * intensity);
                break;

              case 'hearts':
                object.geometry = this.getModelGeo('heart');
                object.geometry.needsUpdate = true;
                object.srcScale = object.srcSphere.radius * 0.001;
                object.scale.set((object.srcScale) * intensity, (object.srcScale) * intensity, (object.srcScale) * intensity);
                break;

              case 'chairs':
                object.geometry = this.getModelGeo('chair');
                object.geometry.needsUpdate = true;
                object.srcScale = object.srcSphere.radius * 0.001;
                object.scale.set((object.srcScale) * intensity, (object.srcScale) * intensity, (object.srcScale) * intensity);
                break;

              case 'oxygen':
                object = this.getColladaScenes('oxygen');
                object.srcScale = object.srcSphere.radius * 0.1;
                object.scale.set((object.srcScale) * intensity, (object.srcScale) * intensity, (object.srcScale) * intensity);
                break;

              case 'lines':
                var l = 0;
                var longest = null;
                if (object.srcBox.max.x > l) { l = object.srcBox.max.x; longest = 'x'; }
                if (object.srcBox.max.y > l) { l = object.srcBox.max.y; longest = 'y'; }
                if (object.srcBox.max.z > l) { l = object.srcBox.max.z; longest = 'z'; }

                l = new THREE.Vector3();
                l[longest] = object.srcBox.max[longest];

                // console.log(l);

                var lineGeo = new THREE.Geometry();
                lineGeo.vertices.push(new THREE.Vector3(0, 0, 0));
                lineGeo.vertices.push(l);

                var lineMat = new THREE.LineBasicMaterial({
                  color: 0xffffff,
                  linewidth: 10,
                });

                object = new THREE.Line(lineGeo, lineMat);
                object.srcScale = 1;
                break;
            }

            object.castShadow = true;
            object.receiveShadow = true;
            newMeshes.push(object);
          }
        });
      },
      250,
    ));
    this.getScene().visible = true;
    return {
      keys: this.skeletalTranslator.bvhKeys,
      meshes,
      newMeshes,
      scene,
    };
  }

  getModelGeo(id) {
    // console.log('Fetching geometry: ', id, this.modelGeos[id]);
    return this.modelGeos[id];
  }

  setModelGeo(id, model) {
    this.modelGeos[id] = model;
    // console.log('Adding geometry: ' + id, this.modelGeos);
  }

  getColladaScenes(id) {
    // console.log('Fetching Animated Mesh: ', id, this.colladaScenes[id]);
    return this.colladaScenes[id];
  }

  setColladaScenes(id, mesh) {
    this.colladaScenes[id] = mesh;
    // console.log('Adding Animated Mesh: ' + id, this.colladaScenes);
  }

  updateParameters(data) {
    switch (data.parameter) {
        case 'rate':
          this.performerEffects.updateParameters(data);
          break;
        case 'life':
        this.performerEffects.updateParameters(data);
          break;
      }
  }

  addEffects(effects) {
    _.each(effects, (effect) => {
      this.addEffect(effect);
    });
  }

  removeEffects(effects) {
    _.each(effects, (effect) => {
      this.removeEffect(effect);
    });
  }

  addEffect(effect) {
    this.performerEffects.add(effect);
  }

  removeEffect(effect) {
    this.performerEffects.remove(effect);
  }

  getScene() {
    return this.scene;
  }

  resetOffset() {
    this.offset = new THREE.Vector3();
    
    const s = this.getScene();
    s.position.copy(new THREE.Vector3());
  }

  getOffset() {
    return this.offset;
  }

  setOffset(val) {
    this.offset = val.clone();
    
    const s = this.getScene();
    s.position.copy(val.clone());
  }

  animateTo(newPos, animTime) {
    const s = this.getScene();
    // s.position.copy(val.clone());
    new TWEEN.Tween(s.position.clone())
      .to(newPos.clone(), animTime)
      .onUpdate(function() {
        s.position.set(this.x, this.y, this.z);
      })
      .easing(TWEEN.Easing.Quadratic.InOut)
      .start();
  }

  setPosition(val) {
    this.offset = new THREE.Vector3();
    
    const s = this.getScene();
    s.position.copy(val.clone());
  }

  resetPosition() {
    this.offset = new THREE.Vector3();
    
    const s = this.getScene();
    s.position.set(0, 0, 0);
  }

  setScale(val) {
    this.scale = this.origScale + val;  
    const s = this.getScene();
    s.scale.set(this.scale, this.scale, this.scale)
  }

  getRotation() {
    return this.rotation;
  }

  setRotation(val) {
    this.rotation = val;
    const s = this.getScene();
    s.rotation.copy(this.rotation.clone());
  }

  resetRotation() {
    this.offset = new THREE.Vector3(0, 0, 0);
    this.rotation = new THREE.Vector3(0, 0, 0);
    const s = this.getScene();
    s.rotation.set(0, 0, 0);
    s.position.set(0, 0, 0);
  }

  getDelay() {
    return this.delay;
  }

  setDelay(val) {
    this.delay = val;
    this.clearDataBuffer();
  }

  getDataBuffer() {
    return this.dataBuffer;
  }

  clearDataBuffer() {
    this.dataBuffer = [];
  }

  setDataBuffer(buffer) {
    this.dataBuffer = buffer;
  }

  randomizeAll(switchTime) {
    // var parts = ['head', 'leftshoulder', 'rightshoulder', 'leftupleg',  'rightupleg'];
    
    _.each(this.skeletalTranslator.bvhKeys, (part) => {
      this.scalePart(part, Common.mapRange(Math.random(), 0, 1, 0.25, 3), switchTime);
    });
    if (this.scaleInterval) {
      clearInterval(this.scaleInterval);
    }
    this.scaleInterval = setInterval(() => {
      _.each(parts, (part) => {
        this.scalePart(part, Common.mapRange(Math.random(), 0, 1, 0.25, 3), switchTime);
      });
    }, switchTime);
  }

  setColor(color) {
    this.getScene().traverse((part) => {
      if (part.hasOwnProperty('material')) {
        part.material.color.set(parseInt(color, 16));
        part.material.needsUpdate = true;
      }
    });
  }

  getMeshes() {
    let m = [];
    this.getScene().traverse((part) => {
      if (part instanceof THREE.Mesh) {
        m.push(part);
      }
    });
    return m;
  }

  randomizeColors(switchTime) {
    this.getScene().traverse((part) => {
      if (part.hasOwnProperty('material')) {
        // part.material = new THREE.MeshPhongMaterial();
        part.material.wireframe = this.wireframe;
        part.material.color.set(this.colors[Common.mapRange(Math.random(), 0, 1, 0, this.colors.length - 1)]);

        part.material.needsUpdate = true;
      }
    });
    if (this.colorInterval) {
      clearInterval(this.colorInterval);
    }
    this.colorInterval = setInterval(() => {
      this.getScene().traverse((part) => {
        if (part.hasOwnProperty('material')) {
          // part.material = new THREE.MeshPhongMaterial();
          part.material.wireframe = this.wireframe;
          part.material.color.set(this.colors[Common.mapRange(Math.random(), 0, 1, 0, this.colors.length - 1)]);

          part.material.needsUpdate = true;
        }
      });
    }, switchTime);
  }

  randomizeLimbs(switchTime) {
    const parts = ['head', 'leftshoulder', 'rightshoulder', 'leftupleg', 'rightupleg'];
    _.each(parts, (part) => {
      this.scalePart(part, Common.mapRange(Math.random(), 0, 1, 0.75, 1.5), switchTime);
    });
    if (this.scaleInterval) {
      clearInterval(this.scaleInterval);
    }
    this.scaleInterval = setInterval(() => {
      _.each(parts, (part) => {
        this.scalePart(part, Common.mapRange(Math.random(), 0, 1, 0.75, 1.5), switchTime);
      });
    }, switchTime);
  }

  resetScale() {
    if (this.scaleInterval) {
      clearInterval(this.scaleInterval);
    }

    _.each(this.skeletalTranslator.bvhKeys, (partname) => {
      const part = this.getPerformer().meshes[`mixamorig${partname}`];
      part.scale.set(1, 1, 1);
    });
  }

  scalePart(partname, scale, animTime) {
    const part = this.getPerformer().meshes[`mixamorig${partname}`];
    const s = { x: part.scale.x };
    if (part) {
      const tween = new TWEEN.Tween(s)
        .to({ x: scale }, animTime)
        .onUpdate(() => {
          part.scale.set(s.x, s.x, s.x);
        })
        .easing(TWEEN.Easing.Quadratic.InOut)
        .start();
    }
  }

  hidePart(partname) {
    const part = this.getPerformer().meshes[`mixamorig${partname}`];
    if (part) {
      part.visible = false;
    }
  }

  rotatePart(partname, rotation) {
    const part = this.getPerformer().meshes[`mixamorig${partname}`];

    if (part) {
      part.rotation.set(rotation.x, rotation.y, rotation.z);
    }
  }

  unParentPart(partname, freeze) {
    const part = this.getPerformer().meshes[`mixamorig${partname}`];

    if (part) {
      part.position.add(this.getPerformer().meshes.mixamorighips.position);
      part.parent = this.getScene();

      if (freeze) {
        switch (partname) {
          case 'leftshoulder':
            var parts = ['mixamorigleftshoulder',
              'mixamorigleftarm', 'mixamorigleftforearm', 'mixamoriglefthand',
              'mixamoriglefthandthumb1', 'mixamoriglefthandthumb2', 'mixamoriglefthandthumb3',
              'mixamorigleftinhandindex', 'mixamoriglefthandindex1', 'mixamoriglefthandindex2', 'mixamoriglefthandindex3',
              'mixamorigleftinhandmiddle', 'mixamoriglefthandmiddle1', 'mixamoriglefthandmiddle2', 'mixamoriglefthandmiddle3',
              'mixamorigleftinhandring', 'mixamoriglefthandring1', 'mixamoriglefthandring2', 'mixamoriglefthandring3',
              'mixamorigleftinhandpinky', 'mixamoriglefthandpinky1', 'mixamoriglefthandpinky2', 'mixamoriglefthandpinky3'];
            this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
            break;
          case 'rightshoulder':
            var parts = ['mixamorigrightshoulder',
              'mixamorigrightarm', 'mixamorigrightforearm', 'mixamorigrighthand',
              'mixamorigrighthandthumb1', 'mixamorigrighthandthumb2', 'mixamorigrighthandthumb3',
              'mixamorigrightinhandindex', 'mixamorigrighthandindex1', 'mixamorigrighthandindex2', 'mixamorigrighthandindex3',
              'mixamorigrightinhandmiddle', 'mixamorigrighthandmiddle1', 'mixamorigrighthandmiddle2', 'mixamorigrighthandmiddle3',
              'mixamorigrightinhandring', 'mixamorigrighthandring1', 'mixamorigrighthandring2', 'mixamorigrighthandring3',
              'mixamorigrightinhandpinky', 'mixamorigrighthandpinky1', 'mixamorigrighthandpinky2', 'mixamorigrighthandpinky3'];
            this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
            break;
          case 'leftupleg':
            var parts = ['mixamorigleftupleg', 'mixamorigleftleg', 'mixamorigleftfoot'];
            this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
            break;
          case 'rightupleg':
            var parts = ['mixamorigrightupleg', 'mixamorigrightleg', 'mixamorigrightfoot'];
            this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
            break;
          case 'head':
            var parts = ['mixamorighead'];
            this.getPerformer().meshes = _.omit(this.getPerformer().meshes, parts);
            break;
        }
      }
    }
  }

  showWireframe() {
    this.wireframe = true;
    _.each(this.getPerformer().meshes, (parent) => {
      parent.traverse((object) => {
        if (object.hasOwnProperty('material')) {
          object.material.wireframe = this.wireframe;
        }
      });
    });
  }

  hideWireframe() {
    this.wireframe = false;
    _.each(this.getPerformer().meshes, (parent) => {
      parent.traverse((object) => {
        if (object.hasOwnProperty('material')) {
          object.material.wireframe = this.wireframe;
        }
      });
    });
  }

  toggleWireframe() {
    this.wireframe = !this.wireframe;
    _.each(this.getPerformer().meshes, (parent) => {
      parent.traverse((object) => {
        if (object.hasOwnProperty('material')) {
          object.material.wireframe = this.wireframe;
        }
      });
    });
  }

  distanceBetween(part1, part2) {
    var part1 = this.getPerformer().meshes[`mixamorig${part1}`]; // find first body part by name
    var part2 = this.getPerformer().meshes[`mixamorig${part2}`]; // find second body part by name
    if (part1 && part2) { // do they both exist?
      const joint1Global = new THREE.Vector3().setFromMatrixPosition(part1.matrixWorld);// we need the global position
      const joint2Global = new THREE.Vector3().setFromMatrixPosition(part2.matrixWorld);// we need the global position
      return joint1Global.distanceTo(joint2Global);// how far apart are they?
    }
    return 0;
  }

  calculateDistances(data) {
    return {
      hands: 0,
      feet: 0,
      leftHalf: 0,
      rightHalf: 0,
      leftCross: 0,
      rightCross: 0,
      leftHeadToe: 0,
      rightHeadToe: 0,
    };

    this.head = new THREE.Vector3();
    this.head.set(  
      _.filter(data, ['name', 'head'])[0].position.x,
      _.filter(data, ['name', 'head'])[0].position.y,
      _.filter(data, ['name', 'head'])[0].position.z,
    );

    this.lefthand = new THREE.Vector3();
    this.lefthand.set(
      _.filter(data, ['name', 'lefthand'])[0].position.x,
      _.filter(data, ['name', 'lefthand'])[0].position.y,
      _.filter(data, ['name', 'lefthand'])[0].position.z,
    );
    this.righthand = new THREE.Vector3();
    this.righthand.set(
      _.filter(data, ['name', 'righthand'])[0].position.x,
      _.filter(data, ['name', 'righthand'])[0].position.y,
      _.filter(data, ['name', 'righthand'])[0].position.z,
    );

    this.leftfoot = new THREE.Vector3();
    this.leftfoot.set(
      _.filter(data, ['name', 'leftfoot'])[0].position.x,
      _.filter(data, ['name', 'leftfoot'])[0].position.y,
      _.filter(data, ['name', 'leftfoot'])[0].position.z,
    );
    
    this.rightfoot = new THREE.Vector3();
    this.rightfoot.set(
      _.filter(data, ['name', 'rightfoot'])[0].position.x,
      _.filter(data, ['name', 'rightfoot'])[0].position.y,
      _.filter(data, ['name', 'rightfoot'])[0].position.z,
    );

    return {
      hands: this.lefthand.distanceTo(this.righthand),
      feet: this.leftfoot.distanceTo(this.rightfoot),
      leftHalf: this.lefthand.distanceTo(this.leftfoot),
      rightHalf: this.righthand.distanceTo(this.rightfoot),
      leftCross: this.lefthand.distanceTo(this.rightfoot),
      rightCross: this.righthand.distanceTo(this.leftfoot),
      leftHeadToe: this.head.distanceTo(this.leftfoot),
      rightHeadToe: this.head.distanceTo(this.rightfoot),
    };
  }

  update(data) {
    const d = _.cloneDeep(data);
    this.dataBuffer.push(d);
    if (this.dataBuffer.length > (this.delay * 60)) { // Number of seconds * 60 fps
      switch (this.type) {
        default:
        case 'BVH':
        case 'percetionNeuron':
          this.updateFromBVH(this.dataBuffer.shift());
          break;
        case 'kinect':
          this.updateFromKinect(this.dataBuffer.shift());
          break;
        case 'kinectron':
          this.updateFromKinectron(this.dataBuffer.shift());
          break;
        case 'poseNet':
          this.updateFromPoseNet(this.dataBuffer.shift());
          break;
      }
    }
    this.performerEffects.update(this.getScene(), d, this.calculateDistances(d));
    if (this.getScene() && this.getScene().mixer) { this.getScene().mixer.update(this.getScene().clock.getDelta()); }
  }

  updateFromBVH(data) {
    for (let i = 0; i < data.length; i++) {
      const jointName = this.prefix + data[i].name.toLowerCase();
      // console.log(jointName);
      if (this.getPerformer() == null) {
        let size = 1 / this.modelShrink;
        this.origScale = size;

        console.log('Performer data source: ', this.type);
        switch (this.type) {
          case 'bvh':
          case 'clone_bvh':
            size = (1 / this.modelShrink) / 2;
            this.origScale = size;
            break;
        }
        this.loadPerformer(
          this.type,
          this.getType().value,
          this.hiddenParts,
          this.character.scale,
          this.style,
          this.intensity,
        );
      } else if (this.getPerformer().meshes[jointName]) {
        // console.log(this.getPerformer().meshes[jointName]);
        // this.getPerformer().meshes[jointName].position.set(
        //   data[i].position.x,
        //   data[i].position.y,
        //   data[i].position.z,
        // );

        // this.getPerformer().meshes[jointName].quaternion.copy(data[i].quaternion);
      }
    }
  }

  bvhToBones(bone, data) {
    let matrixWorldInv = new THREE.Matrix4().getInverse( this.getScene().children[1].matrixWorld );
    let parentMtx, tmpMtx, worldMtx;
    parentMtx = bone.parent ? bone.parent.matrixWorld : matrixWorldInv;

    let globalQuat = new THREE.Quaternion();
    let globalPos = new THREE.Vector3();
    let globalMtx = new THREE.Matrix4();
    let localMtx = new THREE.Matrix4();
    let tmpPos = new THREE.Vector3();

    tmpMtx = bone.matrixWorld.clone();
    if( bone.name === 'hip' ) globalPos.setFromMatrixPosition( tmpMtx );
    globalQuat.setFromRotationMatrix( tmpMtx );

    // MODIFY TRANSFORM
    globalMtx.identity();
    globalMtx.makeRotationFromQuaternion( globalQuat );
    globalMtx.multiply( bone.matrixWorld.clone());
    if( bone.name === 'hip' ) globalMtx.setPosition( globalPos );

    // PRESERVES BONE SIZE
    tmpMtx.identity().getInverse( parentMtx );
    tmpPos.setFromMatrixPosition( bone.matrix );
    localMtx.multiplyMatrices( tmpMtx, globalMtx );
    if( name !== 'hip' ) localMtx.setPosition( tmpPos );
    globalMtx.multiplyMatrices( parentMtx, localMtx );

    // UPDATE BONE
    bone.matrixWorld.copy( globalMtx );
    bone.matrix.getInverse( bone.parent.matrixWorld );
    bone.matrix.multiply( bone.matrixWorld );
  }

  updateFromKinect(data) {
    if (data !== null) {
      for (let i = 0; i < data.length; i++) {
        // const jointName = ''Unit02Skele_' + this.skeletalTranslator.kinectLookup(data[i].name).toLowerCase();
        // debugger;
        if (this.getPerformer() == null) {
          if (data[0].position.x !== "0.00000") {
            console.log(data);
            this.setPerformer({ loading: true });
            // this.skeletalTranslator.buildKinectSkeleton(data, this.parent, (skeleton) => {
            //   console.log(skeleton);
            //   this.loader.loadSTL('./models/stl/NPC_Beta_A_Sk.stl', {}, (geometry) => {
                
            // //     geometry = new THREE.Geometry().fromBufferGeometry(geometry);
            // //     // Create the skin indices and skin weights
            // //     for ( var i = 0; i < geometry.vertices.length; i ++ ) {
                
            // //       // Imaginary functions to calculate the indices and weights
            // //       // This part will need to be changed depending your skeleton and model
            // //       var skinIndex = i;//calculateSkinIndex( geometry.vertices, i );
            // //       var skinWeight = 0;//calculateSkinWeight( geometry.vertices, i );
                
            // //       // Ease between each bone
            // //       geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, 0, 0 ) );
            // //       geometry.skinWeights.push( new THREE.Vector4( 1 - skinWeight, skinWeight, 0, 0 ) );
                
            // //     }
                
            //     var mesh = new THREE.SkinnedMesh(
            //       new THREE.Geometry().fromBufferGeometry(geometry),
            //       new THREE.MeshPhongMaterial({
            //         skinning:true,
            //         color: 0xff5533, specular: 0x111111, shininess: 200
            //       }),
            //     );
            //     mesh.scale.set(0.007, 0.007, 0.007);
            //     mesh.rotation.x = -Math.PI/2;
            //     // mesh.castShadow = true;
            //     // mesh.receiveShadow = true;

            //     var rootBone = skeleton.bones[0];
            //     mesh.add(rootBone);
              
            //     // Bind the skeleton to the mesh
            //     console.log(skeleton);
            //     mesh.bind(skeleton);

            //     // this.parent.add(mesh);
            //     // window.SkinnedMesh = mesh;
            //   });
            // //   // var geometry = new THREE.CylinderGeometry( 5, 5, 5, 5, 15, 5, 30 );

            // //   // //Create the skin indices and skin weights
            // //   // for ( var i = 0; i < geometry.vertices.length; i ++ ) {
              
            // //   //   // Imaginary functions to calculate the indices and weights
            // //   //   // This part will need to be changed depending your skeleton and model
            // //   //   var skinIndex = i;//calculateSkinIndex( geometry.vertices, i );
            // //   //   var skinWeight = 0;//calculateSkinWeight( geometry.vertices, i );
              
            // //   //   // Ease between each bone
            // //   //   geometry.skinIndices.push( new THREE.Vector4( skinIndex, skinIndex + 1, 0, 0 ) );
            // //   //   geometry.skinWeights.push( new THREE.Vector4( 1 - skinWeight, skinWeight, 0, 0 ) );
              
            // //   // }
              
            // //   // var mesh = new THREE.SkinnedMesh( geometry, new THREE.MeshBasicMaterial({color:0xFFFFFF}) );
            // //   // mesh.scale.set(0.25, 0.25, 0.25);
              
            // //   // // See example from THREE.Skeleton for the armSkeleton
            // //   // var rootBone = skeleton.bones[ 0 ];
            // //   // mesh.add( rootBone );
              
            // //   // // Bind the skeleton to the mesh
            // //   // mesh.bind( skeleton );

            // //   // this.parent.add(mesh);
            // });
          }
          // this.loader.loadGLTF('./models/characters/alien/alien.gltf', {}, (result) => {
          //   const meshes = {};
          //   const newMeshes = {};
          //   const keys = {};
          //   let s = result.scene;
          //   // s.scale.set(0.045, 0.045, 0.045);
          //   console.log(s);
      
      
          //   s.traverse((object) => {
          //   //   console.log(object.name + ': ' + object.type);
          //     switch (object.type) {
          //       case 'SkinnedMesh':
          //   //     console.log(object);
          //         s = object;
          //       //  meshes = object.skeleton.bones;
          //   // // //      keys[this.prefix+object.name.toLowerCase()] = this.prefix+object.name.toLowerCase();
          //        break;
          //     }
          //   });
      
          //   // s.scale.set(size, size, size);
          //   // // console.log(s.skeleton);
      
          //   _.each(s.skeleton.bones, (b) => {
          //     meshes[this.prefix + b.name.toLowerCase()] = b;
          //     // b.srcScale = 0.1;
          //     // newMeshes[this.prefix + b.name.toLowerCase()] = b;
          //     // keys[this.prefix + b.name.toLowerCase()] = this.prefix + b.name.toLowerCase();
          //   });
      
          //   // console.log(meshes);
          //   // console.log(keys);
      
          //   this.setScene(s);
          //   window.s = s;
          //   this.parent.add(s);
      
          //   this.setPerformer({
          //     meshes,
          //     scene: this.getScene(),
          //     loading: false,
          //   });
          // });




          //
          // let size = 1 / this.modelShrink;
          // this.origScale = size;

          // console.log('Performer data source: ', this.type);
          // switch (this.type) {
          //   case 'bvh':
          //   case 'clone_bvh':
          //     size = (1 / this.modelShrink) / 2;
          //     this.origScale = size;
          //     break;
          // }
          // this.loadPerformer(
          //   this.type,
          //   'riggedKinect', // this.getType().value,
          //   this.hiddenParts,
          //   size,
          //   this.style,
          //   this.intensity,
          // );
        } else {

          // console.log(this.getPerformer().meshes[jointName]);
          // this.getPerformer().meshes[jointName].position.set(
          //   data[i].position.x,
          //   data[i].position.y,
          //   data[i].position.z,
          // );

          // if (data[i].quaternion) {
          //   this.getPerformer().meshes[jointName].quaternion.copy(data[i].quaternion);
          // }
        }
      }
    }
  }

  updateFromKinectron(data) {
    if (this.getPerformer() == null) {
      this.setPerformer({ loading: true });
      
      this.loader.loadMTL('./models/characters/alien/head.mtl', {}, (materials) => {
        materials.preload();
        this.loader.loadOBJ('./models/characters/alien/head.obj', { materials: materials }, (head, props) => {
          const zOffset = 20;
          const yOffset = 0.5;

          this.headGroup = new THREE.Object3D();
          window.headGroup = this.headGroup;
          // this.head = new THREE.Mesh(geo, new THREE.MeshPhongMaterial({color:this.character.color}));
          head.scale.set(0.15,0.15,0.15);
          this.headGroup.add(head);
          this.headGroup.position.z = 12;
          this.headGroup.position.y = 0.899;
          this.headGroup.scale.set(2,2,2);
          this.parent.add(this.headGroup);
        

          this.skeletalTranslator.createLineSkeleton(data, this.character.color, this.character.sizes, window.lineVisible, (lineGroup, axesGroup, cubeBoneGroup) => {

            this.lineGroup = lineGroup;
            // this.lineGroup.position.z = zOffset;
            // this.lineGroup.position.y = yOffset;
            // this.parent.add(lineGroup);
            
            // this.axesGroup = axesGroup;
            // this.axesGroup.position.z = zOffset;
            // this.axesGroup.position.y = yOffset;
            // this.parent.add(axesGroup);
      
            this.cubeBoneGroup = cubeBoneGroup;
            this.cubeBoneGroup.position.z = zOffset - 7.35;
            this.cubeBoneGroup.position.y = yOffset;
            window.cubeBoneGroup = this.cubeBoneGroup;
            this.parent.add(cubeBoneGroup);

            this.lineGroup.scale.set(2, 2, 2);
            // this.axesGroup.scale.set(2, 2, 2);
            this.cubeBoneGroup.scale.set(2, 2, 2);
          });
        });
      });
        // let size = 1 / this.modelShrink;
        // this.origScale = size;

        // console.log('Performer data source: ', this.type);
        // switch (this.type) {
        //   case 'bvh':
        //   case 'clone_bvh':
        //     size = (1 / this.modelShrink) / 2;
        //     this.origScale = size;
        //     break;
        // }
        // this.loadPerformer(
        //   this.type,
        //   this.getType().value,
        //   this.hiddenParts,
        //   this.character.scale,
        //   this.style,
        //   this.intensity,
        // );

        // this.setPerformer({
        //   loading: false,
        //   scene: this.getScene(),
        //   bones: bones,
        //   newMeshes: newMeshes,
        //   keys: keys,
        // });
    } else {
      this.skeletalTranslator.updateLineSkeleton(this.lineGroup, this.axesGroup, this.cubeBoneGroup, data, window.lineVisible, this.headGroup);
      // this.skeletalTranslator.updateMixamoModel(this.getPerformer().bones, data, this.prefix, this.cubeBoneGroup);
      // this.skeletalTranslator.updateMeshGroup(this.getPerformer().meshes, data, this.prefix, this.getPerformer().boxes);
    }
  }

  // updateFromKinectron(data) {
  //   // [{
  //   //   "depthX":0.5019103288650513,
  //   //   "depthY":0.4254000782966614,
  //   //   "colorX":0.5041413903236389,
  //   //   "colorY":0.43979138135910034,
  //   //   "cameraX":-0.01628301851451397,
  //   //   "cameraY":0.14479131996631622,
  //   //   "cameraZ":2.0694429874420166,
  //   //   "orientationX":-0.0016110598808154464,
  //   //   "orientationY":0.9982007741928101,
  //   //   "orientationZ":-0.004516969434916973,
  //   //   "orientationW":0.059768687933683395,
  //   //   "name":"SpineBase"
  //   // }]
  //   // ["SpineBase","SpineMid","Neck","Head","ShoulderLeft","ElbowLeft","WristLeft","HandLeft","ShoulderRight","ElbowRight","WristRight","HandRight","HipLeft","KneeLeft","AnkleLeft","FootLeft","HipRight","KneeRight","AnkleRight","FootRight","SpineShoulder","HandTipLeft","ThumbLeft","HandTipRight","ThumbRight"]

  //   this.prefix = 'mixamorig';
  //   if (data !== null) {
  //     if (this.getPerformer() === null) {
  //       console.log(data);
  //       this.setPerformer({ loading: true });
        
  //       const sceneGroup = new THREE.Object3D();
  //       let bones = [];
  //       this.skeletalTranslator.createLineSkeleton(data, (lineGroup, axesGroup, cubeBoneGroup) => {
  //         this.lineGroup = lineGroup;
  //         this.parent.add(lineGroup);
          
  //         this.axesGroup = axesGroup;
  //         this.parent.add(axesGroup);

  //         this.cubeBoneGroup = cubeBoneGroup;
  //         this.parent.add(cubeBoneGroup);
  //       });

  //       this.loader.loadFBX('models/characters/flash/model.fbx', {}, (group) => {
  //         group.name = 'Root';
  //         sceneGroup.add(group);
  //         this.setScene(sceneGroup);
  //         group.traverse((child) => {
  //           if (child instanceof THREE.SkinnedMesh && child.hasOwnProperty('skeleton')) {
  //             child.castShadow = true;
  //             child.receiveShadow = true;
              
  //             console.log(_.map(child.skeleton.bones, 'name'));
  //             // _.each(bones, (b) => {
  //             //   b.quaternion.copy(_.filter(child.skeleton.bones, ['name', b.name])[0].quaternion.clone());
  //             // });
              
  //             let bones = {};
  //             let newMeshes = {};
  //             let keys = {};

              
  //             _.each(child.skeleton.bones, (b) => {
  //               bones[b.name] = b;
  //               b.srcScale = 0.1;
  //               newMeshes[b.name] = b;
  //               keys[b.name] = b.name;
  //               b.srcQuat = b.quaternion.clone();
  //               b.srcPos = b.position.clone();
  //               b.srcMatrix = b.matrix.clone();
  //               b.srcMatrixWorld = b.matrixWorld.clone();
  //               // console.log(b.parent);
  //             });

  //             this.setPerformer({
  //               loading: false,
  //               mesh: child,
  //               skeleton: child.skeleton,
  //               scene: this.getScene(),
  //               bones: bones,
  //               newMeshes: newMeshes,
  //               keys: keys,
  //             });
  //           }
  //         });

  //         group.scale.set(0.005, 0.005, 0.005);
  //         group.rotation.y = Math.PI;
  //         this.parent.add(this.getScene());

  //         // sceneGroup.clock = new THREE.Clock();
  //         // sceneGroup.mixer = new THREE.AnimationMixer(group);
  //         // sceneGroup.mixer.clipAction(group.animations[0]); // .stop();
  //         console.log(this.getScene());
  //       });
  //     } else if (this.getPerformer() !== null && this.getPerformer().loading === false) {
  //       this.skeletalTranslator.updateLineSkeleton(this.lineGroup, this.axesGroup, this.cubeBoneGroup, data);
  //       // this.skeletalTranslator.updateBVHSkeleton(this.getPerformer().meshes, data);
  //       // this.skeletalTranslator.buildKinectronSkeleton(data, (skeleton) => {
          
  //       //   // var source = new THREE.SkeletonHelper(skeleton.bones[0]);
  //       //   // source.skeleton = skeleton;
  //       //   // this.parent.add(source);

  //       //   // THREE.SkeletonUtils.retarget( this.getPerformer().mesh, skeleton, {
  //       //   //   preserveMatrix: false,
  //       //   //   preservePosition: false,
  //       //   //   preserveHipPosition: false,
  //       //   //   useTargetMatrix: false
  //       //   // });
  //       // })
  //       let localPos = new THREE.Vector3();
  //       _.each(this.getPerformer().bones, (b) => {
  //         const jointName = this.skeletalTranslator.otherKinectronLookup(b.name);
  //         // console.log(jointName);
  //         // localPos = b.pos;
  //         // b.traverseAncestors((parent) => {
  //         //   if (parent.name !== 'Root') {
  //         //     localPos
  //         //   }
  //         // });
  //         // b.pos.copy(localPos.clone());
  //       });

  //       for (let i = 0; i < data.length; i++) {
  //         const jointName = this.skeletalTranslator.kinectronMixamoLookup(data[i].name);
  //         // const jointName = this.skeletalTranslator.kinectronOtherLookup(data[i].name);
  //         if (this.getPerformer().bones[jointName]) {
  //           // let obj = this.getPerformer().meshes[jointName]
  //           // while(obj.parent.name !== 'Flash') {
  //           //   // console.log(obj.parent.name);
  //           //   obj = obj.parent;
  //           //   this.skeletalTranslator.getRotationBetweenJoints(
  //           //     new THREE.Vector3(
  //           //       data[i].cameraX,
  //           //       data[i].cameraY,
  //           //       data[i].cameraZ,
  //           //     )
  //           //   );
  //           // }

  //           // this.getPerformer().meshes[jointName].position.copy(
  //           //   new THREE.Vector3(
  //           //     data[i].cameraX,
  //           //     data[i].cameraY,
  //           //     data[i].cameraZ,
  //           //   )
  //           // );

  //           // this.getPerformer().meshes[jointName].quaternion.copy(
  //           //   new THREE.Quaternion(
  //           //     data[i].orientationX,
  //           //     data[i].orientationY,
  //           //     data[i].orientationZ,
  //           //     data[i].orientationW,
  //           //   )
  //           // );
            
  //           // var quaternion = new THREE.Quaternion(
  //           //   data[i].orientationX,
  //           //   data[i].orientationY,
  //           //   data[i].orientationZ,
  //           //   data[i].orientationW,
  //           // );
  //           // // quaternion.setFromRotationMatrix(this.getPerformer().meshes[jointName]);
  //           // quaternion.multiply(this.getPerformer().meshes[jointName].srcQuat);
            
  //           // var basicQuaternion = new THREE.Quaternion();
  //           // quaternion.slerp(basicQuaternion,0.5);
            
  //           let cubeBones = _.filter(this.cubeBoneGroup.children, (c) => { return c.name == data[i].name; });
  //           if (cubeBones.length > 0) {
  //             cubeBones[0].updateMatrix();
  //             this.getPerformer().bones[jointName].position.setFromMatrixPosition(cubeBones[0].matrixWorld.clone());
  //             this.getPerformer().bones[jointName].quaternion.setFromRotationMatrix(cubeBones[0].matrixWorld.clone());

  //             // this.getPerformer().meshes[jointName].updateMatrixWorld(); // important!
  //             // _.each(this.getPerformer().meshes[jointName].children, (c) => {
  //             //   c.applyMatrix( new THREE.Matrix4().getInverse(this.getPerformer().meshes[jointName].matrixWorld));
  //             // });

  //             // this.getPerformer().meshes[jointName].position.copy(cubeBones[0].position.clone());
  //             // this.getPerformer().meshes[jointName].quaternion.copy(cubeBones[0].quaternion.clone());
  //           }
  //           // this.getPerformer().meshes[jointName].rotation.order = 'XYZ';
  //         }
  //       }
  //     }
  //   }
  // }

  getRanges(x, y, z) {
    if (x < this.ranges.min.x) { this.ranges.min.x = x; console.log(this.ranges); }
    if (y < this.ranges.min.y) { this.ranges.min.y = y; console.log(this.ranges); }
    if (z < this.ranges.min.z) { this.ranges.min.z = z; console.log(this.ranges); }
    
    if (x > this.ranges.max.x) { this.ranges.max.x = x; console.log(this.ranges); }
    if (y > this.ranges.max.y) { this.ranges.max.y = y; console.log(this.ranges); }
    if (z > this.ranges.max.z) { this.ranges.max.z = z; console.log(this.ranges); }
  }

  updateFromPoseNet(data) {
    // {
    //   'nose': '',
    //   'leftEye': '',
    //   'rightEye': '',
    //   'leftEar': '',
    //   'rightEar': '',
    //   'leftShoulder': 'leftarm',
    //   'rightShoulder': 'rightarm',
    //   'leftElbow': 'leftforearm'
    //   'rightElbow': 'rightforearm',
    //   'leftWrist': 'lefthand',
    //   'rightWrist': 'righthand',
    //   'leftHip': 'leftupleg',
    //   'rightHip': 'rightupleg',
    //   'leftKnee': ''leftleg,
    //   'rightKnee': 'rightleg',
    //   'leftAnkle': 'leftfoot',
    //   'rightAnkle': 'rightfoot',
    // }
    for (let i = 0; i < data.length; i++) {
      const jointName = this.prefix + data[i].name.toLowerCase();
      if (this.getPerformer() == null) {
        let size = 1 / this.modelShrink;
        this.origScale = size;

        console.log('Performer data source: ', this.type);
        switch (this.type) {
          case 'bvh':
          case 'clone_bvh':
            size = (1 / this.modelShrink) / 2;
            this.origScale = size;
            break;
        }
        this.loadPerformer(
          this.type,
          this.getType().value,
          this.hiddenParts,
          size,
          this.style,
          this.intensity,
        );
      } else if (this.getPerformer().meshes[jointName]) {
        // console.log(this.getPerformer().meshes[jointName]);
        this.getPerformer().meshes[jointName].position.set(
          data[i].position.x,
          data[i].position.y,
          data[i].position.z,
        );

        this.getPerformer().meshes[jointName].quaternion.copy(data[i].quaternion);
      }
    }
  }
}

module.exports = Performer;
