import Common from '../util/Common';

class SkeletalTranslator {
  constructor() {
    this.verticalMovement = true;
    this.offsetCalibrated = false;
    this.mirroredMovement = false;
    this.moveRate = 1;

    this.skeletonHelper = null;
    this.boneContainer = null;
    this.mixer = null;
    window.orients = [
      ['w', 'x', 'y', 'z'],
      ['w', 'x', 'z', 'y'],
      ['w', 'y', 'x', 'z'],
      ['w', 'y', 'z', 'x'],
      ['w', 'z', 'x', 'y'],
      ['w', 'z', 'y', 'x'],
      ['x', 'w', 'y', 'z'],
      ['x', 'w', 'z', 'y'],
      ['x', 'y', 'w', 'z'],
      ['x', 'y', 'z', 'w'], 
      ['x', 'z', 'w', 'y'],
      ['x', 'z', 'y', 'w'], 
      ['y', 'w', 'x', 'z'],
      ['y', 'w', 'z', 'x'],
      ['y', 'x', 'w', 'z'],
      ['y', 'x', 'z', 'w'], 
      ['y', 'z', 'w', 'x'],
      ['y', 'z', 'x', 'w'], 
      ['z', 'w', 'x', 'y'],
      ['z', 'w', 'y', 'x'],
      ['z', 'x', 'w', 'y'],
      ['z', 'x', 'y', 'w'], 
      ['z', 'y', 'w', 'x'],
      ['z', 'y', 'x', 'w'],
    ];
    window.orient = ['x', 'y', 'z', 'w'];
    // window.orient = ['w', 'z', 'y', 'x'];
    // window.orient = ["z", "w", "x", "y"];
    window.randomOrient = () => {
      window.orient = window.orients[Math.floor(Math.random()*window.orients.length)];
    }

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

    this.kinectronMeshGroupKeys = {
      'chest': 'SpineShoulder',
      'head': 'Head',
      'hips': 'SpineBase',
      'lArm': 'ShoulderLeft',
      'lFoot': 'FootLeft',
      'lForearm': 'ElbowLeft',
      'lHand': 'HandLeft',
      'lShin': 'KneeLeft',
      'lThigh': 'HipLeft',
      'neck': 'Neck',
      'rArm': 'ElbowRight',
      'rFoot': 'FootRight',
      'rForearm': 'ShoulderRight',
      'rHand': 'HandRight',
      'rShin': 'KneeRight',
      'rThigh': 'HipRight',
      'spine': 'Hips',
      'spine2': 'SpineMid',
      'spine3': 'SpineMid',
    }

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
      // SpineBase: this.mixamoKeys[0],
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

    this.otherKeys = ["Pelvis","hoodie_02", // 0, 1
      "Spine1","Spine2","Spine3","Spine4", // 2, 3, 4, 5
      "Neck","Head","Jaw", // 6, 7, 8
      "R_Collar","R_Shoulder","R_Elbow","R_Wrist", // 9, 10, 11, 12
        "R_IndexA","R_IndexB","R_IndexC", // 13, 14, 15
        "R_MiddleA","R_MiddleB","R_MiddleC", // 16, 17, 18
        "R_RingA","R_RingB","R_RingC", // 19, 20, 21
        "R_PinkyA","R_PinkyB","R_PinkyC", // 22, 23, 24
        "R_ThumbA","R_ThumbB","R_ThumbC", // 25, 26, 27
      "L_Collar","L_Shoulder","L_Elbow","L_Wrist", // 28, 29, 30, 31
        "L_IndexA","L_IndexB","L_IndexC", // 32, 33, 34
        "L_MiddleA","L_MiddleB","L_MiddleC", // 35, 36, 37
        "L_RingA","L_RingB","L_RingC", // 38, 39, 40
        "L_PinkyA","L_PinkyB","L_PinkyC", // 41, 42, 43
        "L_ThumbA","L_ThumbB","L_ThumbC", // 44, 45, 46
      "R_Rib1","L_Rib1", // 47, 48
      "R_Hip", "R_Knee","R_Ankle","R_Toe", // 49, 50, 51, 52
      "L_Hip","L_Knee","L_Ankle","L_Toe"]; // 53, 54, 55, 56

    this.kinectronOtherKeys = {
      SpineBase: this.otherKeys[2], SpineMid: this.otherKeys[4],
      Neck: this.otherKeys[6], Head: this.otherKeys[7],
      ShoulderLeft: this.otherKeys[28], ElbowLeft: this.otherKeys[29], WristLeft: this.otherKeys[30], HandLeft: this.otherKeys[31],
      ShoulderRight: this.otherKeys[9], ElbowRight: this.otherKeys[10], WristRight: this.otherKeys[11], HandRight: this.otherKeys[12],
      HipLeft: this.otherKeys[53], KneeLeft: this.otherKeys[54], AnkleLeft: this.otherKeys[55], FootLeft: this.otherKeys[56],
      HipRight: this.otherKeys[49], KneeRight: this.otherKeys[50], AnkleRight: this.otherKeys[51], FootRight: this.otherKeys[52],
      SpineShoulder: this.otherKeys[5],
      HandTipLeft: this.otherKeys[34], ThumbLeft: this.otherKeys[46],
      HandTipRight: this.otherKeys[15], ThumbRight: this.otherKeys[27],
    };

    this.otherKinectronKeys = {
      Pelvis: this.kinectKeys[0],
      hoodie_02: this.kinectKeys[0],
      Spine1: this.kinectKeys[0],
      Spine2: this.kinectKeys[0],
      Spine3: this.kinectKeys[1],
      Spine4: this.kinectKeys[20],
      Neck: this.kinectKeys[2],
      Head: this.kinectKeys[3],
      Jaw: this.kinectKeys[0],
      R_Collar: this.kinectKeys[0],
      R_Shoulder: this.kinectKeys[0],
      R_Elbow: this.kinectKeys[0],
      R_Wrist: this.kinectKeys[0],
      R_IndexA: this.kinectKeys[0],
      R_IndexB: this.kinectKeys[0],
      R_IndexC: this.kinectKeys[0],
      R_MiddleA: this.kinectKeys[0],
      R_MiddleB: this.kinectKeys[0],
      R_MiddleC: this.kinectKeys[0],
      R_RingA: this.kinectKeys[0],
      R_RingB: this.kinectKeys[0],
      R_RingC: this.kinectKeys[0],
      R_PinkyA: this.kinectKeys[0],
      R_PinkyB: this.kinectKeys[0],
      R_PinkyC: this.kinectKeys[0],
      R_ThumbA: this.kinectKeys[0],
      R_ThumbB: this.kinectKeys[0],
      R_ThumbC: this.kinectKeys[0],
      L_Collar: this.kinectKeys[0],
      L_Shoulder: this.kinectKeys[0],
      L_Elbow: this.kinectKeys[0],
      L_Wrist: this.kinectKeys[0],
      L_IndexA: this.kinectKeys[0],
      L_IndexB: this.kinectKeys[0],
      L_IndexC: this.kinectKeys[0],
      L_MiddleA: this.kinectKeys[0],
      L_MiddleB: this.kinectKeys[0],
      L_MiddleC: this.kinectKeys[0],
      L_RingA: this.kinectKeys[0],
      L_RingB: this.kinectKeys[0],
      L_RingC: this.kinectKeys[0],
      L_PinkyA: this.kinectKeys[0],
      L_PinkyB: this.kinectKeys[0],
      L_PinkyC: this.kinectKeys[0],
      L_ThumbA: this.kinectKeys[0],
      L_ThumbB: this.kinectKeys[0],
      L_ThumbC: this.kinectKeys[0],
      R_Rib1: this.kinectKeys[0],
      L_Rib1: this.kinectKeys[0],
      R_Hip: this.kinectKeys[16],
      R_Knee: this.kinectKeys[17],
      R_Ankle: this.kinectKeys[18],
      R_Toe: this.kinectKeys[19],
      L_Hip: this.kinectKeys[12],
      L_Knee: this.kinectKeys[13],
      L_Ankle: this.kinectKeys[14],
      L_Toe: this.kinectKeys[15],
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
      // ['Head', 'Neck'],
      // ['Neck', 'SpineShoulder'],
      ['SpineShoulder', 'SpineMid'],
      ['SpineMid', 'SpineBase'],

      // ['SpineShoulder', 'ShoulderLeft'],
      ['ShoulderLeft', 'ElbowLeft'],
      ['ElbowLeft', 'WristLeft'],
      ['WristLeft', 'HandLeft'],
      // ['HandLeft', 'HandTipLeft'],
      // ['WristLeft', 'ThumbLeft'],

      // ['SpineShoulder', 'ShoulderRight'],
      ['ShoulderRight', 'ElbowRight'],
      ['ElbowRight', 'WristRight'],
      ['WristRight', 'HandRight'],
      // ['HandRight', 'HandTipRight'],
      // ['WristRight', 'ThumbRight'],
      
      // ['SpineBase', 'HipLeft'],
      ['HipLeft', 'KneeLeft'],
      ['KneeLeft', 'AnkleLeft'],
      ['AnkleLeft', 'FootLeft'],

      // ['SpineBase', 'HipRight'],
      ['HipRight', 'KneeRight'],
      ['KneeRight', 'AnkleRight'],
      ['AnkleRight', 'FootRight'],
    ];
  }

  otherKinectronLookup(key) {
    return this.otherKinectronKeys[key];
  }

  kinectronOtherLookup(key) {
    return this.kinectronOtherKeys[key];
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

  createLine(positions, quaternions, names, color) {
    const geo = new THREE.Geometry();
    geo.vertices.push(
      positions[0],
      positions[1],
    );
    const line = new THREE.Line(
      geo,
      new THREE.LineBasicMaterial({
        color: color,
      }),
    );
    line.name = names[0];
    line.jointNames = names;
    line.quats = quaternions;
    return line;
  }

  createAxisIndicator(d) {
    let axesHelper = new THREE.AxesHelper(0.075);
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

  createCubeBone(name, length, pos, quat, names, color, bone, type) {
    let materials = [
      // new THREE.MeshPhongMaterial({ color: color }),
      // new THREE.MeshBasicMaterial({ color: 0x00ff00 }),
      // new THREE.MeshBasicMaterial({ color: 0x0000ff }),
      // new THREE.MeshBasicMaterial({ color: 0x0ff000 }),
      // new THREE.MeshBasicMaterial({ color: 0x0ff000 }),
      // new THREE.MeshBasicMaterial({ color: 0xf0000f }),
    ];

    // console.log(names);
    let geometry = this.createCubeGeo(names[1], length, bone, type);
    let cube = new THREE.Mesh(geometry, new THREE.MeshPhongMaterial({
      color: bone.color,
      flatShading: true,
      shininess: 100,
    }));
    cube.castShadow = true;
    cube.receiveShadow = true;
    cube.bone = bone;
    cube.name = name;
    cube.type = type;
    cube.position.copy(pos.clone());
    cube.quaternion.copy(quat.clone());
    cube.jointNames = names;
    cube.srcMatrix = cube.matrix.clone();
    return cube;
  }

  updateCubeGeo(geometry, name, length, bone, type) {
    if (length !== geometry.length) {
      geometry = this.createCubeGeo(name, length, bone, type);
    }
    geometry.length = length;
    return geometry;
  }

  createCubeGeo(name, length, bone, type) {
    let geometry;
    switch(type) {
      default:
        // geometry = new THREE.BoxGeometry(size.x, length, size.z);
        geometry = new THREE.CylinderGeometry(bone.x, bone.z, length, 4);
        break;
      case 'poly':
        // geometry = new THREE.BoxGeometry(size.x, length, size.z);
        geometry = new THREE.CylinderGeometry(bone.x, bone.z, length, 6);
        break;
      case 'cylinder':
        geometry = new THREE.CylinderGeometry(bone.x, bone.z, length, 8);
        break;
    }
    // console.log(name);
    switch(name) {
      default:
        geometry.translate(0, length/2, 0);
        break;
      case 'RightShoulder':
      case 'LeftShoulder':
      // case 'Spine2':
      // case 'LeftHandThumb3':
      // case 'RightHandThumb3':
      // case 'LeftHandIndex3':
      // case 'RightHandIndex3':
      // case 'RightToeBase':
      // case 'LeftToeBase':
        geometry = new THREE.BoxGeometry(0.04, length, 0.04);
        geometry.translate(0, -(length/2), 0);
        break;
    }
    geometry.length = length;
    geometry.srcLength = length;
    return geometry;
  }

  createBoneFromLine(positions, quats, name) {
    let line = this.createLine(
      positions,
      quats,
      name,
    );
    let bone = new THREE.Bone();
    bone.name =  name;
    bone.quaternion.copy(line.quaternion.clone());
    bone.position.copy(positions[0].clone());
    return bone;
  }

  createBonesFromLines(lines) {
    return _.map(lines, (line) => {
      let bone = new THREE.Bone();
      bone.name =  line.name;
      bone.quaternion.copy(line.quaternion.clone());
      return bone;
    });
  }

  createLineSkeleton(data, color, bones, type, visible, cb) {
    let lineGroup = new THREE.Object3D();
    let axesGroup = new THREE.Object3D();
    let cubeBoneGroup = new THREE.Object3D();
    let cubeBones = [];

    _.each(this.kinectPairs, (pair) => {
      let startPos = new THREE.Vector3(
        data[this.kinectKeys.indexOf(pair[0])].cameraX,
        data[this.kinectKeys.indexOf(pair[0])].cameraY,
        data[this.kinectKeys.indexOf(pair[0])].cameraZ,
      );
      let endPos = new THREE.Vector3(
        data[this.kinectKeys.indexOf(pair[1])].cameraX,
        data[this.kinectKeys.indexOf(pair[1])].cameraY,
        data[this.kinectKeys.indexOf(pair[1])].cameraZ,
      );

      let startQuat = new THREE.Quaternion(
        data[this.kinectKeys.indexOf(pair[0])].orientationX,
        data[this.kinectKeys.indexOf(pair[0])].orientationY,
        data[this.kinectKeys.indexOf(pair[0])].orientationZ,
        data[this.kinectKeys.indexOf(pair[0])].orientationW,
      );
      let endQuat = new THREE.Quaternion(
        data[this.kinectKeys.indexOf(pair[1])].orientationX,
        data[this.kinectKeys.indexOf(pair[1])].orientationY,
        data[this.kinectKeys.indexOf(pair[1])].orientationZ,
        data[this.kinectKeys.indexOf(pair[1])].orientationW,
      );

      // lineGroup.add(this.createLine(
      //   [startPos, endPos],
      //   [startQuat, endQuat],
      //   [this.kinectronMixamoLookup(pair[0]), this.kinectronMixamoLookup(pair[1])],
      //   color,
      // ));

      let cubeBone = this.createCubeBone(
        pair[0],
        startPos.distanceTo(endPos),
        startPos,
        startQuat,
        [this.kinectronMixamoLookup(pair[0]), this.kinectronMixamoLookup(pair[1])],
        color,
        bones[pair[0]],
        type,
      );
      cubeBones[pair] = cubeBone;
      cubeBoneGroup.add(cubeBone);
    });
    

    // _.each(data, (d) => {
    //   axesGroup.add(this.createAxisIndicator(d));
    // });

    // lineGroup.visible = visible;
    cubeBoneGroup.visible = visible;
    // axesGroup.visible = visible;

    cb(
      lineGroup,
      axesGroup,
      cubeBoneGroup,
      cubeBones
    );
  }

  updateLineSkeleton(lineGroup, axesGroup, cubeBoneGroup, kinectronData, visible, headGroup) {
    // update cube / bones
    this.updateCubeBones(kinectronData, cubeBoneGroup, visible);

    // console.log(_.filter(kinectronData, ['name', 'Neck'])[0]);
    const translatedData = this.translateKinectron([
      _.filter(kinectronData, ['name', 'Head'])[0], 
      _.filter(kinectronData, ['name', 'Neck'])[0],
    ]);
    headGroup.children[0].position.copy(translatedData.position.clone());
    headGroup.children[0].quaternion.copy(translatedData.quaternion.clone());
    headGroup.children[0].castShadow = true;
    headGroup.children[0].receiveShadow = true;

    // _.each(data, (d, idx) => {
      // update lines
      // this.updateLines(d, lineGroup, visible);

      // update axes
      // this.updateAxes(d, axesGroup, visible);
    // });
  }

  updateLines(d, lineGroup, visible) {
    _.each(_.filter(lineGroup.children, (c) => {
      return (c.jointNames.indexOf(this.kinectronMixamoLookup(d.name)) > -1);
    }), (l) => {
        l.geometry.vertices[l.jointNames.indexOf(this.kinectronMixamoLookup(d.name))].copy(
          new THREE.Vector3(
            d.cameraX,
            d.cameraY,
            -d.cameraZ,
          )
        );
        l.geometry.verticesNeedUpdate = true;
    });
    lineGroup.visible = visible;
  }

  updateAxes(d, axesGroup, visible) {
    _.each(_.filter(axesGroup.children, (a) => {
      return a.name == d.name;
    }), (a) => {
      a.position.copy(
        new THREE.Vector3(
          d.cameraX,
          d.cameraY,
          d.cameraZ,
        )
      );
      let jointRotation = new THREE.Quaternion(
        d.orientationX,
        d.orientationY,
        d.orientationZ,
        d.orientationW,
      );
      // if (a.name.toLowerCase().indexOf('left') !== -1) {
      //   jointRotation = Common.leftToRightHanded(jointRotation);
      // }
      a.quaternion.copy(
        jointRotation
      );
      // if (a.name.toLowerCase().indexOf('left') !== -1) {
      //   a.rotation.y -= Math.PI/5;
      // }
    });
    axesGroup.visible = visible;
  }

  updateCubeBones(data, cubeBoneGroup, visible) {
    _.each(cubeBoneGroup.children, (c) => {
      let jointData =_.filter(data, (d) => {
        return (c.jointNames.indexOf(this.kinectronMixamoLookup(d.name)) !== -1);
      });
      if (jointData.length > 1) {
        // update bone length
        c.geometry = this.updateCubeGeo(c.geometry, c.jointNames[1], new THREE.Vector3(
          jointData[0].cameraX,
          jointData[0].cameraY,
          jointData[0].cameraZ,
        ).distanceTo(new THREE.Vector3(
          jointData[1].cameraX,
          jointData[1].cameraY,
          jointData[1].cameraZ,
        )), c.bone, c.type);
        let translatedData = this.translateKinectron(jointData);
        
        c.position.copy(translatedData.position.clone());
        c.quaternion.copy(translatedData.quaternion.clone());
        c.jointData = jointData;
        // if (c.name.toLowerCase().indexOf('left') !== -1) {
        // } else if (c.name.toLowerCase().indexOf('right') !== -1) {
        // }
      }
    });
    cubeBoneGroup.visible = visible;
  }

  translateKinectron(jointData) {
    const translatedData = {
      position: new THREE.Vector3(),
      quaternion: new THREE.Quaternion(),
    };

    const joint1quat = new THREE.Quaternion( // first joint quaternion
      jointData[0].orientationX,
      jointData[0].orientationY,
      jointData[0].orientationZ,
      jointData[0].orientationW,
    );
    const joint2quat = new THREE.Quaternion( // second joint quaternion
      jointData[1].orientationX,
      jointData[1].orientationY,
      jointData[1].orientationZ,
      jointData[1].orientationW,
    );

    const joint1pos = new THREE.Vector3( // first joint position
      jointData[0].cameraX,
      jointData[0].cameraY,
      jointData[0].cameraZ,
    );

    const joint2pos = new THREE.Vector3( // second joint position
      jointData[1].cameraX,
      jointData[1].cameraY,
      jointData[1].cameraZ,
    );

    switch (jointData[0].name) {
      default:
        translatedData.position.copy(joint1pos);
        break;
      // case 'RightToeBase':
      // case 'LeftToeBase':
      case 'Neck':
      translatedData.position.copy(joint2pos);
      break;
    }

    // const quat = new THREE.Quaternion(); // create one and reuse it
    // quat.setFromUnitVectors(joint1pos.normalize(), joint2pos.normalize());
    // const quatFlip = this.getOrient(jointData, quat);

    // console.log(jointData[0].name + ' - ' + jointData[1].name);
    // ['Head', 'Neck'],
    // ['Neck', 'SpineShoulder'],
    // ['SpineShoulder', 'SpineMid'],
    // ['SpineMid', 'SpineBase'],

    // ['SpineShoulder', 'ShoulderLeft'],
    // ['ShoulderLeft', 'ElbowLeft'],
    // ['ElbowLeft', 'WristLeft'],
    // ['WristLeft', 'HandLeft'],
    // ['HandLeft', 'HandTipLeft'],
    // ['WristLeft', 'ThumbLeft'],

    // ['SpineShoulder', 'ShoulderRight'],
    // ['ShoulderRight', 'ElbowRight'],
    // ['ElbowRight', 'WristRight'],
    // ['WristRight', 'HandRight'],
    // ['HandRight', 'HandTipRight'],
    // ['WristRight', 'ThumbRight'],
    
    // ['SpineBase', 'HipLeft'],
    // ['HipLeft', 'KneeLeft'],
    // ['KneeLeft', 'AnkleLeft'],
    // ['AnkleLeft', 'FootLeft'],

    // ['SpineBase', 'HipRight'],
    // ['HipRight', 'KneeRight'],
    // ['KneeRight', 'AnkleRight'],
    // ['AnkleRight', 'FootRight'],
    switch (jointData[1].name) {
      default:
        translatedData.quaternion.copy(joint2quat.clone());
        break;
      case 'ShoulderLeft':
      case 'SpineShoulder': // Neck, ShoulderLeft, ShoulderRight
      // case 'RightToeBase':
      // case 'LeftToeBase':
        translatedData.quaternion.copy(joint1quat.clone());
        break;
      // case 'RightToeBase':
      // case 'LeftToeBase':
      case 'Head':
        let jointRotation = new THREE.Quaternion();
        jointRotation.setFromUnitVectors(joint2pos.clone().normalize(), joint1pos.clone().normalize()); 
        translatedData.quaternion.copy(jointRotation.clone());
        break;
      // case 'LeftHandThumb3':
      // case 'RightHandThumb3':
      // case 'LeftHandIndex3':
      // case 'RightHandIndex3':
      // case 'RightToeBase':
      // case 'LeftToeBase':
        // translatedData.quaternion.copy(quatFlip.clone());
        // c.applyQuaternion(quatFlip);
        // let axis = joint1pos.clone().cross(joint2pos.clone());
        // let angle = joint1pos.angleTo(joint2pos.clone());
        // let matrix = new THREE.Matrix4();
        // matrix.makeRotationAxis(axis.clone(), angle);
        // translatedData.quaternion.copy(new THREE.Quaternion().setFromRotationMatrix(matrix.clone()));
        // c.applyMatrix(matrix.clone());
        // l.geometry.vertices[l.jointNames.indexOf(this.kinectronMixamoLookup(d.name))].copy(
        //   new THREE.Vector3(
        //     d.cameraX,
        //     d.cameraY,
        //     d.cameraZ,
        //   )
        // );
        // var quaternion = new THREE.Quaternion(); // create one and reuse it

        // quaternion.setFromUnitVectors(joint1pos.normalize(), joint2pos.normalize());
        // var matrix = new THREE.Matrix4();
        // matrix.makeRotationFromQuaternion(quaternion);

        // translatedData.matrix = matrix;
        // break;
    }

    // let v = new THREE.Euler();
		// v.setFromQuaternion(translatedData.quaternion.clone());

		// v.y += Math.PI; // Y is 180 degrees off
		// v.z *= -1; // flip Z

    // translatedData.quaternion = new THREE.Quaternion().setFromEuler(v);

    // let jointRotation = new THREE.Quaternion();
    // jointRotation.setFromUnitVectors(joint2pos.clone().normalize(), joint1pos.clone().normalize()); 
    // // translatedData.quaternion.copy(jointRotation.clone());

    // let v = new THREE.Euler();
		// v.setFromQuaternion(jointRotation.clone());

		// // v.y += Math.PI; // Y is 180 degrees off
		// v.z *= -1; // flip Z

    // translatedData.quaternion.copy(new THREE.Quaternion().setFromEuler(v));

    // convert Quaternion from Left-handed coordinate system to Right-handed
		// let q = new THREE.Quaternion(translatedData.quaternion.x, translatedData.quaternion.y, translatedData.quaternion.z, translatedData.quaternion.w);

		// let v = new THREE.Euler();
		// v.setFromQuaternion(q);

		// // v.y += Math.PI; // Y is 180 degrees off
		// // v.z *= -1; // flip Z

		// translatedData.quaternion.copy(new THREE.Quaternion().setFromEuler(v));
    
    return translatedData;
  }

  // inverseTransformDirection( dir, matrix ) {
  //   return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
  // }

  updateMeshGroup(meshes, kinectronData, prefix, bboxes) {
    _.each(meshes, (c) => {
      let jointData =_.filter(kinectronData, (d) => {
        if (c.jointNames == undefined) { return false; }
        return (c.jointNames.indexOf(d.name) !== -1);
      });
      if (jointData.length > 0) {
        // update bone length
        // c.geometry = this.createCubeGeo(c.jointNames[1], new THREE.Vector3(
        //   jointData[0].cameraX,
        //   jointData[0].cameraY,
        //   jointData[0].cameraZ,
        // ).distanceTo(new THREE.Vector3(
        //   jointData[1].cameraX,
        //   jointData[1].cameraY,
        //   jointData[1].cameraZ,
        // )));
        let translatedData = this.translateKinectron(jointData);
        
        c.position.copy(translatedData.position.clone());
        c.quaternion.copy(translatedData.quaternion.clone().multiply(c.srcQuat.clone()));
        c.jointData = jointData;
        // if (c.name.toLowerCase().indexOf('left') !== -1) {
        // } else if (c.name.toLowerCase().indexOf('right') !== -1) {
        // }
        let bbox = bboxes[c.name];
        if (bbox !== undefined) {
          bbox.position.copy(c.position.clone());          
          bbox.quaternion.copy(c.quaternion.clone());
          bbox.update();
        }
      }
    });
    // _.each(kinectronData, (d) => {
    //   let jointName = this.kinectronMeshGroupKeys[d.name];
    //   // console.log(jointName);
    //   if (jointName !== undefined) {
    //     let mesh = meshes[jointName];
    //     if (mesh !== undefined) {
    //       mesh.position.copy(
    //         new THREE.Vector3(
    //           d.cameraX,
    //           d.cameraY,
    //           d.cameraZ,
    //         )
    //       );
    //       mesh.quaternion.copy(
    //         new THREE.Quaternion(
    //           d.orientationX,
    //           d.orientationY,
    //           d.orientationZ,
    //           d.orientationW,
    //         )
    //       );

    //       let bbox = bboxes[jointName];
    //       if (bbox !== undefined) {
    //         bbox.position.copy(mesh.position.clone());          
    //         bbox.quaternion.copy(mesh.quaternion.clone());
    //         bbox.update();
    //       }
    //     }
    //   }
    // });
  }
  updateMixamoModel(boneList, kinectronData, prefix, cubeGroup) {
    // this.updateByCubeBones(boneList, kinectronData, prefix, cubeGroup);
    // this.updateByKinectronData(boneList, kinectronData, prefix, cubeGroup);

    // this.moveAvatar(boneList, kinectronData);
    this.transformBones(boneList, kinectronData, prefix, !this.mirroredMovement);

    // this.take3(boneList, kinectronData, prefix);
  }

  take3(boneList, data, prefix) {
    _.each(this.kinectPairs, (pair) => {
      let startPos = new THREE.Vector3(
        data[this.kinectKeys.indexOf(pair[0])].cameraX,
        data[this.kinectKeys.indexOf(pair[0])].cameraY,
        data[this.kinectKeys.indexOf(pair[0])].cameraZ,
      );
      let endPos = new THREE.Vector3(
        data[this.kinectKeys.indexOf(pair[1])].cameraX,
        data[this.kinectKeys.indexOf(pair[1])].cameraY,
        data[this.kinectKeys.indexOf(pair[1])].cameraZ,
      );

      let startQuat = new THREE.Quaternion(
        data[this.kinectKeys.indexOf(pair[0])].orientationX,
        data[this.kinectKeys.indexOf(pair[0])].orientationY,
        data[this.kinectKeys.indexOf(pair[0])].orientationZ,
        data[this.kinectKeys.indexOf(pair[0])].orientationW,
      );
      let endQuat = new THREE.Quaternion(
        data[this.kinectKeys.indexOf(pair[1])].orientationX,
        data[this.kinectKeys.indexOf(pair[1])].orientationY,
        data[this.kinectKeys.indexOf(pair[1])].orientationZ,
        data[this.kinectKeys.indexOf(pair[1])].orientationW,
      );

      const boneName = prefix + this.kinectronMixamoLookup(pair[0]);
      
      let bones = _.filter(boneList, ['name', boneName]);

      if (bones.length > 0) {
        let jointRotation = new THREE.Quaternion();
        jointRotation.setFromUnitVectors(startPos.clone().normalize(), endPos.clone().normalize()); 
        bones[0].quaternion.copy(jointRotation.clone());

        // let axis = startPos.cross(endPos.multiplyScalar(1.1));
        // let angle = startPos.angleTo(endPos.multiplyScalar(1.1));
        // let matrix = new THREE.Matrix4().makeRotationAxis(axis, angle);
        // bones[0].applyMatrix(matrix.clone());
        // let s = startPos.distanceTo(endPos);
        // bones[0].scale.set(s, s, s);
      }
    });
  }

  // Apply the rotations tracked by kinect to the joints.
	transformBones(boneList, kinectronData, prefix, flip) {
    // Transform boneTransform = bones[boneIndex];
    // if(boneTransform == null || kinectManager == null)
    //   return;
    
    // int iJoint = (int)joint;
    // if(iJoint < 0)
    //   return;
    
    for (let i = 0; i < kinectronData.length; i++) {
      // Get Kinect joint orientation
      // Quaternion jointRotation = kinectManager.GetJointOrientation(userId, iJoint, flip);
      // if(jointRotation == Quaternion.identity)
      //   return;
      
      let jointRotation = new THREE.Quaternion(
        kinectronData[i].orientationX,
        kinectronData[i].orientationY,
        kinectronData[i].orientationZ,
        kinectronData[i].orientationW,
      );

      const boneName = prefix + this.kinectronMixamoLookup(kinectronData[i].name);
      // if (boneName.toLowerCase().indexOf('right') !== -1) {
        jointRotation = Common.leftToRightHanded(jointRotation);
      // } 
      // else {
        // let v = new THREE.Euler();
        // v.setFromQuaternion(jointRotation);

        // v.y += Math.PI; // Y is 180 degrees off
        // // v.z *= -1; // flip Z
    
        // jointRotation = new THREE.Quaternion().setFromEuler(v);
      // }

      let bones = _.filter(boneList, ['name', boneName]);

      if (bones.length > 0) {
        if (boneName == 'mixamorigLeftShoulder') {
          let start = new THREE.Vector3(
            _.filter(kinectronData, ['name', 'SpineShoulder'])[0].cameraX,
            -_.filter(kinectronData, ['name', 'SpineShoulder'])[0].cameraY,
            _.filter(kinectronData, ['name', 'SpineShoulder'])[0].cameraZ,
          ).normalize();

          let end = new THREE.Vector3(
            _.filter(kinectronData, ['name', 'ShoulderLeft'])[0].cameraX,
            -_.filter(kinectronData, ['name', 'ShoulderLeft'])[0].cameraY,
            _.filter(kinectronData, ['name', 'ShoulderLeft'])[0].cameraZ,
          ).normalize();

          jointRotation.setFromUnitVectors(start, end);
        } 

        if (boneName == 'mixamorigRightShoulder') {
          let end = new THREE.Vector3(
            _.filter(kinectronData, ['name', 'SpineShoulder'])[0].cameraX,
            -_.filter(kinectronData, ['name', 'SpineShoulder'])[0].cameraY,
            _.filter(kinectronData, ['name', 'SpineShoulder'])[0].cameraZ,
          ).normalize();

          let start = new THREE.Vector3(
            _.filter(kinectronData, ['name', 'ShoulderRight'])[0].cameraX,
            -_.filter(kinectronData, ['name', 'ShoulderRight'])[0].cameraY,
            _.filter(kinectronData, ['name', 'ShoulderRight'])[0].cameraZ,
          ).normalize();

          jointRotation.setFromUnitVectors(start, end);
        } 

        // Smoothly transition to the new rotation
        jointRotation = this.kinect2AvatarRot(bones[0], jointRotation);
        jointRotation = this.getOrient(window.orient, jointRotation);

        bones[0].quaternion.copy(jointRotation.clone());
      }
    }
  }

  // transformSpecialBone()
	// {
	// 	// Vector3 jointDir = kinectManager.GetDirectionBetweenJoints(userId, (int)jointParent, (int)joint, false, true);
  //   // Quaternion jointRotation = jointDir != Vector3.zero ? Quaternion.FromToRotation(baseDir, jointDir) : Quaternion.identity;
    
		
  //   //		if(!flip)
  //   //		{
  //   //			Vector3 mirroredAngles = jointRotation.eulerAngles;
  //   //			mirroredAngles.y = -mirroredAngles.y;
  //   //			mirroredAngles.z = -mirroredAngles.z;
  //   //			
  //   //			jointRotation = Quaternion.Euler(mirroredAngles);
  //   //		}
		
	// 	if(jointRotation != Quaternion.identity)
	// 	{
	// 		// Smoothly transition to the new rotation
	// 		Quaternion newRotation = Kinect2AvatarRot(jointRotation, boneIndex);
			
	// 		if(smoothFactor != 0f)
	// 			boneTransform.rotation = Quaternion.Slerp(boneTransform.rotation, newRotation, smoothFactor * Time.deltaTime);
	// 		else
	// 			boneTransform.rotation = newRotation;
	// 	}
		
	// }

  // Converts kinect joint rotation to avatar joint rotation
  // depending on joint initial rotation and offset rotation
  kinect2AvatarRot(bone, jointRotation) {
    // Apply the new rotation.
    let newRotation = jointRotation.multiply(bone.srcQuaternion.clone());

    // If an offset node is specified, combine the transform with its
    // orientation to essentially make the skeleton relative to the node
		// if (this.offsetNode != null)
		// {
		// 	// Grab the total rotation by adding the Euler and offset's Euler.
		// 	let totalRotation = newRotation.eulerAngles + offsetNode.transform.rotation.eulerAngles;
		// 	// Grab our new rotation.
		// 	newRotation = Quaternion.Euler(totalRotation);
		// }
    
    if (bone.parent !== undefined) {
      if (bone.parent.srcQuaternion) {
        // Grab the total rotation by adding the Euler and offset's Euler.
        // let totalRotation = newRotation.eulerAngles + offsetNode.transform.rotation.eulerAngles;
        // Grab our new rotation.
        newRotation = newRotation.clone().multiply(bone.parent.quaternion.clone().inverse());
      }
    }

    return newRotation;
  }

  moveAvatar(boneList, kinectronData) {
    this.trans = new THREE.Vector3(
      _.filter(kinectronData, ['name', 'SpineBase'])[0].cameraX,
      _.filter(kinectronData, ['name', 'SpineBase'])[0].cameraY,
      _.filter(kinectronData, ['name', 'SpineBase'])[0].cameraZ,
    );

    //     // Get the position of the body and store it.
		// this.trans = new THREE.Vector3();//kinectManager.GetUserPosition(UserID);
		
		// If this is the first time we're moving the avatar, set the offset. Otherwise ignore it.
		if (!this.offsetCalibrated) {
			this.offsetCalibrated = true;
			
			this.xOffset = !this.mirroredMovement ? this.trans.x * this.moveRate : -this.trans.x * this.moveRate;
			this.yOffset = this.trans.y * this.moveRate;
			this.zOffset = -this.trans.z * this.moveRate;
			
			// if(this.offsetRelativeToSensor)
			// {
			// 	this.cameraPos = window.camera.position.clone(); //new THREE.Vector3();//Camera.main.transform.position;
				
			// 	this.yRelToAvatar = (this.offsetNode !== null ? this.offsetNode.transform.position.y : this.transform.position.y) - this.cameraPos.y;
			// 	this.relativePos = new THREE.Vector3(this.trans.x * this.moveRate, this.yRelToAvatar, this.trans.z * this.moveRate);
			// 	this.offsetPos = this.cameraPos + this.relativePos;
				
			// 	if(this.offsetNode !== null)
			// 	{
			// 		this.offsetNode.transform.position = this.offsetPos;
			// 	}
			// 	else
			// 	{
			// 		this.transform.position = this.offsetPos;
			// 	}
			// }
		}
	
		// Smoothly transition to the new position
		this.targetPos = this.kinect2AvatarPos(this.trans, this.verticalMovement);
    // debugger;
		// if(this.smoothFactor) {
		// 	this.bodyRoot.localPosition = new THREE.Vector3().Lerp(this.bodyRoot.localPosition, this.targetPos, this.smoothFactor * this.Time.deltaTime);
    // } else {
    //   this.bodyRoot.localPosition = this.targetPos;
    // }
    _.filter(boneList, ['name', 'mixamorigHips'])[0].position.copy(
      this.targetPos.clone()
    );
  }
  
  // Converts Kinect position to avatar skeleton position, depending on initial position, mirroring and move rate
	kinect2AvatarPos(jointPosition, bMoveVertically) {
		let xPos =  0;
		let yPos = 0;
		let zPos = 0;
		// debugger;
		// If movement is mirrored, reverse it.
		if(!this.mirroredMovement) {
			xPos = jointPosition.x * this.moveRate - this.xOffset;
    } else {
			xPos = -jointPosition.x * this.moveRate - this.xOffset;
    }

		yPos = jointPosition.y * this.moveRate - this.yOffset;
		zPos = -jointPosition.z * this.moveRate - this.zOffset;
		
		// If we are tracking vertical movement, update the y. Otherwise leave it alone.
		let avatarJointPos = new THREE.Vector3(xPos, bMoveVertically ? yPos : 0, zPos);
		
		return avatarJointPos;
	}

  updateByCubeBones(boneList, kinectronData, prefix, cubeGroup) {
    _.each(cubeGroup.children, (c) => {
      let bones =_.filter(boneList, (b) => {
        const jointName = prefix + this.kinectronMixamoLookup(c.name).toLowerCase();
        // console.log(jointName + ' == ' + b.name.toLowerCase());
        return (prefix + c.jointNames[1].toLowerCase() == b.name.toLowerCase());
      });
      if (bones.length > 0) {
        // console.log(bones[0].name);
        c.updateMatrix();
        // let qq = new THREE.Quaternion();
        // let quat = bones[0].getWorldQuaternion(qq);
        switch (c.name.toLowerCase()) {
          case 'mixamorigleftshoulder':
          case 'mixamorigrightshoulder':
            // quat.multiply(c.getWorldQuaternion(qq).inverse());
            // // bones[0].rotation.order = 'YZX';
            
            // if (jointName.indexOf('left') !== -1) {
            //   bones[0].rotation.x -= Math.PI;
            // } else if (jointName.indexOf('right') !== -1) {
            //   bones[0].rotation.x += Math.PI;
            // }
            
            break;
          case 'mixamorigleftupleg':
          case 'mixamorigrightupleg':
          default:
            // quat.multiply(c.getWorldQuaternion(qq).inverse());
            

            // bones[0].quaternion.copy(c.quaternion.clone());
            // bones[0].position.copy(c.position.clone());
            // bones[0].rotation.order = 'YXZ';
            // bones[0].matrix.copy(c.matrix.clone());
            // console.log(bones[0]);
            break;
        }
        // bones[0].quaternion.copy(quat.clone());
      }
    });
    if (_.size(boneList) > 0) {
      // console.log(_.filter(boneList, ['name', 'mixamorigHips'])[0]);
      _.filter(boneList, ['name', 'mixamorigHips'])[0].parent.position.copy(
        new THREE.Vector3(
          _.filter(kinectronData, ['name', 'SpineBase'])[0].cameraX,
          _.filter(kinectronData, ['name', 'SpineBase'])[0].cameraY,
          _.filter(kinectronData, ['name', 'SpineBase'])[0].cameraZ,
        )
      );
      _.filter(boneList, ['name', 'mixamorigHips'])[0].parent.rotation.y = Math.PI;
    }
  }

  updateByKinectronData(boneList, kinectronData, prefix, cubeGroup) {
    if (_.size(boneList) > 0) {
      for (let i = 0; i < kinectronData.length; i++) {
        const jointName = prefix + this.kinectronMixamoLookup(kinectronData[i].name).toLowerCase();
        // console.log(jointName);
        let pos = new THREE.Vector3(
          _.filter(kinectronData, ['name', kinectronData[i].name])[0].cameraX,
          _.filter(kinectronData, ['name', kinectronData[i].name])[0].cameraY,
          _.filter(kinectronData, ['name', kinectronData[i].name])[0].cameraZ,
        );
        let quat = this.getOrient(window.orient, new THREE.Quaternion(
          _.filter(kinectronData, ['name', kinectronData[i].name])[0].orientationX,
          _.filter(kinectronData, ['name', kinectronData[i].name])[0].orientationY,
          _.filter(kinectronData, ['name', kinectronData[i].name])[0].orientationZ,
          _.filter(kinectronData, ['name', kinectronData[i].name])[0].orientationW,
        ));
        let bones;
        switch (kinectronData[i].name) {
          default:
            bones = _.filter(boneList, (b) => { return b.name.toLowerCase() == jointName; });
            if (bones.length > 0) {
              bones[0].position.copy(
                pos.clone()
              );
              bones[0].quaternion.copy(
                quat.clone()
              );
            }
            break;
          case 'SpineBase':
            bones = _.filter(boneList, ['name', 'mixamorigHips']);
            if (bones.length > 0) {
              bones[0].parent.position.copy(
                pos.clone()
              );
            }

            bones = _.filter(boneList, ['name', 'mixamorigSpine']);
            if (bones.length > 0) {
              bones[0].position.copy(
                pos.clone()
              );
            
              bones[0].quaternion.copy(
                quat.clone()
              );
            }
            break;
        }
      }
    }
  }

  getDirection(obj) {
    var e = obj.matrixWorld.elements;
		return new THREE.Vector3(e[8], e[9], e[10]).normalize();
  }

  getOrient(orient, quat) {
    let o = _.map(orient, (o) =>{
      switch(o) {
        default:
        case 'x':
          return quat.x;
          break;
        case 'y':
          return quat.y;
          break;
        case 'z':
          return quat.z;
          break;
        case 'w':
          return quat.w;
          break;
        case 0:
          return 0;
          break;
      }
    });
    return new THREE.Quaternion( // second joint quaternion
      o[0],
      o[1],
      o[2],
      o[3],
    );
  }

  buildKinectronSkeleton(data, cb) {
    let bones = _.map(this.kinectPairs, (pair) => {
      return this.createBoneFromLine(
        [new THREE.Vector3(
          data[this.kinectKeys.indexOf(pair[0])].cameraX,
          data[this.kinectKeys.indexOf(pair[0])].cameraY,
          data[this.kinectKeys.indexOf(pair[0])].cameraZ,
        ),
        new THREE.Vector3(
          data[this.kinectKeys.indexOf(pair[1])].cameraX,
          data[this.kinectKeys.indexOf(pair[1])].cameraY,
          data[this.kinectKeys.indexOf(pair[1])].cameraZ,
        )],
        [new THREE.Quaternion(
          data[this.kinectKeys.indexOf(pair[0])].orientationX,
          data[this.kinectKeys.indexOf(pair[0])].orientationY,
          data[this.kinectKeys.indexOf(pair[0])].orientationZ,
          data[this.kinectKeys.indexOf(pair[0])].orientationW,
        ),
        new THREE.Quaternion(
          data[this.kinectKeys.indexOf(pair[1])].orientationX,
          data[this.kinectKeys.indexOf(pair[1])].orientationY,
          data[this.kinectKeys.indexOf(pair[1])].orientationZ,
          data[this.kinectKeys.indexOf(pair[1])].orientationW,
        )],
        pair[0]
      )
    });
    let hips = new THREE.Bone();
    hips.name = 'Hips';
    bones.unshift(hips)
    // bones = this.createBVHStruct(bones);
    cb(new THREE.Skeleton(bones));
  }

  createBVHStruct(bones) {
    // hips: rightupleg: rightleg: rightfoot
    // hips: leftupleg: leftleg: leftfoot
    
    // hips: spine: spine1: spine2: spine3: neck: head:
    
    // hips: spine: spine1: spine2: spine3: rightshoulder: rightarm: rightforearm: righthand: righthandthumb1: righthandthumb2: righthandthumb3:
    // hips: spine: spine1: spine2: spine3: rightshoulder: rightarm: rightforearm: righthand: rightinhandindex: righthandindex1: righthandindex2: righthandindex3:
    // hips: spine: spine1: spine2: spine3: rightshoulder: rightarm: rightforearm: righthand: rightinhandmiddle: righthandmiddle1: righthandmiddle2: righthandmiddle3:
    // hips: spine: spine1: spine2: spine3: rightshoulder: rightarm: rightforearm: righthand: rightinhandring: righthandring1: righthandring2: righthandring3:
    // hips: spine: spine1: spine2: spine3: rightshoulder: rightarm: rightforearm: righthand: rightinhandpinky: righthandpinky1: righthandpinky2: righthandpinky3:

    // hips: spine: spine1: spine2: spine3: leftshoulder: leftarm: leftforearm: lefthand: lefthandthumb1: lefthandthumb2: lefthandthumb3:
    // hips: spine: spine1: spine2: spine3: leftshoulder: leftarm: leftforearm: lefthand: leftinhandindex: lefthandindex1: lefthandindex2: lefthandindex3:
    // hips: spine: spine1: spine2: spine3: leftshoulder: leftarm: leftforearm: lefthand: leftinhandmiddle: lefthandmiddle1: lefthandmiddle2: lefthandmiddle3:
    // hips: spine: spine1: spine2: spine3: leftshoulder: leftarm: leftforearm: lefthand: leftinhandring: lefthandring1: lefthandring2: lefthandring3:
    // hips: spine: spine1: spine2: spine3: leftshoulder: leftarm: leftforearm: lefthand: leftinhandpinky: lefthandpinky1: lefthandpinky2: lefthandpinky3:

    //   ['Head', 'Neck'],
    //   ['Neck', 'SpineShoulder'],
    //   ['SpineShoulder', 'SpineMid'],
    //   ['SpineMid', 'SpineBase'],

    //   ['SpineShoulder', 'ShoulderLeft'],
    //   ['ShoulderLeft', 'ElbowLeft'],
    //   ['ElbowLeft', 'WristLeft'],
    //   ['WristLeft', 'HandLeft'],
    //   ['HandLeft', 'HandTipLeft'],
    //   ['HandLeft', 'ThumbLeft'],

    //   ['SpineShoulder', 'ShoulderRight'],
    //   ['ShoulderRight', 'ElbowRight'],
    //   ['ElbowRight', 'WristRight'],
    //   ['WristRight', 'HandRight'],
    //   ['HandRight', 'HandTipRight'],
    //   ['HandRight', 'ThumbRight'],
      
    //   ['SpineBase', 'HipLeft'],
    //   ['HipLeft', 'KneeLeft'],
    //   ['KneeLeft', 'AnkleLeft'],
    //   ['AnkleLeft', 'FootLeft'],

    //   ['SpineBase', 'HipRight'],
    //   ['HipRight', 'KneeRight'],
    //   ['KneeRight', 'AnkleRight'],
    //   ['AnkleRight', 'FootRight'],

    let hips = _.filter(bones, ['name', 'Hips'])[0];

    let rightupleg = _.filter(bones, ['name', 'HipRight'])[0];
    let rightleg = _.filter(bones, ['name', 'KneeRight'])[0];
    let rightfoot = _.filter(bones, ['name', 'AnkleRight'])[0];


    let leftupleg = _.filter(bones, ['name', 'HipLeft'])[0];
    let leftleg = _.filter(bones, ['name', 'KneeLeft'])[0];
    let leftfoot = _.filter(bones, ['name', 'AnkleLeft'])[0];

    let head = _.filter(bones, ['name', 'Head'])[0];
    let neck = _.filter(bones, ['name', 'Neck'])[0];
    let spine3 = _.filter(bones, ['name', 'SpineShoulder'])[0];
    let spine2 = _.filter(bones, ['name', 'SpineMid'])[0];
    let spine1 = _.filter(bones, ['name', 'SpineBase'])[0];
    // let spine = _.filter(bones, ['name', 'Spine'])[0];
    
    
    neck.add(head);
    spine3.add(neck);
    spine2.add(spine3);
    spine1.add(spine2);
    // spine.add(spine1);
    hips.add(spine1);

    rightleg.add(rightfoot);
    rightupleg.add(rightleg);
    hips.add(rightupleg);

    leftleg.add(leftfoot);
    leftupleg.add(leftleg);
    hips.add(leftupleg);
    
    return bones;
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

  updateBVHSkeleton(bones, joints) {
    if (!this.parentRotation) this.parentRotation = new THREE.Quaternion();
    _.each(this.kinectPairs, (pair) => {
      let startPos = new THREE.Vector3(
        joints[this.kinectKeys.indexOf(pair[0])].cameraX,
        joints[this.kinectKeys.indexOf(pair[0])].cameraY,
        joints[this.kinectKeys.indexOf(pair[0])].cameraZ,
      );
      let endPos = new THREE.Vector3(
        joints[this.kinectKeys.indexOf(pair[1])].cameraX,
        joints[this.kinectKeys.indexOf(pair[1])].cameraY,
        joints[this.kinectKeys.indexOf(pair[1])].cameraZ,
      );      
    });
  }
}

module.exports = SkeletalTranslator;
