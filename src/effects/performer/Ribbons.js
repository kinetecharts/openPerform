/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 01:19:20
 * @modify date 2018-08-26 01:19:20
 * @desc [The Ribbons effect creates colored trails for parts of a performers body.]
*/



import RibbonsMenu from '../../react/menus/effects/RibbonsMenu';

require ('./../../libs/trail');
import Common from './../../util/Common';

class Ribbons {
  constructor(effectId, parent, color) {
    this.id = effectId;
    this.name = 'ribbons';
    this.parent = parent;
    this.color = new THREE.Color(color);
    this.lightColor = new THREE.Color().setHSL(this.color.getHSL().h, this.color.getHSL().s, this.color.getHSL().l + 0.1);

    this.targets = ['wristleft', 'wristright'];
    this.possibleTargets = [
      'spineshoulder',
      'spinemid',
      'shoulderleft',
      'elbowleft',
      'wristleft',
      'shoulderright',
      'elbowright',
      'wristright',
      'hipleft',
      'kneeleft',
      'hipright',
      'kneeright',
    ];

    this.ribbons = [];

    // initialize the ribbon options
    this.options = {
      thickness: 0.125,
      length: 25,
      headColor: '#' + this.color.getHexString(),
      tailColor: '#' + this.lightColor.getHexString(),
      headAlpha: 0.75,
      tailAlpha: 0.35,
    };
  }

  addRibbon(parent, part, options) {
    // specify points to create planar ribbon-head geometry
    this.circlePoints = [];
    this.twoPI = Math.PI * 2;
    this.index = 10;
    this.scale = options.thickness;
    this.inc = this.twoPI / 32.0;

    for (let i = 0; i <= this.twoPI + this.inc; i += this.inc) {
      this.vector = new THREE.Vector3();
      this.vector.set(Math.cos(i) * this.scale, Math.sin(i) * this.scale, 0);
      this.circlePoints[this.index] = this.vector;
      this.index++;
    }
    this.ribbonHeadGeometry = this.circlePoints;

    // create the ribbon renderer object
    const ribbon = new THREE.TrailRenderer(parent, false);

    // create material for the ribbon renderer
    const ribbonMaterial = THREE.TrailRenderer.createBaseMaterial();

    ribbonMaterial.uniforms.headColor.value.set(
      new THREE.Color(options.headColor).r,
      new THREE.Color(options.headColor).g,
      new THREE.Color(options.headColor).b,
      options.headAlpha,
    );

    ribbonMaterial.uniforms.tailColor.value.set(
      new THREE.Color(options.tailColor).r,
      new THREE.Color(options.tailColor).g,
      new THREE.Color(options.tailColor).b,
      options.tailAlpha,
    );

    ribbon.initialize(ribbonMaterial, options.length, false, 0, this.ribbonHeadGeometry, part);
    ribbon.activate();

    return ribbon;
  }

  // remove effect / clean up objects, timers, etc
  remove() {
    console.log('Deleting Ribbons...');
    _.each(this.ribbons, (ribbon) => {
      ribbon.deactivate();
      ribbon.reset();
      ribbon.destroyMesh();
    });
    this.ribbons = [];
  }

  // render call, passes existing performer data
  update(data, currentPose, distances) {
    let idx = 0;
    data.traverse((d) => {
      // console.log(this.ribbons[idx]);
      if (_.filter(this.targets, t => '' + t === d.name.toLowerCase()).length > 0) {
        if (this.ribbons[idx]) {
          const time = performance.now();
          if (time - this.ribbons[idx].lastRibbonUpdateTime > 50) {
            this.ribbons[idx].advance();
            this.ribbons[idx].lastRibbonUpdateTime = time;
          } else {
            this.ribbons[idx].updateHead();
          }

          if (this.ribbons[idx].refresh === true) {
            this.ribbons[idx].deactivate();
          }
        }

        if (!this.ribbons[idx]) {
          this.ribbons[idx] = this.addRibbon(this.parent, d, this.options);
          this.ribbons[idx].lastRibbonUpdateTime = performance.now();
          this.ribbons[idx].refresh = false;
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

  // returns react gui object when effect is selected
  getGUI() {
    return <RibbonsMenu data={this.options}
      currentTargets={this.targets}
      possibleTargets={this.possibleTargets}
      updateOptions={this.updateOptions.bind(this)}
      updateParts={this.updateParts.bind(this)} />;
  }
}

module.exports = Ribbons;