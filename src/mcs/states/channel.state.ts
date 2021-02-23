import {Channel} from '../entities/channel.entity';
import {VoiceChannel} from 'discord.js';
import {GroupState} from './group.state';

export class ChannelState {
    deleted = false;
    occupied: boolean;
    parent: string;
    position: number;

    constructor(
        public readonly groupState: GroupState,
        public readonly channel: Channel,
        voiceChannel: VoiceChannel,
    ) {
        this.occupied = voiceChannel.members.size > 0;
        this.parent = voiceChannel.parentID;
        this.position = voiceChannel.rawPosition;
    }

    get channelId(): string {
        return this.channel.channelId;
    }
}
