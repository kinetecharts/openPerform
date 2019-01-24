import ShaderToyMaterial from 'three-shadertoy-material';

import Mtdyzf from './shaders/Mtdyzf.json';
import XsX3RB from './shaders/XsX3RB.json';

import { shaderToy } from './../../server/config';

class ShaderToyLoader {
  constructor() {
    this.shaders = [
      'Mtdyzf': Mtdyzf,
      'XsX3RB': XsX3RB,
    ];
  }

  getShader(id) {
    return new Promise((resolve, reject) => {
      if (this.shaders[id] !== undefined) {
        resolve(this.shaders[id]);
      }
      this.getShaderToy('https://www.shadertoy.com/api/v1/shaders/' + id + '?key=' + shaderToy.key)
        .then((result) => {
          if (this.shaders[id] == undefined) {
            console.log(result.Shader.renderpass.length);
            if (result.Shader.renderpass.length > 1) {
              console.log(result.Shader.renderpass[1]);
            }
            this.shaders[id] = [new ShaderToyMaterial(result.Shader.renderpass[0].code)];
          }
          resolve(this.shaders[id]);
        });
    });
  }

  getShaderToy(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.onload = () => resolve(JSON.parse(xhr.responseText));
      xhr.onerror = () => reject(xhr.statusText);
      xhr.send();
    });
  }
}

module.exports = ShaderToyLoader;
