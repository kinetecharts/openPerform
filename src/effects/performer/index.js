

import Ribbons from './Ribbons';
import ParticleSystem from './ParticleSystem';
import Vogue from './Vogue';
import MovementSculpture from './MovementSculpture';
import Ghosting from './Ghosting';
import Drawing from './Drawing';
import DataTags from './DataTags';
import MidiStream from './MidiStream';

import config from './../../config';

class PerformerEffects {
  constructor(parent, color) {
    this.parent = parent;
    this.effects = [];
    this.color = color;
  }

  add(effect) {
    if (_.filter(this.effects, eff => eff.name == effect).length > 0) {
      console.log('Effect is already loaded...');
      return false;
    }
    switch (effect) {
      case 'Ghosting':
        this.effects.push(new Ghosting(effect, this.parent, this.color));
        break;
      case 'Vogue':
        this.effects.push(new Vogue(effect, this.parent, this.color));
        break;
       case 'Movement Sculpture':
        this.effects.push(new MovementSculpture(effect, this.parent, this.color));
        break;
      case 'Particles':
        this.effects.push(new ParticleSystem(effect, this.parent, this.color));
        break;
      case 'Ribbons':
        this.effects.push(new Ribbons(effect, this.parent, this.color));
        break;
      case 'Drawing':
        this.effects.push(new Drawing(effect, this.parent, this.color));
        break;
      case 'Data Tags':
        this.effects.push(new DataTags(effect, this.parent, this.color));
        break;
      case 'Midi Stream':
        this.effects.push(new MidiStream(effect, this.parent, this.color));
        break;
    }
    console.log(this.effects);
  }

  remove(effect) {
    const matches = _.filter(this.effects, eff => eff.name == effect);
    if (matches.length > 0) {
      this.effects[0].remove();
      _.remove(this.effects, eff => eff.name == effect);
    }
  }

  removeAll() {
    _.each(this.effects, (effect) => {
      effect.remove();
      _.remove(this.effects, eff => eff.name == effect);
    });
    this.effects = [];
  }

  updateParameters(data) {
    _.each(this.effects, (effects) => {
      effects.updateParameters(data);
    });
  }

  update(data, currentPose, distances) {
    _.each(this.effects, (effect) => {
      effect.update(data, currentPose, distances);
    });
  }
}

module.exports = PerformerEffects;
