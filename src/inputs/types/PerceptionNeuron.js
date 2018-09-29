// Creates websocket, this.callbacks["message"](bones); should call the updateFromPN in Performer.js
const _ = require('lodash').mixin(require('lodash-keyarrange'));

import SkeletalTranslator from '../../performers/SkeletalTranslator';
import Common from './../../util/Common';
import Logger from './../../util/Logger';

class PerceptionNeuron {
  constructor(url) {
    this.callbacks = {};
    this.events = [];
    this.labels = [];

    this.skeletalTranslator = new SkeletalTranslator();
    this.logger = new Logger();

    this.websocket = null;
    this.initializeWebSocket(url);
  }

  initializeWebSocket(url) {
    console.log('Perception Neuron connecting to: ', url);

    this.websocket = new WebSocket(url);
    this.websocket.onopen = this.logger.onOpen.bind(this, this.constructor.name);
    this.websocket.onclose = this.logger.onClose.bind(this, this.constructor.name);
    this.websocket.onmessage = this.onMessage.bind(this);
    this.websocket.onerror = this.logger.onError.bind(this, this.constructor.name);
  }

  onMessage(msg) {
    // build consistent list of bone names
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

    this.boneNames = Common.getKeys(bvhStructure, ''); // compile to array
    
    const datas = JSON.parse(msg.data); // parse each perfomrer stream
    _.each(datas, (data, key) => { //loop through performers
      var data = data.split(' '); // list of float values, total of 59. Each position x, y, x followed by euler x, y, x
      const bones = [];

      bones.push(this.skeletalTranslator.parsePNFrameData(data.slice(0, 6), this.boneNames[0])); // hips position

      let idx = 1;
      for (let i = idx * 6; i < data.length; i += 6) { // loop the rest of the bones
        bones.push(this.skeletalTranslator.parsePNFrameData(data.slice(i, i + 6), this.boneNames[idx]));
        idx++;
      }

      this.callbacks.message('Neuron_User_' + key, bones, 'perceptionNeuron');
    });
  }

  on(name, cb, event, label) {
    this.callbacks[name] = cb;
    this.events.push(event);
    this.labels.push(label);
    this.initCallbacks();
  }

  clearCallbacks() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];
  }

  initCallbacks() {
    // _.forEach(this.callbacks, this.initCallback.bind(this));
  }
}

module.exports = PerceptionNeuron;
