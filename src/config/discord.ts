import { get } from '../utils/env';

export default class Discord {
    /**
     * @type {string} The Discord token used to connect to Discord
     */
    public readonly token: string = get('DISCORD_TOKEN');
}
