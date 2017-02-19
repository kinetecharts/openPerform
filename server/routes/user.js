var express = require('express');
var router = express.Router();

var config = require('./../config.js');

router.all('/login', (req, res) => {

    if (req.body.password === 'undefined') {
        return res.send({
            status: 1,
            message: 'password is empty'
        });
    } else if (req.body.password == config.login.password) {
        //1 day
        res.cookie('siteUser', 'siteUser', {
            maxAge: 86400000,
            expires: new Date(Date.now() + 86400000)
        });
        return res.send({
            status: 0,
            message: 'Login Success'
        });
    } else {
        return res.send({
            status: 1,
            message: 'Incorrect Password'
        });
    }

});


module.exports = router;