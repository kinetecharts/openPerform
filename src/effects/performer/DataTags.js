/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 05:03:40
 * @modify date 2018-08-26 05:03:40
 * @desc [The Data Tags Effect creates text tags for parts of a performers body.]
*/

import React from 'react';

import DataTagsMenu from '../../react/effects/DataTagsMenu';

import loadFont from 'load-bmfont';
import createText from './bmFont';
import MSDFShader from './bmFont/shaders/msdf';

class DataTags {
  constructor(effectId, parent, color) {
    this.id = effectId;
    this.name = 'datatags';
    this.parent = parent;

    this.color = color;

    this.targets = ['rightfoot', 'leftfoot', 'head', 'righthand', 'lefthand'];
    this.possibleTargets = ['hips',
      'rightupleg', 'rightleg', 'rightfoot',
      'leftupleg', 'leftleg', 'leftfoot',
      'spine', 'spine3', 'head',
      'rightarm', 'rightforearm', 'righthand',
      'leftarm', 'leftforearm', 'lefthand',
    ];

    this.tags = [];

    this.options = {
      padding: [0, 0, 0, 0],
      showName: true,
      showPosition: true,
      showRotation: true,
    };
    this.fontsReady = false;

    this.fonts = [
      {
        name: 'regular',
        json: 'bmFonts/lato-regular.json',
        png: 'bmFonts/lato-regular.png',
        font: null,
        texture: null,
      },
    ];

    this.loadFonts(this.fonts);
  }

  loadFonts(fontList) {
    _.each(fontList, (fontDef) => {
      loadFont(fontDef.json, (err, font) => {
        if (err) throw err;
        THREE.ImageUtils.loadTexture(fontDef.png, undefined, (texture) => {
          fontDef.font = font;
          fontDef.texture = texture;
          if (_.filter(fontList, 'font').length === fontList.length) {
            this.fontsReady = true;
          }
        });
      });
    });
  }

  addTag(parent, part, options) {
    const font = _.filter(this.fonts, { name: 'regular' })[0].font;
    const texture = _.filter(this.fonts, { name: 'regular' })[0].texture;

    const textScale = 0.001;

    // draw text first to get dimensions
    const tag = this.createTextMesh(
      font,
      texture,
      '',
      'left',
      0xFFFFFF,
      font.common.lineHeight,
      null,
    );

    tag.scale.set(textScale, textScale, textScale);

    tag.children[0].geometry.computeBoundingBox();
    tag.position.x = 0.016;
    tag.position.y = (options.padding[0] + options.padding[2]/2)
      - (options.padding[0] / 2)
      - ((tag.children[0].totalHeight * textScale) / 2);

    this.parent.add(tag);

    return tag;
  }

  // draw msdf text
  createTextMesh(font, texture, text, align, color, lineHeight, width) {
    const textOptions = {
      text: text,
      font: font,
      align: align,
      lineHeight: lineHeight,
    };

    if (width !== undefined || width !== null) {
      textOptions.width = width;
    }

    const textMesh = new THREE.Mesh(
      createText(textOptions),
      new THREE.RawShaderMaterial(
        MSDFShader(
          {
            map: texture,
            transparent: true,
            color: color,
            side: THREE.DoubleSide,
            opacity: 1,
          },
        ),
      ),
    );
    textMesh.defaults = {
      opacity: 1,
    };

    textMesh.geometry.computeBoundingBox();
    textMesh.totalHeight = textMesh.geometry.layout.height
      - textMesh.geometry.boundingBox.max.y
      - (textMesh.geometry.layout.descender * 2);
    textMesh.totalWidth = textMesh.geometry.boundingBox.max.x;
    textMesh.geometry.computeBoundingBox();
    textMesh.position.set(0, textMesh.geometry.layout.descender * 2, 0);

    textMesh.rotation.x = Math.PI;
    return new THREE.Object3D().add(textMesh);
  }

  // remove effect / clean up objects, timers, etc
  remove() {
    console.log('Deleting Data Tags...');
    _.each(this.tags, (tag) => {
      this.parent.remove(tag);
    });
    this.tags = [];
  }

  // render call, passes existing performer data
  update(data, currentPose, distances) {
    let idx = 0;
    data.traverse((d) => {
      if (_.filter(this.targets, t => `robot_${t}` == d.name.toLowerCase()).length > 0) {
        if (this.tags[idx]) {
          if (this.tags[idx]) {
            const gPos = new THREE.Vector3().setFromMatrixPosition(d.matrixWorld);

            this.tags[idx].position.copy(gPos.clone());

            let tagString = '';
            if (this.options.showName) {
              tagString += d.name + '\n';
            }
            if (this.options.showPosition) {
              tagString += 'X: ' + gPos.x.toFixed(3) + ', ' + 'Y: ' + gPos.y.toFixed(3) + ', ' + 'Z: ' + gPos.z.toFixed(3) + '\n';
            }
            if (this.options.showRotation) {
              tagString += 'X: ' + d.rotation.x.toFixed(3) + ', ' + 'Y: ' + d.rotation.y.toFixed(3) + ', ' + 'Z: ' + d.rotation.z.toFixed(3) + '\n';
            }
            this.tags[idx].children[0].geometry.update({
              text: tagString,
            });
          }
        }

        if (!this.tags[idx] && this.fontsReady) {
          this.tags[idx] = this.addTag(this.parent, d, this.options, this.font);
        }


        idx++;
      }
    });
  }

  // updated target list from gui
  updateParts(data) {
    this.targets = data;
    this.remove();
  }

  // updated options from gui
  updateOptions(data) {
    this.options = data;
    this.remove();
  }

  getGUI() {
    return <DataTagsMenu data={this.options}
    currentTargets={this.targets}
    possibleTargets={this.possibleTargets}
    updateOptions={this.updateOptions.bind(this)}
    updateParts={this.updateParts.bind(this)}/>;
  }
}

module.exports = DataTags;