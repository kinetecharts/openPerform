// Common utility functions


import dat from 'dat-gui';

function Common() {
  const self = this;

  this.getKeys = function (obj, append) {
	  const all = {};
	  const seen = [];
	  checkValue(obj);
	  return Object.keys(all);
	  function checkValue(value) {
	    if (Array.isArray(value)) return checkArray(value);
	    if (value instanceof Object) return checkObject(value);
	  }
	  function checkArray(array) {
	    if (seen.indexOf(array) >= 0) return;
	    seen.push(array);
	    // for (var i = array.length-1, l = 0; i >= l; i--) {
	    for (let i = 0, l = array.length; i < l; i++) {
	      checkValue(array[i]);
	    }
	  }
	  function checkObject(obj) {
	    if (seen.indexOf(obj) >= 0) return;
	    seen.push(obj);
	    const keys = Object.keys(obj);
	    // for (var i = keys.length-1, l = 0; i >= l; i--) {
	    for (let i = 0, l = keys.length; i < l; i++) {
	      const key = keys[i];
	      all[append + key] = true;
	      checkValue(obj[key]);
	    }
	  }
  };

  this.mapRange = function (num, oldMinValue, oldMaxValue, newMinValue, newMaxValue) {
    const a = oldMaxValue - oldMinValue;
    const b = newMaxValue - newMinValue;
    return (num - oldMinValue) / a * b + newMinValue;
  };

  this.convertVec3ToLatLon = function (pos) {
    return [90 - (Math.acos(pos.y / 1835)) * 180 / Math.PI,
      ((270 + (Math.atan2(pos.x, pos.z)) * 180 / Math.PI) % 360)];
  };

  this.convertLatLonToVec3 = function (lat, lon) {
    lat = lat * Math.PI / 180.0;
    lon = -lon * Math.PI / 180.0;
    return new THREE.Vector3(
      Math.cos(lat) * Math.cos(lon),
      Math.sin(lat),
      Math.cos(lat) * Math.sin(lon),
    );
  };

  this.getTZ = function (lat, lon) {
    return CoordinateTZ.calculate(lat, lon).timezone;
  };

  dat.GUI.prototype.removeFolder = function (name) {
	  const folder = this.__folders[name];
	  if (!folder) {
	    return;
	  }
	  folder.close();
	  this.__ul.removeChild(folder.domElement.parentNode);
	  delete this.__folders[name];
	  this.onResize();
  };

  this.hexToRgb = function (hex) {
	    let c;
	    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
	        c = hex.substring(1).split('');
	        if (c.length == 3) {
	            c = [c[0], c[0], c[1], c[1], c[2], c[2]];
	        }
	        c = `0x${c.join('')}`;
	        return [(c >> 16) & 255, (c >> 8) & 255, c & 255];
	    }
	    throw new Error('Bad Hex');
  };
}

const tempCommon = new Common();
module.exports = tempCommon;
