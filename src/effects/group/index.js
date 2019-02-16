
import Line from './Line';

class GroupEffects {
  constructor(parent, colors, guiFolder) {
    this.parent = parent;
    this.effects = [];
    this.colors = colors;
    this.guiFolder = guiFolder;
  }

  add(effect) {
    switch (effect) {
      case 'line':
        this.effects.push(new Line(this.parent, this.colors[0], this.guiFolder));
        break;
    }
    console.log(this.effects);
  }

  update(data) {
    _.each(this.effects, (effect) => {
      effect.update(data);
    });
  }
}

module.exports = GroupEffects;
