var request = require('request');

exports.getCalls = function(req, res, next) {
	var verticaQuery = req.app.locals.verticadb.query("select 1 from ringcentral");
	verticaQuery.callback = function (err, result) {
		res.send({ status: err ? 1 : 0, content: result, message: err ? err.message : "query success " });
	};
};
