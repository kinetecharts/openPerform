import _ from 'lodash';
import TWEEN from 'tween';

import config from './../../config';

class MidiStream {
  constructor(parent, color, guiFolder) {
    this.name = 'midiStream';
    this.parent = parent;
    this.color = color;
    this.guiFolder = guiFolder;
    this.performer = null;

    // this.addToDatGui(this.guiFolder);
  }

  update(data) {
    this.performer = data;
  }
}

module.exports = MidiStream;
