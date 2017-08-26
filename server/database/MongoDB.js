var mongoose = require('mongoose');

var config = require('./../config.js').mongodb;

//connect mongoose
mongoose.connect('mongodb://localhost/' + config.dbName);

//mongoose event listeners
mongoose.connection.on('error', console.error.bind(console, 'Mongo connection error: '));
mongoose.connection.once('open', function() {
	console.log('Mongo connected at mongodb://localhost/' + config.dbName);
});