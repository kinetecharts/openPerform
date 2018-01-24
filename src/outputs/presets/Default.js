import Common from './../../util/Common';
import Config from './../../config';

class DefaultPreset {
  constructor(outputManager, main, scene) {
    this.outputManager = outputManager;
    this.main = main;
    this.scene = scene;
  }

  initCallbacks(type) {
    switch (type.toLowerCase()) {
      default:
        console.log(type.toLowerCase() + ' output not found for this preset');
        break;
      case 'midicontroller':
        this.initMidiControllerCallbacks();
        break;
    }
  }

  initMidiControllerCallbacks() {
    this.outputManager.registerCallback('midiController', 'devicesConnected', 'Midi Controller', this.main.updateMidiOutputs.bind(this.main));
  }
}

module.exports = DefaultPreset;
