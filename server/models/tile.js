var mongoose = require('mongoose');

var Tile = mongoose.Schema({
	createdAt: { type: Date, expires: '24h', default: Date.now },
	location: Object,
	expire: Date,
	tile: Object
});

module.exports = mongoose.model('tile', Tile);