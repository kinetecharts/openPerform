/**
 * @author Travis Bennett
 * @email 
 * @create date 2018-08-26 07:50:04
 * @modify date 2018-09-11 08:02:57
 * @desc [Listen for and rebroadcast Kinect v2 data.]
*/

// {"host": "192.168.1.189", "port": "1234", "path": "/openPerform", "secure": false}

var config = require('../config').kinectron;

var PeerServer = require('peer').PeerServer;
var peerserver = PeerServer({
  debug: true,
  port: config.ports.incoming,
  path: '/openPerform',
});

peerserver.on('open', (id) => { console.log('open', id); });
peerserver.on('connection', (id) => { console.log('connection', id); });
peerserver.on('call', (a, b) => { console.log('call', a, b); });
peerserver.on('close', (a, b) => { console.log('close', a, b); });
peerserver.on('disconnected', (a, b) => { console.log('disconnected', a, b); });
peerserver.on('error', (a, b) => { console.log('error', a, b); });
peerserver.on('message', (a, b) => { console.log('message', a, b); });
peerserver.on('data', (a, b) => { console.log('data', a, b); });
