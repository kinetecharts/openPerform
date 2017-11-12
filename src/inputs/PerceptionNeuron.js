// Creates websocket, this.callbacks["message"](bones); should call the updateFromPN in Performer.js
const _ = require('lodash').mixin(require('lodash-keyarrange'));

import Common from './../util/Common';

class PerceptionNeuron {
  constructor(url) {
    this.callbacks = {};

    this.websocket = null;
    this.initializeWebSocket(url);
  }

  initializeWebSocket(url) {
    console.log('Perception Neuron connecting to: ', url);

    this.websocket = new WebSocket(url);
    this.websocket.onopen = this.onOpen.bind(this);
    this.websocket.onclose = this.onClose.bind(this);
    this.websocket.onmessage = this.onMessage.bind(this);
    this.websocket.onerror = this.onError.bind(this);
  }

  onOpen(evt) {
    console.log('Perception Neuron connected:', evt);
  }

  onClose(evt) {
    console.log('Perception Neuron  disconnected:', evt);
  }

  onMessage(msg) {
    const bvhStructure = {
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

    this.boneNames = Common.getKeys(bvhStructure, '');
    // this.boneNames = _.shuffle(this.boneNames);

    const datas = JSON.parse(msg.data);
    _.each(datas, (data, key) => {
      var data = data.split(' ');
      const bones = [];

      bones.push(this.parseFrameData(data.slice(0, 6), this.boneNames[0]));

      let idx = 1;
      for (let i = idx * 6; i < data.length; i += 6) {
        bones.push(this.parseFrameData(data.slice(i, i + 6), this.boneNames[idx]));
        idx++;
      }

      this.callbacks.message(`PN_User_${key}`, bones, 'perceptionNeuron');
      // bones[0].position.x += 100;
      // this.callbacks["message"]('PN_User_2', bones, 'perceptionNeuron');
      // bones[0].position.x += 100;
      // this.callbacks["message"]('PN_User_2', bones, 'perceptionNeuron');
    });
  }

  onError(evt) {
    console.log('Perception Neuron  error:', evt);
  }

  on(name, cb) {
    this.callbacks[name] = cb;
  }

  parseFrameData(data, name) {
    const keyframe = {
      name,
      position: { x: 0, y: 1, z: 2 },
      quaternion: new THREE.Quaternion(),
      rotation: new THREE.Euler(data[3], data[4], data[5], 'XYZ'),
    };

    const quat = new THREE.Quaternion();

    const vx = new THREE.Vector3(1, 0, 0);
    const vy = new THREE.Vector3(0, 1, 0);
    const vz = new THREE.Vector3(0, 0, 1);

    // parse values for each channel in node

    keyframe.position.x = parseFloat(data[0]);
    keyframe.position.y = parseFloat(data[1]);
    keyframe.position.z = parseFloat(data[2]);

    quat.setFromAxisAngle(vy, parseFloat(data[3]) * Math.PI / 180);
    keyframe.quaternion.multiply(quat);

    quat.setFromAxisAngle(vx, parseFloat(data[4]) * Math.PI / 180);
    keyframe.quaternion.multiply(quat);

    quat.setFromAxisAngle(vz, parseFloat(data[5]) * Math.PI / 180);
    keyframe.quaternion.multiply(quat);

    return keyframe;
  }
}

module.exports = PerceptionNeuron;
