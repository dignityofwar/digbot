import {MessageEmbed} from 'discord.js';

export class CommandException extends Error {
    constructor(
        public readonly response: string | MessageEmbed,
    ) {
        super();
    }
}
