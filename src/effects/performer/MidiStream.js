import _ from 'lodash';
import TWEEN from 'tween';

import config from './../../config';

import Common from './../../util/Common'

class MidiStream {
  constructor(effectId, parent, color, guiFolder) {
    this.id = effectId;
    this.name = 'midiStream';
    this.parent = parent;
    this.color = color;
    this.guiFolder = guiFolder;
    this.performer = null;

    // this.addToDatGui(this.guiFolder);
    this.handDistanceRange = [1000, -1000];
    this.handDistance = 1000;

    this.headYPos = 0;
    
    this.streamData = false;
    this.streamInterval = null;
  }

  update(performer, currentPose, distances) {
    this.performer = performer;
    // if (distances.hands < this.handDistanceRange[0]) {
    //   this.handDistanceRange[0] = distances.hands;
    // }
    // if (distances.hands > this.handDistanceRange[1]) {
    //   this.handDistanceRange[1] = distances.hands;
    // }
    
    // if (distances.hands < this.handDistance) {
    if (this.streamInterval == null) {
      this.streamInterval = setTimeout(() => {
        this.performer.outputManager.outputs.midicontroller.sendMidiNoteOn(60, 127);
        setTimeout(() => {
          this.performer.outputManager.outputs.midicontroller.sendMidiNoteOff(60, 127);
          this.handDistance = 1000;
          clearInterval(this.streamInterval);
          this.streamInterval = null;
        }, Common.mapRange(
          distances.hands,
          this.handDistanceRange[0],
          this.handDistanceRange[1],
          250,
          1000,
        ) / 4);
      }, Common.mapRange(
        distances.hands,
        this.handDistanceRange[0],
        this.handDistanceRange[1],
        250,
        1000,
      ));
    }
    // }
  }
}

module.exports = MidiStream;
