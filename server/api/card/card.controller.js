'use strict';

var _ = require('lodash');
var io = require('../../app');
var r = require('rethinkdb');
var connection = null;

// Get list of cards
exports.index = function(req, res) {

    r.connect({
        host: 'ec2-52-16-192-128.eu-west-1.compute.amazonaws.com',
        port: 28015
    }, function(err, conn) {
        if (err) {
            throw err;
        }
        connection = conn;
        r.table('cards').run(connection, function(err, cursor) {
            if (err) {
                throw err;
            }
            cursor.toArray(function(err, result) {
                if (err) {
                    throw err;
                }
                console.log(JSON.stringify(result, null, 2));
                res.json(result);
            });
        });
    });

    /*res.json([{
        game: 'Starcraft 2',
        time: new Date(),
        creator: 'Thenanox',
        description: 'Starcraft 2 ladder with zerg, need terran partner',
        platform: 'Battle.net',
        Slots: 1,
        waitlist: 0
    }, {
        game: 'Dota 2',
        time: new Date(),
        creator: 'Rubo',
        description: 'Want to play with 4 partners',
        platform: 'Steam',
        Slots: 4,
        waitlist: 0
    }]);*/
};
