//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// Temporary module to store regular events, to be replaced with website intergration.
// Note: Please be extremely careful when altering this module, it will and has fucked up our shit

const config = require('config');
const logger = require('../../logger.js');
const TAG = 'Hard Coded Events';

module.exports = {
    pass: function() {
        return events;
    },

    // Called on bot.ready, calculates event lengths and stores inside hardcoded event objects
    ready: function() {
        for (let i = 0; i < events.length; i++) {
            let ms = 0;
            if (events[i].starthour <= events[i].endhour) {
                ms = 3600000 * (events[i].endhour - events[i].starthour);
            } else if (events[i].starthour > events[i].endhour) {
                ms = 3600000 * (events[i].endhour + 24 - events[i].starthour);
            }
            ms += 60000 * (events[i].endminute - events[i].startminute);
            ms += config.get('eventProtection');
            events[i].eventlength = ms;
        }
    },

    //  Passed channel object from autodelete.js, finds the event and returns its expected length
    length: function(channel) {
        for (let i = 0; i < events.length; i++) {
            if (events[i].days.indexOf(channel.createdAt.getDay()) != -1) {
                for (let j = 0; j < events[i].channels.length; j++) {
                    if (events[i].channels[j].name === channel.name.substring(0, (channel.name.length - 3))) {
                        if (channel.type === events[i].channels[j].type) {
                            return events[i].eventlength;
                        }
                    }
                }
            }
        }
        logger.error(TAG, 'Unable to find eventlength for event channel: ' + channel.name);
        return 0;
    }
};

/*
This module stores repeating event objects as an array, the format for these events are:

All dates are UTC
If an array has only one element, still use an array
For integers such as startminute, if the number is 0-9 use only one digit Ex: 9 not 09
Do not put spaces in channel names, names can be alphanumerical with only the characters - and _
Starting events between 00:00 and 00:30 will currently fuck us

{
    name: 'DIGT Ops', // The name of the event
    description: 'DIGT ops run every wed and fri, all welcome', // Posted in alert message and in channel topic
    days: [2, 5], // 1 - 7
    starthour: 17, // 0 - 23
    startminute: 48,  // 0 - 59
    endhour: 20, // 0 - 23
    endminute: 0, // 0 - 59
    roles: ['232589924191174657',   '232875887614361610'], // Role IDs to '@mention'
    channels: [
        {
            name: 'DIGT/OPS/1', // Name of the channel to be created
            type: 'voice' // Type of  channel to be created
        },
        {
            name: 'DIGT/OPS/2',
            type: 'voice'
        }
    ]
}

*/
let DIGTCommonChannels = [
    {
        name: 'DIGT/Ops/Lounge',
        type: 'voice'
    },
    {
        name: 'DIGT/Ops/1',
        type: 'voice'
    },
    {
        name: 'digt-ops-feedback',
        type: 'text'
    }
];
let DIGTCommonRoles = [
    '90092974523826176',
    '200995317024292865',
    '189767484495233024'
];

let events = [
    {
        name: 'DIGT Tactical Casual Ops',
        description: 'DIGT ops on Wednesdays are a mix between Casual and Tactical, usually decided ' +
        'on the night. All are welcome, usually held on TS at 94.23.13.182:9981',
        days: [3],
        starthour: 18,
        startminute: 0,
        endhour: 20,
        endminute: 0,
        roles: DIGTCommonRoles,
        channels: DIGTCommonChannels,
        millernotification: true
    },
    {
        name: 'DIGT Tactical Ops',
        description: 'DIGT Friday ops are tactical, they rely on squad cohesion and comms ' +
        'discipline. All are welcome, usually held on TS at 94.23.13.182:9981',
        days: [5],
        starthour: 18,
        startminute: 0,
        endhour: 20,
        endminute: 0,
        roles: DIGTCommonRoles,
        channels: DIGTCommonChannels,
        millernotification: true
    }
];
