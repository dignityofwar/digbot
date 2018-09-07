//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !sort module, triggers a global position sort

const config = require('config');
const positions = require('../admin/channels/positions.js');

module.exports = {
    execute: function() {
        if (config.get('features.channelPositionsEnforcement') !== true) {
            return 'Sorry but the channel position enforcement feature is currently disabled';
        }

        positions.globalCheck();

        return 'Sent global sort request to channels/positions.js';
    }
};
