import React from 'react';
import _ from 'lodash';

import DatGui, { DatNumber, DatBoolean } from 'react-dat-gui';
import datGuiCss from 'react-dat-gui/build/react-dat-gui.css';

import TWEEN from 'tween.js';

import config from './../../config';

class Cloner {
  constructor(effectId, parent, color) {
    this.id = effectId;
    this.name = 'cloner';
    this.parent = parent;
    this.color = color;
    
    this.performer = null;
    this.clones = [];
    this.cloneInterval = null;
    this.lastClick = 0;
    this.clickCount = 0;

    this.options = {
      cloneRate: 0.25,
      cloneLife: 1.25,
      cloneSize: 1,
      isPlaying: true,
    };

    if (this.options.isPlaying == true) {
      this.updateCloneRate(this.options.cloneRate);
    }
  }

  updateCloneRate(val) {
    if (this.cloneInterval) {
      clearInterval(this.cloneInterval);
    }
    this.cloneInterval = setInterval(this.clonePerformer.bind(this), 1000 * val);
  }

  stopCloning() {
    if (this.cloneInterval) {
      clearInterval(this.cloneInterval);
    }
  }

  clonePerformer() {
    if (this.performer) {
      var clone = this.performer.clone();
      clone.scale.set(clone.scale.x * this.options.cloneSize, clone.scale.y * this.options.cloneSize, clone.scale.z * this.options.cloneSize);
      clone.traverse((part) => {
        if (part instanceof THREE.Mesh) {
          part.castShadow = false;
          part.receiveShadow = false;
          part.material = part.material.clone();
          part.material.opacity = 0.15;
          part.material.transparent = true;
        }
      });

      this.parent.add(clone);
      this.clones.push(clone);

      this.performer = null;
    }

    // setTimeout(function(){
    var clone = this.clones.shift();
    if (clone) {
      clone.traverse((part) => {
        if (part instanceof THREE.Mesh) {
          new TWEEN.Tween({ opacity: part.material.opacity })
            .to({ opacity: 0 }, this.options.cloneLife * 1000)
            .onUpdate(function () {
              part.material.opacity = this.opacity;
            })
            .onComplete(() => {
              if (clone) {
                this.parent.remove(clone);
                clone = null;
              }
            })
            .start();
        }
      });
    }
  }

  remove() {
    console.log('Deleting cloner...');
    clearInterval(this.cloneInterval);
    _.each(this.clones, (clone) => {
      this.parent.remove(clone);
      clone = null;
    });
  }

  updateParameters(data) {
    switch (data.parameter) {
      default:
      case 'rate':
        this.options.cloneRate = (data.value * 10) + 0.25;
        this.updateCloneRate(this.options.cloneRate);
        break;
      case 'life':
        this.options.cloneLife = (data.value * 10) + 0.25;
        break;
    }
  }

  updateOptions(data) {
    
    this.options.isPlaying = data.isPlaying;
    this.options.cloneRate = data.cloneRate;
    this.options.cloneLife = data.cloneLife;
    this.options.cloneSize = data.cloneSize;

    if (this.options.isPlaying) {
      this.updateCloneRate(this.options.cloneRate);
    } else {
      this.stopCloning();
    }
    
    this.options.isPlaying = data.isPlaying;

  }

  update(data, currentPose, distances) {
    this.performer = data;
  }

  getGUI() {
    return <GUI data={{thickness:0.5}} updateOptions={this.updateOptions.bind(this)} />;
  }
}

module.exports = Cloner;

class GUI extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {};
  }
  render() {
    return (
      <div>
        <DatGui data={this.props.data} onUpdate={this.props.updateOptions.bind(this)}>
          <DatNumber min={0.5} max={10} step={0.5} path='cloneRate' label='Clone Rate' />
          <DatNumber min={0.5} max={10} step={0.5} path='cloneLife' label='Clone Life' />
          <DatNumber min={0.5} max={10} step={0.5} path='cloneSize' label='Clone Size' />
          <DatBoolean path='isPlaying' label='Playing' />
        </DatGui>
      </div>
    );
  }
}