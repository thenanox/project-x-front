'use strict';

var _ = require('lodash');

// Get list of cards
exports.index = function(req, res) {
    res.json([{
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
    }]);
};
