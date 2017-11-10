var express = require('express');
var router = express.Router();

var multer = require('multer'); // for parsing multipart/form-data
var formDataParse = multer().any();

var userRouter = require('./user');
var util = require('./util');

//import config options
var config = require('./../config.js');

// GET root page
router.get('/', function(request, response) {
	response.render('index', {
		//do stuff
	});
});

//route for mapzen tile api / cache (requires mongodb)
if (config.mapzen.enabled && config.mongodb.enabled) {
	var tiles = require('./tiles');
	router.get('/tiles/:lat/:lon/:area', tiles.getTiles);
}

//route for login page
if (config.login.enabled) {
	router.use("/user", formDataParse, util.mergeReqParams, util.mergeJSONKeyValue, userRouter);
}

//route for vertica call logs
if (config.verticadb.enabled) {
	var calls = require('./calls');
	router.get('/calls/:type/', calls.getCalls);
}

module.exports = router;