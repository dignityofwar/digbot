//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Module to handle autodeletion of temp channels, called periodically from admin.js

const logger = require('../../logger.js');
const channels = require('./channelsMaster.js');
const hardcode = require('./hardcodeevents.js');

const TAG = 'Ch Auto Delete';

module.exports = {
    execute(server) {
        let count = 0;
        let deleted = 0;
        for (const ch of server.channels) {
            if (ch[1].name.endsWith('-t-')) {
                count += 1;
                if ((Date.now() - Date.parse(ch[1].createdAt)) > 300000) {
                    if (channels.deleteInactive(ch[1])) {
                        deleted += 1;
                    }
                }
            }
            if (ch[1].name.endsWith('-e-')) {
                count += 1;
                if ((Date.now() - Date.parse(ch[1].createdAt)) > hardcode.length(ch[1])) {
                    if (channels.deleteInactive(ch[1])) {
                        deleted += 1;
                    }
                }
            }
        }
        if (count > 0) {
            logger.info(TAG, `Automatically deleted ${deleted} of ${count} temp/event channels ` +
                'due to inactivity');
        }
    },
};
