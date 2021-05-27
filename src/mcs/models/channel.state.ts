import {GuildMember, VoiceChannel} from 'discord.js';
import {Group} from './group';

export class ChannelState {
    public canBeRenamed: boolean;

    public owner?: GuildMember;

    constructor(
        public readonly group: Group,
        public readonly channel: VoiceChannel,
    ) {
        this.canBeRenamed = channel.members.size == 0;
    }

    get channelId(): string {
        return this.channel.id;
    }

    get isEmpty(): boolean {
        return this.channel.members.size === 0;
    }
}
