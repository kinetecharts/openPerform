var vertica = require('vertica');

var config = require('./../config.js').verticadb;

var verticaConnection = vertica.connect(config, function (err) {
	if (err) {
		verticaConnection.disconnect();
		// res.send({ status: 1, message: "connect fail" });
	} else {
		console.log('Vertica connected at localhost:' + config.port + '/' + config.database);
	}
});

module.exports = verticaConnection;