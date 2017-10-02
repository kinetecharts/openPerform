var THREE = require('three');
var bvhLoader = require('./../libs/three/loaders/BVHLoader.js');
import Common from './../util/Common'

var _ = require('lodash').mixin(require('lodash-keyarrange'));
import dat from 'dat-gui'

class BVHPlayer {
	constructor(file, parent, callback) {
		this.parent = parent;
		this.callback = callback;

		this.clock = new THREE.Clock();
		
		this.mixer;
		this.clip;
		this.skeletonHelper;
		this.boneContainer = new THREE.Group();

		this.loader = new THREE.BVHLoader();

		this.loadBVH(file);

		this.update();
	}

	play() {
		this.mixer.clipAction( this.clip ).setEffectiveWeight( 1.0 ).play();
	}

	stop() {
		this.mixer.clipAction( this.clip ).setEffectiveWeight( 1.0 ).stop();
	}

	loadBVH(bvhFile) {
		this.loader.load(bvhFile, ( result ) => {
			console.log("BVH File Loaded...");

			this.skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] );
			this.skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly
			
			this.boneContainer.add( result.skeleton.bones[ 0 ] );

			// play animation
			this.mixer = new THREE.AnimationMixer( this.skeletonHelper );
			this.clip = result.clip;

			this.play();
			this.stop();
		});
	}

	parseFrameData( data, name ) {
		return {
			name: name.toLowerCase(),
			position: data.position,
			quaternion: data.quaternion,
		};
	}

	update() {
		requestAnimationFrame( this.update.bind(this) );
		if ( this.mixer ) {
			this.mixer.update( this.clock.getDelta() );

			var bones = _.map(_.uniqBy(_.map(this.mixer._bindingsByRootAndName[Object.keys(this.mixer._bindingsByRootAndName)[0]], (part, key) => {
				return part.binding.targetObject;
			}), "name"), (part) => { return this.parseFrameData(part, part.name); });

			if (bones.length > 0) {
				this.callback('BVH_User_' + Object.keys(this.mixer._bindingsByRootAndName)[0], bones, 'perceptionNeuron')
			}
		}
	}
}

module.exports = BVHPlayer;