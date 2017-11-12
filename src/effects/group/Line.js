import _ from 'lodash';
import TWEEN from 'tween';

import config from './../../config';

class Line {
  constructor(parent, color, guiFolder) {
    this.parent = parent;
    this.color = color;
    this.guiFolder = guiFolder;
    this.lineData = [];
    this.lines = [];
    this.performers = null;

    this.targets = [/* "hips",
		"rightupleg", "rightleg", */ 'rightfoot',
      /* "leftupleg", "leftleg", */ 'leftfoot',
      /* "spine", "spine3", */ 'head',
      /* "rightarm", "rightforearm", */ 'righthand',
      /* "leftarm", "leftforearm", */'lefthand',
    ];

    this.options = {
      maxLines: 1,
      randomTime: 5,
      match: true,
    };

    this.setRandomTimer(this.options.randomTime);

    this.addToDatGui(this.options, this.guiFolder);
  }

  setRandomTimer(val) {
    if (this.randomTimer) {
      clearInterval(this.randomTimer);
    }
    if (val > 0) {
      this.randomTimer = setInterval(this.randomizeTargets.bind(this), val * 1000);
    }
  }

  randomizeTargets() {
    if (this.options.match) {
      var targets = _.shuffle(this.targets);
    }
    _.each(this.performers, (performer) => {
      if (this.options.match) {
        performer.targets = targets;
      } else {
        performer.targets = _.shuffle(performer.targets);
      }
    });
  }

  addToDatGui(options, guiFolder) {
    const f = guiFolder.addFolder('Line');
    f.add(options, 'maxLines', 1, 5).step(1).name('# Lines');
    f.add(options, 'randomTime', 0.0125, 30).step(0.0125).name('Random Time').onChange(this.setRandomTimer.bind(this));
    f.add(options, 'match');
  }

  update(performers) {
    this.performers = performers;
    _.each(this.performers, (performer) => {
      if (!performer.targets) {
        if (this.options.match) {
          performer.targets = _.clone(this.targets);
        } else {
          performer.targets = _.clone(_.shuffle(this.targets));
        }
      }

      const points = [];
      performer.getScene().traverse((part) => {
        if (_.filter(performer.targets, t => `robot_${t}` == part.name.toLowerCase()).length > 0) {
          points[performer.targets.indexOf(part.name.toLowerCase().slice(6, part.name.length))] = new THREE.Vector3().setFromMatrixPosition(part.matrixWorld);
        }
      });
      this.lineData.push(points);
    });
    this.lineData = _.zip(this.lineData[0], this.lineData[1]);

    this.drawLines(this.lineData);

    this.lineData = [];
  }

  drawLines(lineData) {
    while (this.lines.length > this.options.maxLines) {
      this.parent.remove(this.lines.pop());
    }

    _.each(lineData.slice(0, this.options.maxLines), (data, idx) => {
      if (!this.lines[idx]) {
        const material = new THREE.LineBasicMaterial({
          color: 0xffffff,
        });

        const geometry = new THREE.Geometry();
        geometry.dynamic = true;
        geometry.vertices = data;
        geometry.verticesNeedUpdate = true;

        this.lines[idx] = new THREE.Line(geometry, material);
        this.parent.add(this.lines[idx]);
      }

      this.lines[idx].geometry.dynamic = true;
      this.lines[idx].geometry.vertices = data;
      this.lines[idx].geometry.verticesNeedUpdate = true;
    });
  }
}

module.exports = Line;
