import {Guild, GuildMember, Message, TextChannel} from 'discord.js';

export class CommandRequest {
    public readonly guild: Guild;
    public readonly channel: TextChannel;
    public readonly member: GuildMember;

    constructor(
        public readonly message: Message,
        public readonly args: string[],
    ) {
        this.guild = message.guild;
        this.channel = message.channel as TextChannel;
        this.member = message.member;
    }
}