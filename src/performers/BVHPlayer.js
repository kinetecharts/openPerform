var THREE = require('three');
var bvhLoader = require('./../libs/three/loaders/BVHLoader.js');
import Common from './../util/Common'

var _ = require('lodash').mixin(require('lodash-keyarrange'));
import dat from 'dat-gui'

class BVHPlayer {
	constructor(parent, callback) {
		this.parent = parent;
		this.callback = callback;

		this.clock = new THREE.Clock();
		
		this.mixer;
		this.skeletonHelper;
		this.boneContainer = new THREE.Group();

		this.loader = new THREE.BVHLoader();

		this.names = {
			hip: 'hips',
			abdomen: 'spine2',
			chest: 'spine1',
			neck: 'neck',
			head: 'head',
			leftEye: 'leftEye',
			rightEye: 'rightEye',
			rCollar: 'rightshoulder',
			rShldr: 'rightarm',
			rForeArm: 'rightforearm',
			rHand: 'righthand',
			rThumb1: 'righthandthumb1',
			rThumb2: 'righthandthumb2',
			rIndex1: 'righthandindex1',
			rIndex2: 'righthandindex2',
			rMid1: 'righthandmiddle1',
			rMid2: 'righthandmiddle2',
			rRing1: 'righthandring1',
			rRing2: 'righthandring2',
			rPinky1: 'righthandpinky1',
			rPinky2: 'righthandpinky2',
			lCollar: 'leftshoulder',
			lShldr: 'leftarm',
			lForeArm: 'leftforearm',
			lHand: 'lefthand',
			lThumb1: 'lefthandthumb1',
			lThumb2: 'lefthandthumb2',
			lIndex1: 'lefthandindex1',
			lIndex2: 'lefthandindex2',
			lMid1: 'lefthandmiddle1',
			lMid2: 'lefthandmiddle2',
			lRing1: 'lefthandring1',
			lRing2: 'lefthandring2',
			lPinky1: 'lefthandpinky1',
			lPinky2: 'lefthandpinky2',
			rButtock: 'rButtock',//???
			rThigh: 'rightupleg',
			rShin: 'rightleg',
			rFoot: 'rightfoot',
			lButtock: 'lButtock',//???
			lThigh: 'leftupleg',
			lShin: 'leftleg',
			lFoot: 'leftfoot'
		};

		this.loadBVH();

		this.update();
	}

	loadBVH() {
		this.loader.load( "models/bvh/pirouette.bvh", ( result ) => {

			this.skeletonHelper = new THREE.SkeletonHelper( result.skeleton.bones[ 0 ] );
			this.skeletonHelper.skeleton = result.skeleton; // allow animation mixer to bind to SkeletonHelper directly
			
			this.boneContainer.add( result.skeleton.bones[ 0 ] );
			
			// this.parent.add( this.skeletonHelper );
			// this.parent.add( this.boneContainer );
			
			// play animation
			this.mixer = new THREE.AnimationMixer( this.skeletonHelper );
			this.mixer.clipAction( result.clip ).setEffectiveWeight( 1.0 ).play();
		});
	}

	parseFrameData( data, name ) {
		return {
			name: this.names[name],
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

			this.callback('BVH_User_' + Object.keys(this.mixer._bindingsByRootAndName)[0], bones, 'perceptionNeuron')
		}
	}
}

module.exports = BVHPlayer;