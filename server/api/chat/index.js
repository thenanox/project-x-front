'use strict';

var io = require('../../app');
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

r.table('member').changes().run(connection, function(err, cursor) {
    if (err) {
        throw err;
    }
    cursor.each(function(err, row) {
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
