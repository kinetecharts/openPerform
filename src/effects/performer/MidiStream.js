import _ from 'lodash';
import TWEEN from 'tween';

import config from './../../config';

import Common from './../../util/Common'

class MidiStream {
  constructor(parent, color, guiFolder) {
    this.name = 'midiStream';
    this.parent = parent;
    this.color = color;
    this.guiFolder = guiFolder;
    this.performer = null;

    // this.addToDatGui(this.guiFolder);
    this.handDistanceRange = [0, 2.46];
    this.handMidiDistance = 0;

    this.headYPos = 0;


    // this.on = setInterval(() => {
    //   if (this.performer !== null) {
    //     clearInterval(this.off);
    //     // this.performer.outputManager.outputs.midicontroller.sendTest();
    //     // this.performer.outputManager.outputs.midicontroller.sendMidiNoteOff(60, this.handMidiVelocity);
    //     this.performer.outputManager.outputs.midicontroller.sendMidiNoteOn(60, this.handMidiDistance);
    //     // this.performer.outputManager.outputs.midicontroller.sendTest();
    //     this.off = setInterval(() => {
    //       this.performer.outputManager.outputs.midicontroller.sendMidiNoteOff(60, this.handMidiDistance);
    //     }, 500);
    //   }
    // }, 1000);
  }

  update(data) {
    this.performer = data;

    data.traverse((d) => {
      if ('robot_head' == d.name.toLowerCase()) {
        this.headYPos = Common.mapRange(d.position.y, 0, 16, 1, 60);
      }
    });
        
    // console.log(this.headYRange);

    this.handMidiDistance = Common.mapRange(this.performer.distances['hands'], this.handDistanceRange[0], this.handDistanceRange[1], 0, 127);

    setTimeout( () => {
      // clearInterval(this.off);
        // this.performer.outputManager.outputs.midicontroller.sendTest();
        // this.performer.outputManager.outputs.midicontroller.sendMidiNoteOff(60, this.handMidiVelocity);
        this.performer.outputManager.outputs.midicontroller.sendMidiNoteOn(this.handMidiDistance, this.handMidiDistance);
        // this.performer.outputManager.outputs.midicontroller.sendTest();
        setTimeout(() => {
          this.performer.outputManager.outputs.midicontroller.sendMidiNoteOff(this.handMidiDistance, this.handMidiDistance);
        },  500 / this.headYPos);
    }, 1000 / this.headYPos );
  }
}

module.exports = MidiStream;
