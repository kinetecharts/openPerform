import _ from 'lodash';

import Trails from './Trails';
import ParticleSystem from './ParticleSystem';
import Vogue from './Vogue';
import Constructor from './Constructor';
import Cloner from './Cloner';
import Drawing from './Drawing';
import DataTags from './DataTags';

import config from './../../config';

class PerformerEffects {
  constructor(parent, color, guiFolder) {
    this.parent = parent;
    this.effects = [];
    this.color = color;
    this.guiFolder = guiFolder;
  }

  add(effect) {
    if (_.filter(this.effects, eff => eff.name == effect).length > 0) {
      console.log('Effect is already loaded...');
      return false;
    }
    switch (effect) {
      case 'cloner':
        this.effects.push(new Cloner(this.parent, this.color, this.guiFolder));
        break;
      case 'vogue':
        this.effects.push(new Vogue(this.parent, this.color, this.guiFolder));
        break;
       case 'constructor':
        this.effects.push(new Constructor(this.parent, this.color, this.guiFolder));
        break;
      case 'particleSystem':
        this.effects.push(new ParticleSystem(this.parent, this.color, this.guiFolder));
        break;
      case 'trails':
        this.effects.push(new Trails(this.parent, this.color, this.guiFolder));
        break;
      case 'drawing':
        this.effects.push(new Drawing(this.parent, this.color, this.guiFolder));
        break;
      case 'datatags':
        this.effects.push(new DataTags(this.parent, this.color, this.guiFolder));
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

  updateParameters(data) {
    _.each(this.effects, (effects) => {
      effects.updateParameters(data);
    });
  }

  update(data) {
    _.each(this.effects, (effect) => {
      effect.update(data);
    });
  }
}

module.exports = PerformerEffects;
