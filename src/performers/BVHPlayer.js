const _ = require('lodash').mixin(require('lodash-keyarrange'));
import dat from 'dat-gui';

require('three/examples/js/loaders/BVHLoader.js');

import FileLoader from '../loaders';

import Common from './../util/Common';

class BVHPlayer {
  constructor(content, parent, autoplay, callback) {
    this.content = content;

    this.parent = parent;
    this.callback = callback;

    const type = (typeof this.content == 'String') ? 'raw' : 'url';

    this.autoplay = autoplay;
    this.playing = false;
    this.looping = false;

    this.clock = new THREE.Clock();

    this.mixer;
    this.clip;
    this.skeletonHelper = null;
    this.boneContainer = new THREE.Group();

    this.loader = new FileLoader();
    this.loading = false;

    switch(type) {
      default:
      case 'url':
        this.loadBVH(this.content);
        break;
      case 'raw':
        this.loadRaw(this.content);
        break;
    }

    this.update();
  }

  play() {
    if (this.mixer.clipAction(this.clip).setEffectiveWeight(1.0).paused == false) {
      this.mixer.clipAction(this.clip).setEffectiveWeight(1.0).play();
      this.playing = true;
    } else {
      this.mixer.clipAction(this.clip).setEffectiveWeight(1.0).paused = false;
      this.playing = false;
    }
  }

  pause() {
    this.mixer.clipAction(this.clip).setEffectiveWeight(1.0).paused = true;
    this.playing = false;
  }

  stop() {
    this.mixer.clipAction(this.clip).setEffectiveWeight(1.0).stop();
    this.playing = false;
  }

  loop() {
    this.mixer.clipAction(this.clip).setEffectiveWeight(1.0).setLoop(THREE.LoopRepeat);
    this.looping = true;
  }

  noLoop() {
    this.mixer.clipAction(this.clip).setEffectiveWeight(1.0).setLoop(THREE.LoopOnce, 0);
    this.looping = false;
  }

  getPlay() {
    return this.playing;
  }

  getLoop() {
    return this.looping;
  }

  loadBVH(bvhFile) {
    if (!this.loading) {
      this.loading = true;
      this.loader.loadBVH(bvhFile, this.buildAnimation.bind(this));
    }
  }

  switchClip(idx) {
    if (this.type == 'url') {
      if (!this.loading) {
        this.loading = true;
        this.loader.loadBVH(this.files[idx], (result) => {
          console.log('BVH File Loaded...');
          this.stop();
          this.clip = result.clip;

          this.play();
          if (!this.autoplay) {
            this.stop();
          }
          this.loading = false;
        });
      }
    }
  }

  loadRaw(rawFile) {
    this.buildAnimation(new THREE.BVHLoader().parse(rawFile));
  }

  buildAnimation(result) {
    console.log(result);
    console.log('BVH File Loaded...');

    // if (this.skeletonHelper == null) {    
      this.skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);
      this.skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly

      this.boneContainer = new THREE.Group();
      this.boneContainer.add(result.skeleton.bones[0]);

      // play animation
      this.mixer = new THREE.AnimationMixer(this.skeletonHelper);
    // }
    this.clip = result.clip;

    this.play();
    if (!this.autoplay) {
      this.stop();
    }
    this.loading = false;
  }

  parseFrameData(data, name) {
    return {
      name: name.toLowerCase(),
      position: data.position,
      quaternion: data.quaternion,
    };
  }

  update() {
    requestAnimationFrame(this.update.bind(this));
    if (this.mixer) {
      this.mixer.update(this.clock.getDelta());

      const bones = _.map(_.uniqBy(_.map(this.mixer._bindingsByRootAndName[Object.keys(this.mixer._bindingsByRootAndName)[0]], (part, key) => part.binding.targetObject), 'name'), part => this.parseFrameData(part, part.name));

      if (bones.length > 0) {
        this.callback(`BVH_User_${Object.keys(this.mixer._bindingsByRootAndName)[0]}`, bones, 'bvh', null, {
          play: this.play.bind(this),
          pause: this.pause.bind(this),
          stop: this.stop.bind(this),
          loop: this.loop.bind(this),
          noLoop: this.noLoop.bind(this),
          playing: this.playing,
          looping: this.looping,
        });
      }
    }
  }
}

module.exports = BVHPlayer;
