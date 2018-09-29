/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-09-11 11:20:59
 * @modify date 2018-09-11 11:20:59
 * @desc [description]
*/

// import Peer from 'peerjs';
// import Kinectron from './../../libs/kinectron.bundle';

import SkeletalTranslator from '../../performers/SkeletalTranslator';

import config from './../../config';

class KinectronInput {
  constructor() {
    this.callbacks = {};
    this.events = [];
    this.labels = [];
    
    this.savedData = require('./Kinectron-Data.js');

    this.skeletalTranslator = new SkeletalTranslator();

    this.kinectron = null;
    this.initializeKinectron();

    window.playbackData = this.playbackData.bind(this);
  }

  initializeKinectron() {
    this.kinectron = new Kinectron(config.kinectron.ip);
    this.kinectron.makeConnection();
    this.kinectron.startBodies((bodies) => {
      _.each(_.filter(bodies.bodies, 'tracked'), (body) => {        
        this.callbacks['body']('Kinectron_User_' + body.trackingId, this.zipWithNames(body.joints), 'kinectron');
        // this.saveData('Kinectron_User_' + body.trackingId, this.zipWithNames(body.joints), 'kinectron');
      });
    });
  }

  zipWithNames(joints) {
    return _.zipWith(joints, this.skeletalTranslator.kinectKeys, (j, n) => {
      if (j !== 'floorClipPlane' && j !== 0) {
        j.name = n;
      }
      return j;
    });
  }

  saveData(i, d, t, l, a) {
    this.savedData.push({
      id: i,
      data: d,
      type: t,
      leader: l,
      actions: a,
    });
    console.log(this.savedData);
  }

  playbackData() {
    // console.log("hello", this.savedData);
    _.each(this.savedData, (d, idx) => {
      // console.log("hello", d);
      // let d = this.savedData[0];
      // console.log("hello", d);  
      setTimeout(() => {
        this.callbacks['body'](
          d['id'],
          d['data'],
          d['type'],
          null,
          {
            play: () => {},
            pause: () => {},
            stop: () => {},
            loop: () => {},
            noLoop: () => {},
            playing: false,
            looping: false,
          }
        );
      }, idx * 250);
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

module.exports = KinectronInput;
