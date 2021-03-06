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
var r = require('rethinkdb');
var connection = null;
require('./config/express')(app);
require('./routes')(app);

r.connect({
    host: 'ec2-52-16-192-128.eu-west-1.compute.amazonaws.com',
    port: 28015
}, function (err, conn) {
    if (err) {
        throw err;
    }
    connection = conn;
    r.table('member').changes().run(connection, function (err, cursor) {
        if (err) {
            throw err;
        }
        cursor.each(function (err, row) {
            if (err) {
                throw err;
            }
            console.log(JSON.stringify(row, null, 2));
            io.sockets.emit('new-identified', {
                name: row.new_val.name,
                timestamp: new Date().getTime()
            });
        });
    });
});

io.sockets.on('connection', function (socket) {
    r.table('member').run(connection, function (err, cursor) {
        if (err) {
            throw err;
        }
        cursor.toArray(function (err, result) {
            if (err) {
                throw err;
            }
            console.log(JSON.stringify(result, null, 2));
            io.sockets.emit('new-identified', {
                name: result[0].name,
                timestamp: new Date().getTime()
            });
        });
    });

    socket.on('identified', function (data, fn) {
        console.log(data);
        r.table('member').update({
            name: data.name
        }).
        run(connection, function (err, result) {
            if (err) {
                throw err;
            }
            console.log(JSON.stringify(result, null, 2));
            io.sockets.emit('blast', {
                msg: '<span style=\"color:red !important\">' + data.name + ' connected</span>'
            });
            fn();
        });
    });

    socket.on('blast', function (data, fn) {
        console.log(data);
        io.sockets.emit('blast', {
            msg: data.msg
        });

        fn(); //call the client back to clear out the field
    });
});

// Start server
server.listen(config.port, config.ip, function () {
  console.log('Express server listening on %d, in %s mode', config.port, app.get('env'));
});

// Expose app
exports = module.exports = app;
