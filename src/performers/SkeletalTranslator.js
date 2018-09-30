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

    this.kinectKeys = [
      'SpineBase',
      'SpineMid',
      'Neck',
      'Head',
      'ShoulderLeft',
      'ElbowLeft',
      'WristLeft',
      'HandLeft',
      'ShoulderRight',
      'ElbowRight', // 9
      'WristRight',
      'HandRight',
      'HipLeft',
      'KneeLeft',
      'AnkleLeft',
      'FootLeft',
      'HipRight',
      'KneeRight',
      'AnkleRight',
      'FootRight', // 19
      'SpineShoulder',
      'HandTipLeft',
      'ThumbLeft',
      'HandTipRight',
      'ThumbRight',
    ];
    window.kinectKeys = this.kinectKeys;

    this.mixamoPrefix = '';
    this.mixamoKeys = [
      this.mixamoPrefix + 'Hips', // 0
      this.mixamoPrefix + 'Spine', this.mixamoPrefix + 'Spine1', this.mixamoPrefix + 'Spine2', // 1, 2, 3
      this.mixamoPrefix + 'Neck', this.mixamoPrefix + 'Head', this.mixamoPrefix + 'Jaw', // 4, 5, 6
      this.mixamoPrefix + 'LeftShoulder', this.mixamoPrefix + 'LeftArm', this.mixamoPrefix + 'LeftForeArm', this.mixamoPrefix + 'LeftHand', // 7, 8, 9, 10,
      this.mixamoPrefix + 'LeftHandIndex1', this.mixamoPrefix + 'LeftHandIndex2', this.mixamoPrefix + 'LeftHandIndex3', this.mixamoPrefix + 'LeftHandRing1', this.mixamoPrefix + 'LeftHandRing2', this.mixamoPrefix + 'LeftHandRing3', this.mixamoPrefix + 'LeftHandThumb1', this.mixamoPrefix + 'LeftHandThumb2', this.mixamoPrefix + 'LeftHandThumb3', // 11, 12, 13, 14, 15, 16, 17, 18, 19
      this.mixamoPrefix + 'RightShoulder', this.mixamoPrefix + 'RightArm', this.mixamoPrefix + 'RightForeArm', this.mixamoPrefix + 'RightHand', // 20, 21, 22, 23
      this.mixamoPrefix + 'RightHandIndex1', this.mixamoPrefix + 'RightHandIndex2', this.mixamoPrefix + 'RightHandIndex3', this.mixamoPrefix + 'RightHandRing1', this.mixamoPrefix + 'RightHandRing2', this.mixamoPrefix + 'RightHandRing3', this.mixamoPrefix + 'RightHandThumb1', this.mixamoPrefix + 'RightHandThumb2', this.mixamoPrefix + 'RightHandThumb3',  // 24, 25, 26, 27, 28, 29, 30, 31, 32
      this.mixamoPrefix + 'LeftUpLeg', this.mixamoPrefix + 'LeftLeg', this.mixamoPrefix + 'LeftFoot', this.mixamoPrefix + 'LeftToeBase', // 33, 34, 35, 36
      this.mixamoPrefix + 'RightUpLeg', this.mixamoPrefix + 'RightLeg', this.mixamoPrefix + 'RightFoot', this.mixamoPrefix + 'RightToeBase' // 37, 38, 39, 40
    ];

    this.kinectronMixamoKeys = {
      SpineBase: this.mixamoKeys[1], SpineMid: this.mixamoKeys[2],
      Neck: this.mixamoKeys[4], Head: this.mixamoKeys[5],
      ShoulderLeft: this.mixamoKeys[7], ElbowLeft: this.mixamoKeys[8], WristLeft: this.mixamoKeys[9], HandLeft: this.mixamoKeys[10],
      ShoulderRight: this.mixamoKeys[20], ElbowRight: this.mixamoKeys[21], WristRight: this.mixamoKeys[22], HandRight: this.mixamoKeys[23],
      HipLeft: this.mixamoKeys[33], KneeLeft: this.mixamoKeys[34], AnkleLeft: this.mixamoKeys[35], FootLeft: this.mixamoKeys[36],
      HipRight: this.mixamoKeys[37], KneeRight: this.mixamoKeys[38], AnkleRight: this.mixamoKeys[39], FootRight: this.mixamoKeys[40],
      SpineShoulder: this.mixamoKeys[3],
      HandTipLeft: this.mixamoKeys[13], ThumbLeft: this.mixamoKeys[19],
      HandTipRight: this.mixamoKeys[26], ThumbRight: this.mixamoKeys[32],
    };

    this.kinectTransportKeys = {
      SpineBase: 'spine', SpineMid: 'spine2', SpineShoulder: 'spine3',
        Neck: 'neck', Head: 'head',
      ShoulderLeft: 'leftarm', ElbowLeft: 'leftforearm', WristLeft: 'lefthand',
        HandLeft: 'lefthand', HandTipLeft: 'lefthandindex3', ThumbLeft: 'lefthandthumb3',
      ShoulderRight: 'rightarm', ElbowRight: 'rightforearm', WristRight: 'righthand',
        HandRight: 'righthand', HandTipRight: 'righthandindex3', ThumbRight: 'righthandthumb3',
      HipLeft: 'leftupleg', KneeLeft: 'leftleg', AnkleLeft: 'leftfoot', FootLeft: '',
      HipRight: 'rightupleg', KneeRight: 'rightleg', AnkleRight: 'rightfoot', FootRight: '',
    };

    this.kinectPairs = [
      ['Head', 'Neck'],
      ['Neck', 'SpineShoulder'],
      ['SpineShoulder', 'SpineMid'],
      ['SpineMid', 'SpineBase'],

      ['SpineShoulder', 'ShoulderLeft'],
      ['ShoulderLeft', 'ElbowLeft'],
      ['ElbowLeft', 'WristLeft'],
      ['WristLeft', 'HandLeft'],
      ['HandLeft', 'HandTipLeft'],
      ['HandLeft', 'ThumbLeft'],

      ['SpineShoulder', 'ShoulderRight'],
      ['ShoulderRight', 'ElbowRight'],
      ['ElbowRight', 'WristRight'],
      ['WristRight', 'HandRight'],
      ['HandRight', 'HandTipRight'],
      ['HandRight', 'ThumbRight'],
      
      ['SpineBase', 'HipLeft'],
      ['HipLeft', 'KneeLeft'],
      ['KneeLeft', 'AnkleLeft'],
      ['AnkleLeft', 'FootLeft'],

      ['SpineBase', 'HipRight'],
      ['HipRight', 'KneeRight'],
      ['KneeRight', 'AnkleRight'],
      ['AnkleRight', 'FootRight'],
    ];
    // {name:'SpineBase',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'SpineMid',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'Neck',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'Head',position:{x:0.00000,y:0.00000,z:0.00000}},

    // {name:'ShoulderLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'ElbowLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'WristLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'HandLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    
    // {name:'ShoulderRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'ElbowRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'WristRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'HandRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    
    // {name:'HipLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'KneeLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'AnkleLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'FootLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    
    // {name:'HipRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'KneeRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'AnkleRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'FootRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    
    // {name:'SpineShoulder',position:{x:0.00000,y:0.00000,z:0.00000}},
    
    // {name:'HandTipLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'ThumbLeft',position:{x:0.00000,y:0.00000,z:0.00000}},
    
    // {name:'HandTipRight',position:{x:0.00000,y:0.00000,z:0.00000}},
    // {name:'ThumbRight',position:{x:0.00000,y:0.00000,z:0.00000}}
  }

  kinectronMixamoLookup(key) {
    return this.kinectronMixamoKeys[key];
  }

  kinectronMixamoLookupByIndex(idx) {
    // console.log(this.kinectronMixamoKeys[this.kinectKeys[idx]]);
    return this.kinectronMixamoKeys[this.kinectKeys[idx]];
  }

  getBVHPath(jointName) {
    // this.bvhStructure.traverse((a, b, c) => {
    //   console.log(a, b, c);
    // });
  }

  createLine(pos1, pos2, names) {
    const geo = new THREE.Geometry();
    geo.vertices.push(
      pos1,
      pos2,
    );
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: 0xFFFFFF,
      }),
    );
    line.name = names[0];
    line.vertexNames = names;
    return line;
  }

  createAxisIndicator(d) {
    // let geometry = new THREE.CylinderGeometry(0.01, 0.01, 0.1, 32);
    // let material = new THREE.MeshBasicMaterial({color: 0xffff00});
    // let cylinder = new THREE.Mesh(geometry, material);
    let axesHelper = new THREE.AxesHelper(0.05);
    axesHelper.name = d.name;
    axesHelper.position.copy(
      new THREE.Vector3(
        d.cameraX,
        d.cameraY,
        d.cameraZ,
      )
    );
    axesHelper.quaternion.copy(
      new THREE.Quaternion(
        d.orientationX,
        d.orientationY,
        d.orientationZ,
        d.orientationW,
      )
    );
    return axesHelper;
  }

  createBonesFromLines(lines) {
    return _.map(lines, (line) => {
      let bone = new THREE.Bone();
      bone.name =  line.name;
      bone.quaternion.copy(line.quaternion.clone());
      return bone;
    });
  }

  createLineSkeleton(data, cb) {
    let lineGroup = new THREE.Object3D();
    let axesGroup = new THREE.Object3D();

    lineGroup.children = _.map(this.kinectPairs, (pair) => {
      return this.createLine(
        new THREE.Vector3(
          data[this.kinectKeys.indexOf(pair[0])].cameraX,
          data[this.kinectKeys.indexOf(pair[0])].cameraY,
          data[this.kinectKeys.indexOf(pair[0])].cameraZ,
        ),
        new THREE.Vector3(
          data[this.kinectKeys.indexOf(pair[1])].cameraX,
          data[this.kinectKeys.indexOf(pair[1])].cameraY,
          data[this.kinectKeys.indexOf(pair[1])].cameraZ,
        ),
        [this.kinectronMixamoLookup(pair[0]), this.kinectronMixamoLookup(pair[1])],
      )
    });

    _.each(data, (d) => {
      axesGroup.add(this.createAxisIndicator(d));
    });
    
    //  = lines;
    // let skeleton = this.createBonesFromLines(lines);
    cb(
      lineGroup,
      axesGroup,
      // skeleton,
    );
  }

  updateLineSkeleton(lineGroup, axesGroup, data) {
    _.each(data, (d, idx) => {
      let lines = _.filter(lineGroup.children, (c) => {
        return (c.vertexNames.indexOf(this.kinectronMixamoLookup(d.name)) > -1);
      });
      if (lines.length > 0) {
        _.each(lines, (l) => {
          l.geometry.vertices[l.vertexNames.indexOf(this.kinectronMixamoLookup(d.name))].copy(
            new THREE.Vector3(
              d.cameraX,
              d.cameraY,
              d.cameraZ,
            )
          );
          l.geometry.verticesNeedUpdate = true;
        });
      }
      let axis = _.filter(axesGroup.children, (c) => {
        return c.name == d.name;
      });
      if (axis.length > 0) {
        _.each(axis, (c) => {
          c.position.copy(
            new THREE.Vector3(
              d.cameraX,
              d.cameraY,
              d.cameraZ,
            )
          );
          c.quaternion.copy(
            new THREE.Quaternion(
              d.orientationX,
              d.orientationY,
              d.orientationZ,
              d.orientationW,
            ),
          );
        });
      }
    });
  }

  buildKinectronSkeleton(data, cb) {
    cb(
      new THREE.Skeleton(_.map(this.kinectPairs, (pair) => {
        return this.createBoneFromLine(
          new THREE.Vector3(
            data[this.kinectKeys.indexOf(pair[0])].cameraX,
            data[this.kinectKeys.indexOf(pair[0])].cameraY,
            data[this.kinectKeys.indexOf(pair[0])].cameraZ,
          ),
          new THREE.Vector3(
            data[this.kinectKeys.indexOf(pair[1])].cameraX,
            data[this.kinectKeys.indexOf(pair[1])].cameraY,
            data[this.kinectKeys.indexOf(pair[1])].cameraZ,
          ),
          pair[0] + '-' + pair[1],
        ).bone
      }))
    );
  }

  buildKinectronQuats(data, cb) {
    const lineGroup = new THREE.Object3D();
    cb(
      _.map(this.kinectPairs, (pair) => {
        const geo = new THREE.Geometry();
        geo.vertices.push(
          new THREE.Vector3(
            data[this.kinectKeys.indexOf(pair[0])].cameraX,
            data[this.kinectKeys.indexOf(pair[0])].cameraY,
            data[this.kinectKeys.indexOf(pair[0])].cameraZ,
          ),
          new THREE.Vector3(
            data[this.kinectKeys.indexOf(pair[1])].cameraX,
            data[this.kinectKeys.indexOf(pair[1])].cameraY,
            data[this.kinectKeys.indexOf(pair[1])].cameraZ,
          ),
        );
        const line = new THREE.Line(
          geo,
          new THREE.LineBasicMaterial({
            color: 0xFFFFFF,
          }),
        );
        lineGroup.add(line);
        return line.quaternion.clone();
      }),
      lineGroup,
    );
  }

  fetchKinectVertex(data, name) {
    return new THREE.Vector3(
      data[this.kinectKeys.indexOf(name)].cameraX,
      data[this.kinectKeys.indexOf(name)].cameraY,
      data[this.kinectKeys.indexOf(name)].cameraZ,
    );
  }

  buildKinectGeo(data, cb) {
    var geometry = new THREE.Geometry();
    var names = [];

    _.each(this.kinectPairs, (pair) => {
      geometry.vertices.push(
        new THREE.Vector3(
          data[this.kinectKeys.indexOf(pair[0])].cameraX,
          data[this.kinectKeys.indexOf(pair[0])].cameraY,
          data[this.kinectKeys.indexOf(pair[0])].cameraZ,
        )
      );
      names.push(this.kinectronMixamoLookup(pair[0]));

      geometry.vertices.push(
        new THREE.Vector3(
          data[this.kinectKeys.indexOf(pair[1])].cameraX,
          data[this.kinectKeys.indexOf(pair[1])].cameraY,
          data[this.kinectKeys.indexOf(pair[1])].cameraZ,
        )
      );
      names.push(this.kinectronMixamoLookup(pair[1]));
    });

    geometry.computeBoundingSphere();
    cb(geometry, names);
  }

  buildKinectSkeleton(data, parent, cb) {
    cb(
      new THREE.Skeleton(
        _.map(this.kinectPairs, (pair) => {
          var geo = new THREE.Geometry();
          console.log(pair);
          console.log(_.filter(data, (d) => { return d.name == pair[0]; })[0]);
          console.log(_.filter(data, (d) => { return d.name == pair[1]; })[0]);
          geo.vertices.push(
            parseInt(_.filter(data, (d) => { return d.name == pair[0]; })[0].position),
            parseInt(_.filter(data, (d) => { return d.name == pair[1]; })[0].position),
          );
          var line = new THREE.Line(
            geo,
            new THREE.LineBasicMaterial({
              color: 0xFFFFFF,
            }),
          );
          console.log(line);
          // parent.add(line);
          let bone = new THREE.Bone();
          bone.quaternion.copy(line.quaternion.clone());
          return bone;
        })
      )
    );
    // cb(new THREE.Skeleton(_.map(data, (d) => {
    //   let bone = new THREE.Bone();
    //   bone.name = d.name;
    //   // bone.position.copy(new THREE.Vector3(d.position.x, d.position.y, d.position.z));
    //   // bone.useQuaternion = false;
    //   return bone;
    // })));
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
    return this.kinectTransportKeys[name];
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
