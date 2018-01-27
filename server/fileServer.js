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