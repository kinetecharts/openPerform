var request = require('request');
// var _ = require('lodash');

var config = require('./../config.js').mapzen;

//import data models
var Tile = require('./../models/tile');

var loadOrder = null;
var tiles = [];

exports.getTiles = function(req, res, next) {
	loadOrder = generateLoadingPattern({lat:req.params.lat, lon:req.params.lon}, req.params.area);
	for (var i = 0; i < loadOrder.length; i++) {
		var location = loadOrder[i];
		getTile(location, i, req, res, next);
	}
};

function getTile(location, idx, req, res, next) {
	var query = Tile.findOne({'location.lat':location.lat, 'location.lon': location.lon});

	query.exec().then(function(doc) {
		if (doc && doc.expire > new Date(Date.now())) {
			var d = JSON.parse(JSON.stringify(doc));
			d.loadOrder = idx;
			d.tile = JSON.parse(d.tile);
			tiles.push(d);
			if (tiles.length == loadOrder.length) {
				console.log(tiles.length, 'tiles returned');
				res.setHeader('Content-Type', 'application/json');
				res.setHeader('Access-Control-Allow-Origin', '*');
				
				res.json(tiles);

				tiles = [];
				next();
			}
		} else {
			downloadTile(location, function(doc) {
				var d = JSON.parse(JSON.stringify(doc));
				d.loadOrder = idx;
				d.tile = JSON.parse(d.tile);
				tiles.push(d);
				if (tiles.length == loadOrder.length) {
					console.log(tiles.length, 'tiles returned');
					res.setHeader('Content-Type', 'application/json');
					res.setHeader('Access-Control-Allow-Origin', '*');
					
					res.json(tiles);

					tiles = [];
					next();
				}
			});
		}
	});
}


function downloadTile(location, cb) {
	var callUrl = buildQueryURL(location);
	request({
		method: 'GET', 
		url: callUrl, 
		headers: { 'cache-control': 'no-cache' }
	}, function(err, response, data) {
		if (err) { return console.error(err); }
		
		var tile = {
			location: location, 
			expire: new Date(Date.now() + config.freshness), 
			tile: data
		};
		
		var query = Tile.findOneAndUpdate({
			'location.lat':location.lat, 
			'location.lon': location.lon
		}, 
		{$set:tile}, {new: true});

		query.exec().then(function(doc) {
			if (err) { return console.error('Something wrong when updating data!', err); }
			if (!doc) {
				var tile = new Tile({
					location: location, 
					expire: new Date(Date.now() + config.freshness), 
					tile: data
				});
				tile.save(function(err, doc) {
					if (err) { return console.error(err); }
					return cb(doc);
				});
			} else {
				return cb(doc);
			}
			return false;
		});
		return true;
	});
}

function generateLoadingPattern(location, area) {
	var loadOrder = [];

	var x = -(area - area) / 2;
	if (x == -0) { x = Math.abs(0); }
	var y = 0;
	if (y == -0) { y = Math.abs(0); }
	var dx = 1;
	var dy = 0;
	var x_limit = (area - area) / 2;
	var y_limit = 0;
	
	for (var i = 0; i < area * area; i++) {
		if ((-area / 2 < x && x <= area / 2)  && (-area / 2 < y && y <= area / 2)) {

			var tileLat = lat2tile(location.lat, config.zoom);
			var tileLon = lon2tile(location.lon, config.zoom);

			var tileX = parseFloat(tileLon) + x;
			var tileY = parseFloat(tileLat) - y;

			var lon = tile2Lon(tileX, config.zoom);
			var lat = tile2Lat(tileY, config.zoom);

			loadOrder.push( {
				x: x, 
				y: y, 
				lon: lon, 
				lat: lat, 
				tileX: tileX, 
				tileY: tileY
			} );
		}
		if ( dx > 0 ) {//Dir right
			if (x > x_limit) {
				dx = 0;
				dy = 1;
			}
		} else if ( dy > 0 ) { //Dir up
			if (y > y_limit) {
				dx = -1;
				dy = 0;
			}
		} else if (dx < 0) { //Dir left
			if (x < (-1 * x_limit)) {
				dx = 0;
				dy = -1;
			}
		} else if (dy < 0) { //Dir down
			if (y < (-1 * y_limit)) {
				dx = 1;
				dy = 0;
				x_limit++;
				y_limit++;
			}
		}
		x += dx;
		y += dy;
	}
	return loadOrder;
}

function buildQueryURL(location) {
	return config.baseURL + '/'
		+ config.dataKind + '/'
		+ config.zoom + '/'
		+ location.tileX + '/'
		+ location.tileY + '.'
		+ config.fileFormat
		+ '?api_key='
		+ config.api_key;
}

//convert lat/lon to mercator style number
function lon2tile(lon, zoom) {
	return (Math.floor((parseFloat(lon) + 180) / 360 * Math.pow(2, parseInt(zoom, 10))));
}

function lat2tile(lat, zoom)  {
	return (Math.floor((
			1 - Math.log(Math.tan(parseFloat(lat) * Math.PI / 180) + 1 
			/ Math.cos(parseFloat(lat) * Math.PI / 180)) / Math.PI
		) / 2 * Math.pow(2, parseInt(zoom, 10))));
}

function tile2Lon(lon, zoom) {
	return (lon * 360 / Math.pow(2, zoom) - 180).toFixed(10);
}

function tile2Lat(lat, zoom) {
	return (
		(360 / Math.PI) * Math.atan(
			Math.pow( Math.E, (Math.PI - 2 * Math.PI * lat / (Math.pow(2, zoom))))
		) - 90
	).toFixed(10);
}
