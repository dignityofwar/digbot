import {DiscordTypes} from 'detritus-client-rest';
import MessageEmbed = DiscordTypes.MessageEmbed;

export class CommandException extends Error {
    constructor(
        public readonly response: string | MessageEmbed,
    ) {
        super();
    }
}
