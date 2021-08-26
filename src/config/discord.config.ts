import {envRequired} from './foundation/utils';

export const discordConfig = {
    token: envRequired('DISCORD_TOKEN'),
};
