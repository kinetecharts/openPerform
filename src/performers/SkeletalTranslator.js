import Common from '../util/Common';

class SkeletalTranslator {
  constructor() {
    this.skeletonHelper = null;
    this.boneContainer = null;
    this.mixer = null;

    this.bvhStructure = {
      hips: {
        rightupleg: {
          rightleg: {
            rightfoot: {},
          },
        },
        leftupleg: {
          leftleg: {
            leftfoot: {},
          },
        },
        spine: {
          spine1: {
            spine2: {
              spine3: {
                neck: {
                  head: {},
                },
                rightshoulder: {
                  rightarm: {
                    rightforearm: {
                      righthand: {
                        righthandthumb1: {
                          righthandthumb2: {
                            righthandthumb3: {},
                          },
                        },
                        rightinhandindex: {
                          righthandindex1: {
                            righthandindex2: {
                              righthandindex3: {},
                            },
                          },
                        },
                        rightinhandmiddle: {
                          righthandmiddle1: {
                            righthandmiddle2: {
                              righthandmiddle3: {},
                            },
                          },
                        },
                        rightinhandring: {
                          righthandring1: {
                            righthandring2: {
                              righthandring3: {},
                            },
                          },
                        },
                        rightinhandpinky: {
                          righthandpinky1: {
                            righthandpinky2: {
                              righthandpinky3: {},
                            },
                          },
                        },
                      },
                    },
                  },
                },
                leftshoulder: {
                  leftarm: {
                    leftforearm: {
                      lefthand: {
                        lefthandthumb1: {
                          lefthandthumb2: {
                            lefthandthumb3: {},
                          },
                        },
                        leftinhandindex: {
                          lefthandindex1: {
                            lefthandindex2: {
                              lefthandindex3: {},
                            },
                          },
                        },
                        leftinhandmiddle: {
                          lefthandmiddle1: {
                            lefthandmiddle2: {
                              lefthandmiddle3: {},
                            },
                          },
                        },
                        leftinhandring: {
                          lefthandring1: {
                            lefthandring2: {
                              lefthandring3: {},
                            },
                          },
                        },
                        leftinhandpinky: {
                          lefthandpinky1: {
                            lefthandpinky2: {
                              lefthandpinky3: {},
                            },
                          },
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    };

    this.bvhKeys = Common.getKeys(this.bvhStructure, '');

    
    this.kinectKeys = {
      SpineBase: 'spine', SpineMid: 'spine2', SpineShoulder: 'spine3',
        Neck: 'neck', Head: 'head',
      ShoulderLeft: 'leftarm', ElbowLeft: 'leftforearm', WristLeft: 'lefthand',
        HandLeft: 'lefthand', HandTipLeft: 'lefthandindex3', ThumbLeft: 'lefthandthumb3',
      ShoulderRight: 'rightarm', ElbowRight: 'rightforearm', WristRight: 'righthand',
        HandRight: 'righthand', HandTipRight: 'righthandindex3', ThumbRight: 'righthandthumb3',
      HipLeft: 'leftupleg', KneeLeft: 'leftleg', AnkleLeft: 'leftfoot', FootLeft: '',
      HipRight: 'rightupleg', KneeRight: 'rightleg', AnkleRight: 'rightfoot', FootRight: '',
    };
  }

  buildBVHAnimation(result, cb) {
    this.skeletonHelper = new THREE.SkeletonHelper(result.skeleton.bones[0]);

    // allow animation mixer to bind to SkeletonHelper directly
    this.skeletonHelper.skeleton = result.skeleton;
    this.boneContainer = new THREE.Group().add(result.skeleton.bones[0]);

    cb(
      new THREE.AnimationMixer(this.skeletonHelper),
      result.clip,
    );
  }

  kinectLookup(name) {
    return this.kinectKeys[name];
  }

  poseNetLookup(name) {

  }

  parseBVHFrameData(data, name) {
    return {
      name: name.toLowerCase(),
      position: data.position,
      quaternion: data.quaternion,
    };
  }

  parsePNFrameData(data, name) {
    const keyframe = { // setup default data obj
      name, // bone name from bvhStructure
      position: { x: 0, y: 1, z: 2 }, //default
      quaternion: new THREE.Quaternion(), //default
      rotation: new THREE.Euler(data[3], data[4], data[5], 'XYZ'), //default
    };

    // parse values for each channel in node

    keyframe.position.x = parseFloat(data[0]); //set position values from data stream
    keyframe.position.y = parseFloat(data[1]);
    keyframe.position.z = parseFloat(data[2]);

    const quat = new THREE.Quaternion();

    const vx = new THREE.Vector3(1, 0, 0);
    const vy = new THREE.Vector3(0, 1, 0);
    const vz = new THREE.Vector3(0, 0, 1);

    quat.setFromAxisAngle(vy, parseFloat(data[3]) * Math.PI / 180);
    keyframe.quaternion.multiply(quat);

    quat.setFromAxisAngle(vx, parseFloat(data[4]) * Math.PI / 180);
    keyframe.quaternion.multiply(quat);

    quat.setFromAxisAngle(vz, parseFloat(data[5]) * Math.PI / 180);
    keyframe.quaternion.multiply(quat);

    return keyframe;
  }
}

module.exports = SkeletalTranslator;
