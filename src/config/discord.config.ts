import {envRequired} from './foundation/utils';

export const discordConfig = Object.freeze({
    token: envRequired('DISCORD_TOKEN'),
});
