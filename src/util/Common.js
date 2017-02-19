//Common utility functions

var THREE = require('three');
var CoordinateTZ = require('coordinate-tz');


function Common() {
	var self = this;

	this.getKeys = function(obj, append) {
	  var all = {};
	  var seen = [];
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
	    for (var i = 0, l = array.length; i < l; i++) {
	      checkValue(array[i]);
	    }
	  }
	  function checkObject(obj) {
	    if (seen.indexOf(obj) >= 0) return;
	    seen.push(obj);
	    var keys = Object.keys(obj);
	    // for (var i = keys.length-1, l = 0; i >= l; i--) {
	    for (var i = 0, l = keys.length; i < l; i++) {
	      var key = keys[i];
	      all[append+key] = true;
	      checkValue(obj[key]);
	    }
	  }
	}

	this.mapRange = function(num, oldMinValue, oldMaxValue, newMinValue, newMaxValue) {
		var a = oldMaxValue - oldMinValue;
		var b = newMaxValue - newMinValue;
		return (num - oldMinValue) / a * b + newMinValue;
	}

	this.convertVec3ToLatLon = function(pos) {
		return [90 - (Math.acos(pos.y / 1835)) * 180 / Math.PI,
			((270 + (Math.atan2(pos.x , pos.z)) * 180 / Math.PI) % 360)];
	}

	this.convertLatLonToVec3 = function(lat,lon)
	{
		lat =  lat * Math.PI / 180.0;
		lon = -lon * Math.PI / 180.0;
		return new THREE.Vector3( 
			Math.cos(lat) * Math.cos(lon), 
			Math.sin(lat), 
			Math.cos(lat) * Math.sin(lon) );
	}

	this.getTZ = function(lat, lon) {
		return CoordinateTZ.calculate(lat, lon).timezone;
	}
}

var tempCommon = new Common();
module.exports = tempCommon;