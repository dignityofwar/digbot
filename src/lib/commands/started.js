//  Copyright © 2018 DIG Development team. All rights reserved.

'use strict';

// !started module

module.exports = {
    // Calculates runtime and returns formated message
    duration(started) {
        const timenow = new Date();
        let x = timenow.getTime() - started.getTime();
        x /= 1000;
        let seconds = x % 60;
        x /= 60;
        let minutes = x % 60;
        x /= 60;
        let hours = x % 24;
        x /= 24;
        let days = x;
        seconds = Math.floor(seconds);
        minutes = Math.floor(minutes);
        hours = Math.floor(hours);
        days = Math.floor(days);

        /* This section decides what to feed up to bot.js based on how long the
        bots been running. Plural and singular is an issue here, may have to
        come up with a better solution. */
        if (days >= 1) {
            return `I've been running for: ${days} days, ${hours} hours, ${minutes} minutes, `
                + `${seconds} seconds. Give a bot a break.`;
        } else if (hours >= 1) {
            return `I've been running for: ${hours} hours, ${minutes} minutes, ${seconds} seconds. `
                + 'Starting to get tired.';
        } else if (minutes >= 1) {
            return `I've been running for: ${minutes} minutes, ${seconds} seconds. `
                + 'One of these days I\'ll make it to an hour without some fool restarting me.';
        }
        return `I've been running for: ${seconds} seconds. I haven't even been here a minute `
            + 'why are you asking?';
    },
};
