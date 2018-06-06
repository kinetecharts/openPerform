import React from 'react';
import _ from 'lodash';

import DatGui, { DatNumber, DatButton } from 'react-dat-gui';
import datGuiCss from 'react-dat-gui/build/react-dat-gui.css';

import TWEEN from 'tween.js';

import config from './../../config';

class Vogue {
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

    this.startingOpacity = 1;// 0.15;
    this.options = {
      cloneRate: 0.25,
      fadeDelay: 2,
      cloneLife: 2, // 1.25;
      cloneSize: 1,
    }
  }

  updateCloneRate(val) {
    if (this.cloneInterval) {
      clearInterval(this.cloneInterval);
    }
    this.cloneInterval = setInterval(this.clonePerformer.bind(this), 1000 * val);
  }

  clonePerformer() {
    if (this.performer) {
      var clone = this.performer.clone();
      clone.visible = true;
      clone.scale.set(clone.scale.x * this.options.cloneSize, clone.scale.y * this.options.cloneSize, clone.scale.z * this.options.cloneSize);
      clone.traverse((part) => {
        if (part instanceof THREE.Mesh) {
          part.material = part.material.clone();
          part.material.opacity = this.startingOpacity;
          part.material.transparent = true;
        }
      });

      this.parent.add(clone);
      this.clones.push(clone);

      this.performer = null;
    }

    var clone = this.clones.shift();
    if (clone) {
      clone.traverse((part) => {
        if (part instanceof THREE.Mesh) {
          setTimeout(
            () => {
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
            },
            this.options.fadeDelay * 1000,
          );
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
    		case 'rate':
    			this.options.cloneRate = (data.value * 10) + 0.25;
    			this.updateCloneRate(this.options.cloneRate);
    			break;
    		case 'life':
        this.options.cloneLife = (data.value * 10) + 0.25;
    			break;
    	}
  }

  update(data, currentPose, distances) {
    this.performer = data;
  }

  updateData(data) {
    this.options.fadeDelay = data.fadeDelay;
    this.options.cloneLife = data.cloneLife;
    this.options.cloneSize = data.cloneSize;
  }

  getGUI() {
    return <GUI
      data={this.options}
      updateData={this.updateData.bind(this)}
      clonePerformer={this.clonePerformer.bind(this)}
    />
  }
}

module.exports = Vogue;

class GUI extends React.Component {
  constructor(props) {
    super(props);
    this.props = props;
    this.state = {
    };
  }
  render() {
    return (
      <div>
        <DatGui data={this.props.data} onUpdate={this.props.updateData}>
          <DatNumber min={0.25} max={5} step={0.25} path='fadeDelay' label='Clone Life' />
          <DatNumber min={0.25} max={5} step={0.25} path='cloneLife' label='Fade Time' />
          <DatNumber min={0.25} max={2} step={0.25} path='cloneSize' label='Clone Size' />
          <DatButton label="Create Clone" onClick={this.props.clonePerformer} />
        </DatGui>
      </div>
    );
  }
}