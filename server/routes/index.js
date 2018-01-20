var express = require('express');
var router = express.Router();

var multer = require('multer'); // for parsing multipart/form-data
var formDataParse = multer().any();

var util = require('./util');

//import config options
var config = require('./../config.js');

// GET root page
router.get('/', function(request, response) {
	response.render('index', {
		//do stuff
	});
});

module.exports = router;