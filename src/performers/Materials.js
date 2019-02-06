import ShaderToyLoader from './../materials/ShaderToyLoader';

import Common from './../util/Common';

import config from './../config';

class Materials {
  constructor() {

    this.shaderToyLoader = new ShaderToyLoader();
    this.shaderToyIds = [
      'XsdyD4', // gradient lines
      'MlySDW', // folded wrapping paper
      'MlVSDW', // grid - noise warp
      'llyXWh', // scrolling dashed lines
      'MlKXWm', // distance blobs
      'lscXDn', // triangluar grid (gree)
      '4dV3Dh', // colorful tris
      'XlGSRW', // triangle wobbles
      'XsyXzw', // dancing dots
      'MtcXRB', // luma dots
      'Xt33DM', // sift
      'XdsGWs', // star psf
      'Mld3Rn', // perspex web lattice
      'Ml2GWy', // fracta tiling
      'Mss3Wf', // basic fractal
      'ldKXWG', // hexagonal tiling 5
      '4dKXz3', // hexagonal tiling 7
      'XlB3Rt', // has choas
      'lsKyWV', // curlesque
      'MtjGz3', // p6mm inversion 
      'Xss3Dr', // procedural checkerboard
      '4dccWj', //
      'MdSGRc', // voronoi - metrics
      'MdfBzl', // ice and fire
      'XsdBRj',
      'ltlfRM', // flicky

      'lsSGRc', // blocks
      'MslGD8', // voronoi - basic
      'XdGXD3', // caves
      '4tdSWr', // clouds
      'Xlj3Rh', // diy spaceman cave
      '4ssGzn', // fire2
      'llcXW7', // foamy water
      'lsXGzH',
      'Msl3Rr', // 2 wood blocks???
      '4lKSzh', // 3 water
      'lsSXzD', // 4 something flashing???
      'ldXXDj', // 5 something purple?
      'XdBGzd', // 6 empty
      'Xd23Dh', // 7
      'ldfyzl', // 8
      'MddGzf', // 9
      '4sX3R2', // 10
    ];

    this.materialNames = [/*'Shader', */'Basic', 'Lambert', 'Phong', 'Standard',
      'Toon', /*'Webcam',*/
      'Halftone Lines - Animated',
      'Halftone Dots - Animated',
      'Super Mario - Animated',
      /*'Shader Toy 4', 'Shader Toy 5',
  'Shader Toy 6', 'Shader Toy 7', 'Shader Toy 8', 'Shader Toy 9', 'Shader Toy 10'*/];
  }

  initWebcam() {
    // let video = document.createElement('video');
    // video.setAttribute('id', 'video');
    // video.setAttribute('autoplay', 'true');
    if ( navigator.mediaDevices && navigator.mediaDevices.getUserMedia ) {
      var constraints = { video: { width: 1280, height: 720, facingMode: 'user' } };
      navigator.mediaDevices.getUserMedia( constraints ).then( function ( stream ) {
        // apply the stream to the video element used in the texture
        video.srcObject = stream;
        video.play();
        return video;
      } ).catch( function ( error ) {
        console.error( 'Unable to access the camera/webcam.', error );
      } );
    } else {
      console.error( 'MediaDevices interface not available.' );
    }

  }

  getMaterialNames() {
    return this.materialNames;
  }

  getMaterial(materialName, color, wireframe) {
    return new Promise((resolve, reject) => {
      switch (materialName.toLowerCase()) {
        default:
        case 'phong':
          resolve([new THREE.MeshPhongMaterial({
            wireframe: wireframe,
            color: new THREE.Color(parseInt(color, 16)),
            side: THREE.DoubleSide,
          })]);
          break;

        case 'basic': 
          resolve([new THREE.MeshBasicMaterial({
            wireframe: wireframe,
            color: new THREE.Color(parseInt(color, 16)),
            side: THREE.DoubleSide,
          })]);
          break;

        case 'lambert':
          resolve([new THREE.MeshLambertMaterial({
            wireframe: wireframe,
            color: new THREE.Color(parseInt(color, 16)),
            side: THREE.DoubleSide
          })]);
          break;

        case 'standard':
          resolve([new THREE.MeshStandardMaterial({
            wireframe: wireframe,
            color: new THREE.Color(parseInt(color, 16)),
            side: THREE.DoubleSide
          })]);
          break;

        case 'toon': 
          resolve([new THREE.MeshToonMaterial({
            wireframe: wireframe,
            color: new THREE.Color(parseInt(color, 16)),
            side: THREE.DoubleSide,
            bumpScale: 1,
            specular: new THREE.Color( 1 * 0.2, 1 * 0.2, 1 * 0.2 ),
            reflectivity: 1,
            shininess: Math.pow( 2, 1 * 10 ),
            envMap: null
          })]);
          break;

        case 'webcam':
          resolve([new THREE.MeshBasicMaterial({ map: new THREE.VideoTexture( this.initWebcam() ) })]);
          break;

        case 'super mario - animated':
        this.shaderTimeout = null;
          this.shaderToyLoader.getShader('XtlSD7')
            .then((mat) => {
              mat[0].updateTime = (val) => {
                mat[0].clock.stop();
                mat[0].clock.elapsedTime += val;

                if (this.shaderTimeout == null) {
                  this.shaderTimeout = setTimeout(() => {
                    mat[0].clock.start();
                  }, 3000);
                } else { clearTimeout(this.shaderTimeout); }
              };

              mat[0].start = () => { mat[0].clock.start(); };
              mat[0].stop = () => { mat[0].clock.stop(); };

              mat[0].wireframe = wireframe;
              mat[0].color = new THREE.Color(parseInt(color, 16)),
              mat[0].side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;

        case 'halftone lines - animated':
          this.shaderTimeout = null;
          this.shaderToyLoader.getShader('MsBfzm')
            .then((mat) => {
              mat[0].updateTime = (val) => {
                mat[0].clock.stop();
                mat[0].clock.elapsedTime += val;

                if (this.shaderTimeout == null) {
                  this.shaderTimeout = setTimeout(() => {
                    mat[0].clock.start();
                  }, 3000);
                } else { clearTimeout(this.shaderTimeout); }
              };

              mat[0].start = () => { mat[0].clock.start(); };
              mat[0].stop = () => { mat[0].clock.stop(); };

              mat[0].wireframe = wireframe;
              mat[0].color = new THREE.Color(parseInt(color, 16)),
              mat[0].side = THREE.DoubleSide;

              resolve(mat);
            })
            .catch(reject);
          break;

        case 'halftone dots - animated':
          this.shaderTimeout = null;
          this.shaderToyLoader.getShader('MdBfzm')
            .then((mat) => {
              mat[0].updateTime = (val) => {
                mat[0].clock.stop();
                mat[0].clock.elapsedTime += val;

                if (this.shaderTimeout == null) {
                  this.shaderTimeout = setTimeout(() => {
                    mat[0].clock.start();
                  }, 3000);
                } else { clearTimeout(this.shaderTimeout); }
              };

              mat[0].start = () => { mat[0].clock.start(); };
              mat[0].stop = () => { mat[0].clock.stop(); };

              mat[0].wireframe = wireframe;
              mat[0].color = new THREE.Color(parseInt(color, 16)),
              mat[0].side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;

        case 'shader toy 4':
          this.shaderToyLoader.getShader(this.shaderToyIds[3]) // Mtdyzf, XsX3RB
            .then((mat) => {
              mat.wireframe = wireframe;
              mat.color = new THREE.Color(parseInt(color, 16));
              mat.side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;

        case 'shader toy 5':
          this.shaderToyLoader.getShader(this.shaderToyIds[4]) // Mtdyzf, XsX3RB
            .then((mat) => {
              mat.wireframe = wireframe;
              mat.color = new THREE.Color(parseInt(color, 16));
              mat.side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;

        case 'shader toy 6':
          this.shaderToyLoader.getShader(this.shaderToyIds[5]) // Mtdyzf, XsX3RB
            .then((mat) => {
              mat.wireframe = wireframe;
              mat.color = new THREE.Color(parseInt(color, 16));
              mat.side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;

        case 'shader toy 7':
          this.shaderToyLoader.getShader(this.shaderToyIds[6]) // Mtdyzf, XsX3RB
            .then((mat) => {
              mat.wireframe = wireframe;
              mat.color = new THREE.Color(parseInt(color, 16));
              mat.side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;

        case 'shader toy 8':
          this.shaderToyLoader.getShader(this.shaderToyIds[7]) // Mtdyzf, XsX3RB
            .then((mat) => {
              mat.wireframe = wireframe;
              mat.color = new THREE.Color(parseInt(color, 16));
              mat.side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;

        case 'shader toy 9':
          this.shaderToyLoader.getShader(this.shaderToyIds[8]) // Mtdyzf, XsX3RB
            .then((mat) => {
              mat.wireframe = wireframe;
              mat.color = new THREE.Color(parseInt(color, 16));
              mat.side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;

        case 'shader toy 10':
          this.shaderToyLoader.getShader(this.shaderToyIds[9]) // Mtdyzf, XsX3RB
            .then((mat) => {
              mat.wireframe = wireframe;
              mat.color = new THREE.Color(parseInt(color, 16));
              mat.side = THREE.DoubleSide;
              resolve(mat);
            })
            .catch(reject);
          break;
      }
    });
  }
}

module.exports = Materials;
