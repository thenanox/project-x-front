/**
 * Main application file
 */

'use strict';

// Set default node environment to development
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var express = require('express');
var config = require('./config/environment');
// Setup server
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
require('./config/express')(app);
require('./routes')(app);

//Setup database
var r = require('rethinkdb');
var connection = null;

r.connect({
    host: 'ec2-52-16-192-128.eu-west-1.compute.amazonaws.com',
    port: 28015
}, function (err, conn) {
    if (err) {
        throw err;
    }
    connection = conn;
});


// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
exports = module.exports = io;
exports = module.exports = r;
exports = module.exports = connection;
