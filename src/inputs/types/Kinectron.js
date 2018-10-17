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
    this.nextFrameTimeouts = {};
    
    this.savedData = require('./Kinectron-Data.js');

    this.skeletalTranslator = new SkeletalTranslator();

    this.kinectron = null;
    this.initializeKinectron();

    window.playbackData = this.playbackData.bind(this);
    window.stopAllPlayback = this.stopAllPlayback.bind(this);
    window.stopPlayback = this.stopPlayback.bind(this);
  }

  initializeKinectron() {
    this.kinectron = new Kinectron(config.kinectron.ip);
    this.kinectron.makeConnection();
    this.kinectron.startBodies((bodies) => {
      _.each(this.validateBodies(bodies.bodies), (body) => {        
        // body.joints.unshift({
        //   'depthX':0,
        //   'depthY':0,
        //   'colorX':0,
        //   'colorY':0,
        //   'cameraX':0,
        //   'cameraY':0,
        //   'cameraZ':0,
        //   'orientationX':0,
        //   'orientationY':0,
        //   'orientationZ':0,
        //   'orientationW':0,
        // });
        this.callbacks['body']('Kinectron_User_' + body.trackingId, this.zipWithNames(body.joints), 'kinectron');
        this.callbacks['body']('Kinectron_User_' + body.trackingId + '_1', this.zipWithNames(body.joints), 'kinectron');
        this.callbacks['body']('Kinectron_User_' + body.trackingId + '_2', this.zipWithNames(body.joints), 'kinectron');
        
        
        // this.saveData('Kinectron_User_' + body.trackingId, this.zipWithNames(body.joints), 'kinectron');
      });
    });
  }

  validateBodies(bodies) {
    const performerLimit = 3;
    return _.filter(bodies, 'tracked').slice(0, performerLimit);
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

  stopAllPlayback() {
    _.each(this.nextFrameTimeouts, (nextFrameTimeout) => {
      if (nextFrameTimeout) { clearTimeout(nextFrameTimeout); nextFrameTimeout = null; }
    });
  }

  stopPlayback(id) {
    if (this.nextFrameTimeouts[id]) { clearTimeout(this.nextFrameTimeouts[id]); this.nextFrameTimeouts[id] = null; }
  }

  playbackData(ids) {
    _.each(ids, (id) => {
      this.playNextFrame(_.cloneDeep(this.savedData), id);
    });
  }

  playNextFrame(data, id) {
    if (this.nextFrameTimeouts[id]) { clearTimeout(this.nextFrameTimeouts[id]); this.nextFrameTimeouts[id] = null; }
    if (data.length > 0) {
      let d = data.shift(); 
      d['id'] = id;
      this.callbacks['body'](d['id'], d['data'], d['type'], null, { play: () => {}, pause: () => {}, stop: () => {}, loop: () => {}, noLoop: () => {}, playing: false, looping: false});
      this.callbacks['body'](d['id']+"_1", d['data'], d['type'], null, { play: () => {}, pause: () => {}, stop: () => {}, loop: () => {}, noLoop: () => {}, playing: false, looping: false});
      this.callbacks['body'](d['id']+"_2", d['data'], d['type'], null, { play: () => {}, pause: () => {}, stop: () => {}, loop: () => {}, noLoop: () => {}, playing: false, looping: false});
      this.nextFrameTimeouts[id] = setTimeout(this.playNextFrame.bind(this, data, id), 1000/10);
    } else {
      this.nextFrameTimeouts[id] = setTimeout(this.playNextFrame.bind(this, _.cloneDeep(this.savedData), id), 1);
    }
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
