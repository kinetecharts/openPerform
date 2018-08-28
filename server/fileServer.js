/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 07:42:28
 * @modify date 2018-08-26 07:42:28
 * @desc [The file server serves the static, production version of the app. ]
*/

const path = require('path');
const express = require('express')
const serveStatic = require('serve-static')

const config = require('./config');

const app = express()

app.use(serveStatic(path.join(__dirname, './../dist')))

const server = app.listen(config.browserSync.port, () => {
  var host = server.address().address;
  var port = server.address().port;

  console.log('listening at http://%s:%s', host, port);
});